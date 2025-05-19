import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Image, Vibration, Text, View, StyleSheet, Platform } from "react-native";
import { VoiceContext } from "../hooks/useVoice"; 
//import * as Speech from 'expo-speech';

export default function MainButton() {
    const { 
        isSpeaking, 
        setIsSpeaking, 
        startListening, 
        stopListening, 
        isListening,
        stopSpeaking,
        isAvailable,
        partialResults,
        isButtonPressed, // Usar el nuevo estado
        setIsButtonPressed // Usar la función para modificar el estado
    } = useContext(VoiceContext);

    const [buttonState, setButtonState] = useState('ready'); // 'ready', 'listening', 'processing'
    const [currentText, setCurrentText] = useState('Presiona para iniciar');

    // Actualizar texto basado en resultados parciales
    useEffect(() => {
        if (!isButtonPressed) {
            setCurrentText('Presiona para iniciar');
        } else if (isListening && partialResults.length > 0 && partialResults[0].trim() !== '') {
            setCurrentText(`"${partialResults[0]}"`);
        } else if (isListening) {
            setCurrentText('Escuchando...');
        } else if (isSpeaking) {
            setCurrentText('Hablando...');
        } else if (buttonState === 'processing') {
            setCurrentText('Procesando...');
        } else {
            setCurrentText('Presiona para hablar');
        }
    }, [isListening, isSpeaking, buttonState, partialResults, isButtonPressed]);

    // Función para controlar el botón de voz
    const handleVoiceButton = async () => {
        // Vibrar para feedback táctil (si está disponible en la plataforma)
        if (Platform.OS !== 'web') {
            Vibration.vibrate(100);
        }

        // Si el botón nunca ha sido presionado, lo marcamos como inicializado
        if (!isButtonPressed) {
            setIsButtonPressed(true);
            return; // Solo inicializamos la app, no continuamos con la lógica de voz todavía
        }

        // Si el sistema está hablando, lo detenemos
        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        // Si estamos escuchando, detenemos la escucha y procesamos
        if (isListening) {
            setButtonState('processing');
            await stopListening();
            setTimeout(() => setButtonState('ready'), 1000); // Volver a listo después de procesar
            return;
        }

        // Verificar si el reconocimiento de voz está disponible
        if (!isAvailable) {
            alert('El reconocimiento de voz no está disponible en este dispositivo/navegador.');
            return;
        }

        // Si no estamos escuchando ni hablando, iniciamos la escucha
        try {
            setButtonState('listening');
            const started = await startListening();
            if (!started) {
                setButtonState('ready');
            }
        } catch (error) {
            console.error("Error al iniciar reconocimiento de voz:", error);
            setButtonState('ready');
            alert('Error al iniciar el reconocimiento de voz. Inténtalo de nuevo.');
        }
    };

    // Indicador visual basado en el estado
    const getButtonStyle = () => {
        if (!isButtonPressed) return styles.notInitialized; // Nuevo estilo para el botón no inicializado
        if (isSpeaking) return styles.speaking;
        if (isListening) return styles.listening;
        if (buttonState === 'processing') return styles.processing;
        return styles.ready;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                onPress={handleVoiceButton}
                style={[styles.button, getButtonStyle()]}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel={isButtonPressed ? "Botón de control de voz" : "Botón para iniciar la aplicación"}
                accessibilityHint={isButtonPressed 
                    ? "Presiona para hablar, presiona mientras escucha para detener, presiona mientras habla para detener la respuesta" 
                    : "Presiona para comenzar a usar la aplicación"}
                accessibilityRole="button"
            >
                <Image
                    source={require('../../assets/images/eye.png')} 
                    style={styles.image}
                    accessible={true}
                    accessibilityLabel="Ícono de ojo para control de voz"
                />
                <Text style={styles.statusText}>
                    {currentText}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 100,
        borderWidth: 2,
    },
    image: {
        resizeMode: 'contain',
        height: 120,
        width: 120,
    },
    statusText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    notInitialized: {
        borderColor: '#9C27B0', // Color púrpura para el estado no inicializado
        borderWidth: 3,
    },
    ready: {
        borderColor: '#4CAF50',
    },
    listening: {
        borderColor: '#2196F3',
        borderWidth: 3,
    },
    processing: {
        borderColor: '#FF9800',
    },
    speaking: {
        borderColor: '#F44336',
    }
});