import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, PermissionsAndroid, Platform } from "react-native";
import { launchCamera } from "react-native-image-picker";

const Camara = () => {
    const [image, setImage] = useState(null);

    const camera = async () => {
        let options = {
            mediaType: 'photo', // Cambié a 'photo' para capturar fotos
            maxWidth: 300,
            maxHeight: 550,
        };

        let isCameraPermitted = await requestCameraPermission();
        if (isCameraPermitted || Platform.Version > 13) {
            launchCamera(options, response => {
                if (response.errorCode) {
                    alert(response.errorMessage);
                } else {
                    console.log(response?.assets);
                    setImage(response?.assets[0]); // Accede a la primera imagen
                }
            });
        }
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        } else {
            return true; // En iOS, se asume que el permiso ya está concedido
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {image && <Image source={{ uri: image.uri }} style={{ width: 300, height: 300, borderRadius: 10 }} />}
            <TouchableOpacity onPress={camera}
                style={{ width: 250, height: 50, borderRadius: 10, backgroundColor: '#e1dcdc', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: "#000000", fontSize: 16, fontWeight: '600' }}>Camara</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Camara;