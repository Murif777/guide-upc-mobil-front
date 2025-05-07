import React, { useState, useEffect, useContext } from "react";
import { Text, TextInput, Button, View, StyleSheet, Alert } from "react-native";
import { enviarConsulta } from "../../services/AssistantService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speakText } from "../specificComponent/Speech"; 
import { VoiceContext } from "../hooks/useVoice";
import {Camara} from "./camara";

export default function MainSpeech() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("Bienvenido a guide UPC");
    const [userName, setUserName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);
    const [showCamera, setShowCamera] = useState(false); // Estado para controlar el renderizado de la cámara

    // Acceder al contexto de voz
    const { 
        setIsSpeaking, 
        transcribedText, 
        resetTranscription,
        setInputText: setVoiceInputText,
        isListening
    } = useContext(VoiceContext);

    useEffect(() => {
        checkFirstTimeUser();
    }, []);
    
    // Escuchar cambios en la transcripción de voz
    useEffect(() => {
        if (transcribedText && transcribedText.trim() !== "") {
            setInputText(transcribedText);
            setTimeout(() => {
                handleVoiceSubmit(transcribedText);
                resetTranscription();
            }, 500); // Pequeño retraso para mejor experiencia de usuario
        }
    }, [transcribedText]);

    const checkFirstTimeUser = async () => {
        try {
            const storedName = await AsyncStorage.getItem('userName');
            
            if (storedName !== null) {
                // No es la primera vez, dar la bienvenida personalizada
                setUserName(storedName);
                const welcomeMessage = `Bienvenido ${storedName}. ¿A dónde te gustaría ir hoy?`;
                setResponseText(welcomeMessage);
                speakWithStateTracking(welcomeMessage);
            } else {
                // Es la primera vez, pedir el nombre
                setShowNameInput(true);
                const welcomeMessage = "Bienvenido a guide UPC. ¿Cuál es tu nombre?";
                setResponseText(welcomeMessage);
                speakWithStateTracking(welcomeMessage);
            }
        } catch (error) {
            console.error("Error al verificar el usuario:", error);
            setResponseText("Bienvenido a guide UPC");
            speakWithStateTracking("Bienvenido a guide UPC");
        }
    };

    // Función para hablar y actualizar el estado de habla
    const speakWithStateTracking = (text) => {
        setIsSpeaking(true);
        speakText(text, () => {
            setIsSpeaking(false);
        });
    };

    const saveName = async () => {
        if (inputText.trim() === "") {
            Alert.alert("Campo vacío", "Por favor ingresa tu nombre");
            speakWithStateTracking("Campo vacío. Por favor ingresa tu nombre.");
            return;
        }

        try {
            await AsyncStorage.setItem('userName', inputText);
            setUserName(inputText);
            setShowNameInput(false);
            
            const welcomeMessage = `Hola ${inputText}, bienvenido a guide UPC. ¿A dónde te gustaría ir hoy?`;
            setResponseText(welcomeMessage);
            speakWithStateTracking(welcomeMessage);
            setInputText("");
            setVoiceInputText("");
        } catch (error) {
            console.error("Error al guardar el nombre:", error);
            const errorMsg = "No se pudo guardar tu nombre";
            Alert.alert("Error", errorMsg);
            speakWithStateTracking(errorMsg);
        }
    };

    const handleSubmit = async () => {
        // Si estamos pidiendo el nombre, usamos otra función
        if (showNameInput) {
            saveName();
            return;
        }

        await processQuery(inputText);
    };

    const handleVoiceSubmit = async (voiceText) => {
        // Si estamos pidiendo el nombre, usamos otra función
        if (showNameInput) {
            setInputText(voiceText);
            saveName();
            return;
        }

        await processQuery(voiceText);
    };

    const checkForKeywords = (response) => {
        const keywords = ["ir", "llegar"]; // Diccionario de palabras clave
        const lowerCaseResponse = response.toLowerCase();

        // Verificar si alguna palabra clave está en la respuesta
        const containsKeyword = keywords.some((keyword) => lowerCaseResponse.includes(keyword));

        if (containsKeyword) {
            return `${response} Para una mejor navegación por el campus, busca un punto de referencia y di la frase "Usar cámara".`;
        }

        return response;
    };

    const handleSpecialQueries = (query) => {
        if (query.toLowerCase().includes("usar cámara")) {
            openCamera(); // Llama al método para abrir el componente Camara
            return true; // Indica que se manejó el query
        }

        if (query.toLowerCase().includes("ayuda")) {
            pedirAyuda(); // Llama al método para pedir ayuda
            return true; // Indica que se manejó el query
        }

        return false; // Indica que no se manejó el query
    };

    const pedirAyuda = () => {
        // Método vacío por ahora
        speakWithStateTracking("No te preocupes y manten la calma, la ayuda está en camino a tu ubicación.");
    };

    const processQuery = async (query) => {
        if (query.trim() === "") {
            const emptyMsg = "Por favor ingresa tu consulta";
            Alert.alert("Campo vacío", emptyMsg);
            speakWithStateTracking(emptyMsg);
            return;
        }

        // Verificar si el query contiene frases especiales
        const handled = handleSpecialQueries(query);
        if (handled) {
            return; // Si se manejó el query, no continúa con el envío
        }

        try {
            const response = await enviarConsulta(query);

            // Verificar palabras clave y modificar la respuesta si es necesario
            const modifiedResponse = checkForKeywords(response);

            setResponseText(modifiedResponse);

            // Habla la respuesta y actualiza el estado
            speakWithStateTracking(modifiedResponse);

            // Limpia el input después de enviar
            setInputText("");
            setVoiceInputText("");
        } catch (error) {
            console.error("Error en la consulta:", error);
            const errorMessage = "Error al procesar la consulta.";
            setResponseText(errorMessage);
            speakWithStateTracking(errorMessage);
        }
    };

    // --------------------------------------Método para abrir el componente Camara
    const openCamera = () => {
        setResponseText("Abriendo la cámara...");
        speakWithStateTracking("Abriendo la cámara...");
        setShowCamera(true); // Cambiar el estado para mostrar la cámara
    };

    // Renderizado condicional
    if (showCamera) {
        return <Camara />; // Renderiza el componente Camara si showCamera es true
    }

    return (
        <View style={styles.container}>
            {/*<Text 
                style={styles.text}
                accessible={true}
                accessibilityLabel={`Respuesta del asistente: ${responseText}`}
                accessibilityRole="text"
            >
                {responseText}
            </Text>
            
            {isListening ? (
                <View style={styles.listeningIndicator}>
                    <Text style={styles.listeningText}>Escuchando...</Text>
                </View>
            ) : (
                <TextInput
                    style={styles.input}
                    placeholder={showNameInput ? "Escribe tu nombre" : "Escribe tu consulta"}
                    value={inputText}
                    onChangeText={(text) => {
                        setInputText(text);
                        setVoiceInputText(text);
                    }}
                    accessible={true}
                    accessibilityLabel={showNameInput ? "Campo para escribir tu nombre" : "Campo para escribir tu consulta"}
                    accessibilityHint="Ingresa texto o usa el botón de voz para hablar"
                />
            )}
            
            <Button 
                title={showNameInput ? "Guardar" : "Enviar"} 
                onPress={handleSubmit}
                accessible={true}
                accessibilityLabel={showNameInput ? "Botón para guardar nombre" : "Botón para enviar consulta"}
            />*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
        width: "100%",
        backgroundColor: "white",
    },
    listeningIndicator: {
        height: 40,
        width: "100%",
        backgroundColor: "rgba(33, 150, 243, 0.3)",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    listeningText: {
        color: "white",
        fontWeight: "bold",
    },
});