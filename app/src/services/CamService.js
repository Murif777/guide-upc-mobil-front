import axios from 'axios'; 
import { getServer } from '../helpers/axios_helper';
export const CamService = {
  sendCam: async (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'capture.png');

    try {
      const response = await axios.post(
        `http://${getServer()}:8080/api/process-image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 1000,
        }
      );
      
      if (!response.data) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      // Si los resultados vienen como string JSON, parseamos
      if (typeof response.data.results === 'string') {
        try {
          const parsedResults = JSON.parse(response.data.results);
          return parsedResults;
        } catch (e) {
          console.error('Error parsing results:', e);
          return response.data.results;
        }
      }
      
      return response.data.results;
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      
      let errorMessage = 'Error desconocido al procesar la imagen';
      
      if (error.response) {
        errorMessage = error.response.data?.error || 
                      error.response.data?.message || 
                      `Error del servidor: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
};

export default CamService;