import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, View, StyleSheet, Alert } from "react-native";
import { enviarConsulta } from "../../services/AssistantService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speakText, speakError } from "../specificComponent/Speech"; 

export default function MainSpeech() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("Bienvenido a guide UPC");
    const [userName, setUserName] = useState("");
    const [showNameInput, setShowNameInput] = useState(false);

    useEffect(() => {
        checkFirstTimeUser();
    }, []);

    const checkFirstTimeUser = async () => {
        try {
            const storedName = await AsyncStorage.getItem('userName');
            
            if (storedName !== null) {
                // No es la primera vez, dar la bienvenida personalizada
                setUserName(storedName);
                const welcomeMessage = `Bienvenido ${storedName}. ¿A dónde te gustaría ir hoy?`;
                setResponseText(welcomeMessage);
                speakText(welcomeMessage);
            } else {
                // Es la primera vez, pedir el nombre
                setShowNameInput(true);
                const welcomeMessage = "Bienvenido a guide UPC. ¿Cuál es tu nombre?";
                setResponseText(welcomeMessage);
                speakText(welcomeMessage);
            }
        } catch (error) {
            console.error("Error al verificar el usuario:", error);
            setResponseText("Bienvenido a guide UPC");
            speakText("Bienvenido a guide UPC");
        }
    };

    const saveName = async () => {
        if (inputText.trim() === "") {
            Alert.alert("Campo vacío", "Por favor ingresa tu nombre");
            return;
        }

        try {
            await AsyncStorage.setItem('userName', inputText);
            setUserName(inputText);
            setShowNameInput(false);
            
            const welcomeMessage = `Hola ${inputText}, bienvenido a guide UPC. ¿A dónde te gustaría ir hoy?`;
            setResponseText(welcomeMessage);
            speakText(welcomeMessage);
            setInputText("");
        } catch (error) {
            console.error("Error al guardar el nombre:", error);
            Alert.alert("Error", "No se pudo guardar tu nombre");
        }
    };

    const handleSubmit = async () => {
        // Si estamos pidiendo el nombre, usamos otra función
        if (showNameInput) {
            saveName();
            return;
        }

        if (inputText.trim() === "") {
            Alert.alert("Campo vacío", "Por favor ingresa tu consulta");
            return;
        }

        try {
            const response = await enviarConsulta(inputText);
            setResponseText(response);
            
            // Usa el componente Speech para hablar la respuesta
            speakText(response);
            
            // Limpia el input después de enviar
            setInputText("");
        } catch (error) {
            console.error("Error en la consulta:", error);
            const errorMessage = "Error al procesar la consulta.";
            setResponseText(errorMessage);
            speakError(errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{responseText}</Text>
            <TextInput
                style={styles.input}
                placeholder={showNameInput ? "Escribe tu nombre" : "Escribe tu consulta"}
                value={inputText}
                onChangeText={setInputText}
            />
            <Button 
                title={showNameInput ? "Guardar" : "Enviar"} 
                onPress={handleSubmit} 
            />
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
});