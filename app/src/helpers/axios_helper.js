import axios from 'axios';
import { Platform } from 'react-native';
import { REACT_NATIVE_SERVER_IP } from '@env';
const isWeb = () => {
  return typeof window !== 'undefined' && window.localStorage;
};

// Obtener el token de autenticación de localStorage (web) o AsyncStorage (React Native)
export const getAuthToken = () => {
  if (isWeb()) {
    const token = window.localStorage.getItem('auth_token');
    return token !== "null" ? token : null;
  }
  // Para entornos React Native, deberías retornar null o implementar AsyncStorage
  return null;
};

// Guardar el token de autenticación
export const setAuthHeader = (token) => {
  if (isWeb()) {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }
  // Implementar AsyncStorage para React Native si es necesario
};

export const getServer = () => {
  // En desarrollo y en dispositivo físico
  if (__DEV__ && (Platform.OS === 'ios' || Platform.OS === 'android')) {
    return REACT_NATIVE_SERVER_IP; // Tu IP en la red local
  }
  // En web o en producción
  return 'localhost';
};

axios.defaults.baseURL = `http://${getServer()}:8080/`;

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Agregar interceptor de respuesta para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Si el token expiró (401) o no está autorizado (403)
      if (error.response.status === 401 || error.response.status === 403) {
        // Limpiar el token
        setAuthHeader(null);
        
        // Obtener el navigate y redirigir
        const navigate = getNavigator();
        if (navigate) {
          navigate('/login');
        }
        
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const request = (method, url, data) => {
  let headers = {};
  const authToken = getAuthToken();
  console.log("Auth token:", authToken);

  if (authToken !== null && authToken !== "null" && url !== '/register' && url !== '/login') {
    headers = { 'Authorization': `Bearer ${authToken}` };
    console.log(" header:", headers.Authorization);
  }

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data
  })
  .then(response => {
    console.log("Response received:", response);
    return response;
  })
  .catch(error => {
    console.error("Error in request:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      return Promise.reject(error.response);
    } else if (error.request) {
      console.error("No response received:", error.request);
      return Promise.reject({ message: "No response from server", request: error.request });
    } else {
      console.error("Error setting up the request:", error.message);
      return Promise.reject({ message: error.message });
    }
  });
};