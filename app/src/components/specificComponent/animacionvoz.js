import React, { useRef, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { VoiceContext } from "../hooks/useVoice";

export default function Animationvoz() {
  const { isSpeaking } = useContext(VoiceContext);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isSpeaking) {
      // Si está hablando, reproducir la animación
      animationRef.current?.resume();
    } else {
      // Si no está hablando, pausar la animación
      animationRef.current?.pause();
    }
  }, [isSpeaking]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/animaciones/Animation_modified.json")}
        autoPlay={false} 
        loop={true}
        style={styles.animation}
      />
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