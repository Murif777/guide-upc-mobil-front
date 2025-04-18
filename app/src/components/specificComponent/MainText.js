import React, { useState } from "react";
import { Text, TextInput, Button, View, StyleSheet } from "react-native";
import { enviarConsulta } from "../../services/AssistantService";

export default function MainText() {
    const [inputText, setInputText] = useState("");
    const [responseText, setResponseText] = useState("Bienvenido a guide UPC");

    const handleSubmit = async () => {
        try {
            const response = await enviarConsulta(inputText);
            setResponseText(response); // Actualiza el texto con la respuesta del servidor
        } catch (error) {
            setResponseText("Error al procesar la consulta."+error);
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
