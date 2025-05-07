import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

// Variable para hacer seguimiento del estado de habla
let _isSpeaking = false;

// Función para hablar texto
export const speakText = (text, onDone = null) => {
    if (!text) return;
    
    // Detener cualquier habla anterior
    Speech.stop();
    
    _isSpeaking = true;
    
    const options = {
        language: 'es-ES',
        pitch: 1.0,
        rate: Platform.OS === 'ios' ? 0.55 : 0.9, // Ajustar según plataforma
        onDone: () => {
            _isSpeaking = false;
            if (onDone) onDone();
        },
        onError: (error) => {
            console.error("Error en síntesis de voz:", error);
            _isSpeaking = false;
            if (onDone) onDone();
        },
        onStopped: () => {
            _isSpeaking = false;
            if (onDone) onDone();
        }
    };

    Speech.speak(text, options);
};

// Función para hablar mensajes de error con una configuración distinta
export const speakError = (text, onDone = null) => {
    if (!text) return;
    
    // Detener cualquier habla anterior
    Speech.stop();
    
    _isSpeaking = true;
    
    const options = {
        language: 'es-ES',
        pitch: 1.1, // Tono ligeramente más alto para error
        rate: Platform.OS === 'ios' ? 0.5 : 0.85,
        onDone: () => {
            _isSpeaking = false;
            if (onDone) onDone();
        },
        onError: (error) => {
            console.error("Error en síntesis de voz (error):", error);
            _isSpeaking = false;
            if (onDone) onDone();
        },
        onStopped: () => {
            _isSpeaking = false;
            if (onDone) onDone();
        }
    };

    Speech.speak(text, options);
};

// Función para verificar si está hablando
export const isSpeaking = () => {
    return _isSpeaking;
};

// Función para detener el habla
export const stopSpeaking = () => {
    Speech.stop();
    _isSpeaking = false;
};