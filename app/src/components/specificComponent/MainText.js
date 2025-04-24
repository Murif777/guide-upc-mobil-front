import React, { useState } from "react";
import { Text, TextInput, Button, View, StyleSheet } from "react-native";
import { enviarConsulta } from "../../services/AssistantService";
import * as Speech from 'expo-speech';

export default function MainText() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("Bienvenido a guide UPC");

    const handleSubmit = async () => {
        try {
            const response = await enviarConsulta(inputText);
    
            // Habla la respuesta con expo-speech
            Speech.speak(response, {
                language: 'es-ES',
                pitch: 0.4,
                rate: 0.9,
                voice: 'Microsoft Sabina - Spanish (Mexico)', 
            });
    
        } catch (error) {
            const errorMessage = "Error al procesar la consulta.";
            setResponseText(errorMessage);
            Speech.speak(errorMessage, {
                language: 'es-ES',
                voice: 'Microsoft Raul - Spanish (Mexico)',  
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{responseText}</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu consulta"
                value={inputText}
                onChangeText={setInputText}
            />
            <Button title="Enviar" onPress={handleSubmit} />
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
