import React from "react";
import {  TouchableOpacity, Image, Vibration } from "react-native";
import MainText from "./MainText";

export default function MainButton() {

    const toggleText = () => {
        Vibration.vibrate(); // Trigger vibration when the button is pressed
    };

    return (
        <>
            <TouchableOpacity onPress={toggleText}>
                <Image
                    source={require('../../assets/images/eye.png')} // Reemplaza con la ruta correcta de tu logo
                    className="w-36 h-36 mt-2"
                    style={{ resizeMode: 'contain', height: 150, width: 150 }} // Asegura que la imagen mantenga su proporción
                />
            </TouchableOpacity>
        </>
    );
}