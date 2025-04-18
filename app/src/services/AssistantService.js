import { request } from '../helpers/axios_helper';

export const enviarConsulta = async (texto) => {
    try {
        const consultaDTO = { texto };
        const response = await request('post', '/api/ia-navegacion/consulta', consultaDTO);
        console.log("Respuesta completa del servidor:", response);
        return response.data;
    } catch (error) {
        console.error('Error al enviar consulta al asistente:', error);
        throw error;
    }
};