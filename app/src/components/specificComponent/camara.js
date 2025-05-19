import React, { useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera } from 'expo-camera';

export default function Camara() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const webInputRef = useRef(null);

  // Solicitar permisos para Android
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
    })();
  }, []);

  // Manejar toma de foto en Android
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      setShowCamera(false);
    }
  };

  // Manejar cámara en Web
  const handleWebCamera = () => {
    if (webInputRef.current) {
      webInputRef.current.click();
    }
  };

  // Manejar selección de archivo en Web
  const handleWebImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
    }
  };

  if (Platform.OS === 'android' && hasCameraPermission === null) {
    return <View />;
  }

  if (Platform.OS === 'android' && hasCameraPermission === false) {
    return <Text>No hay acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => 
              Platform.OS === 'web' ? handleWebCamera() : setShowCamera(true)
            }
          >
            <Text style={styles.text}>Abrir Cámara</Text>
          </TouchableOpacity>

          {Platform.OS === 'web' && (
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              ref={webInputRef}
              onChange={handleWebImage}
            />
          )}
        </>
      )}

      {capturedImage && (
        <Image source={{ uri: capturedImage }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#0782F9',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  preview: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
});