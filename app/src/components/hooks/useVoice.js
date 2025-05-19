import React, { createContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import * as SpeechRecognition from 'expo-speech-recognition';

export const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcribedText, setTranscribedText] = useState('');
    const [inputText, setInputText] = useState('');
    const [partialResults, setPartialResults] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [isButtonPressed, setIsButtonPressed] = useState(false); // Nuevo estado para inicialización de la app

    // Verificar disponibilidad del reconocimiento de voz al cargar
    useEffect(() => {
        checkAvailability();
    }, []);

    // Verificar si el reconocimiento de voz está disponible en el dispositivo
    const checkAvailability = async () => {
        try {
            if (Platform.OS === 'web') {
                // En la web, usamos la API de reconocimiento de voz del navegador
                setIsAvailable('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
            } else {
                // En dispositivos móviles, verificamos con expo-speech-recognition
                const available = await SpeechRecognition.isAvailableAsync();
                setIsAvailable(available);
                
                if (available) {
                    const { status } = await SpeechRecognition.requestPermissionsAsync();
                    setHasPermission(status === 'granted');
                }
            }
        } catch (error) {
            console.error('Error al verificar la disponibilidad del reconocimiento de voz:', error);
            setIsAvailable(false);
        }
    };

    // Web Speech API Recognition
    let webRecognition = null;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            webRecognition = new SpeechRecognition();
            webRecognition.continuous = false;
            webRecognition.interimResults = true;
            webRecognition.lang = 'es-ES';

            webRecognition.onstart = () => {
                setIsListening(true);
            };

            webRecognition.onend = () => {
                setIsListening(false);
            };

            webRecognition.onerror = (event) => {
                console.error('Error en reconocimiento de voz web:', event.error);
                setIsListening(false);
                Alert.alert('Error', 'No se pudo reconocer tu voz. Por favor, intenta de nuevo.');
            };

            webRecognition.onresult = (event) => {
                let partial = '';
                let final = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final = transcript;
                    } else {
                        partial = transcript;
                    }
                }
                
                if (partial) {
                    setPartialResults([partial]);
                }
                
                if (final) {
                    setTranscribedText(final);
                }
            };
        }
    }

    const startListening = async () => {
        // No iniciar si ya está escuchando o hablando
        if (isListening || isSpeaking) {
            return false;
        }

        // Reset estados
        setPartialResults([]);
        setTranscribedText('');

        try {
            if (Platform.OS === 'web') {
                // En la web, usamos la API de reconocimiento de voz del navegador
                if (webRecognition) {
                    webRecognition.start();
                    return true;
                } else {
                    Alert.alert('No disponible', 'El reconocimiento de voz no está disponible en este navegador.');
                    return false;
                }
            } else {
                // En dispositivos móviles, usamos expo-speech-recognition
                if (!isAvailable) {
                    Alert.alert('No disponible', 'El reconocimiento de voz no está disponible en este dispositivo.');
                    return false;
                }

                if (!hasPermission) {
                    const { status } = await SpeechRecognition.requestPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert('Sin permisos', 'Se necesitan permisos de micrófono para usar esta función.');
                        return false;
                    }
                    setHasPermission(true);
                }

                // Iniciar el reconocimiento
                setIsListening(true);
                
                SpeechRecognition.startListeningAsync({
                    language: 'es-ES',
                    partialResults: true,
                    onPartialResults: (results) => {
                        if (results && results.length > 0) {
                            setPartialResults(results);
                        }
                    },
                    onResults: (results) => {
                        if (results && results.length > 0) {
                            setTranscribedText(results[0]);
                        }
                    },
                    onError: (error) => {
                        console.error('Error en reconocimiento de voz expo:', error);
                        setIsListening(false);
                        Alert.alert('Error', 'No se pudo reconocer tu voz. Por favor, intenta de nuevo.');
                    },
                });
                
                return true;
            }
        } catch (error) {
            console.error('Error iniciando reconocimiento de voz:', error);
            setIsListening(false);
            Alert.alert('Error', 'Ocurrió un error al iniciar el reconocimiento de voz.');
            return false;
        }
    };

    const stopListening = async () => {
        try {
            if (Platform.OS === 'web') {
                if (webRecognition) {
                    webRecognition.stop();
                }
            } else {
                await SpeechRecognition.stopListeningAsync();
            }
            
            setIsListening(false);
            
            // Si hay resultados parciales, tomarlos como finales
            if (partialResults.length > 0 && partialResults[0].trim() !== '') {
                setTranscribedText(partialResults[0]);
            }
            
            return true;
        } catch (error) {
            console.error('Error deteniendo reconocimiento de voz:', error);
            setIsListening(false);
            return false;
        }
    };

    const resetTranscription = () => {
        setTranscribedText('');
        setPartialResults([]);
    };

    // Función para detener el habla
    const stopSpeaking = () => {
        Speech.stop();
        setIsSpeaking(false);
    };

    // Proporcionar el contexto a los componentes hijos
    return (
        <VoiceContext.Provider
            value={{
                isListening,
                isSpeaking,
                setIsSpeaking,
                transcribedText,
                startListening,
                stopListening,
                resetTranscription,
                inputText,
                setInputText,
                partialResults,
                stopSpeaking,
                isAvailable,
                hasPermission,
                isButtonPressed, // Nuevo estado
                setIsButtonPressed // Nueva función para modificar el estado
            }}
        >
            {children}
        </VoiceContext.Provider>
    );
};