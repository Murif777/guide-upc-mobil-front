import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function Animationvoz() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      {isVisible && (
        <LottieView
          source={require("../../assets/animaciones/Animation_modified.json")} // Reemplaza con la ruta correcta de tu archivo JSON
          autoPlay
          loop
          style={styles.animation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 200, 
    height: 200, 


  },
  animation: {
    width: 120,
    height: 120,
  },
});


