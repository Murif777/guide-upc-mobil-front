import * as Speech from 'expo-speech';

export const speakText = (text) => {
  return Speech.speak(text, {
    language: 'es-ES',
    pitch: 0.4,
    rate: 0.9,
    voice: 'Microsoft Sabina - Spanish (Mexico)',
  });
};

export const speakError = (errorMessage = "Error al procesar la consulta.") => {
  return Speech.speak(errorMessage, {
    language: 'es-ES',
    voice: 'Microsoft Raul - Spanish (Mexico)',
  });
};