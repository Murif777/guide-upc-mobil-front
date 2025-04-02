import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainButton from './src/components/specificComponent/MainButton';
import MainText from './src/components/specificComponent/MainText';
import Animacion from './src/components/specificComponent/animacionvoz';
import Camara from './src/components/specificComponent/camara';
import "../global.css";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <MainText />
      </View>
      <Animacion />
      <View style={styles.buttonContainer}>
        <Camara />
        <MainButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#28242c',
  },
  textContainer: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Adjust for spacing if necessary
  },
});