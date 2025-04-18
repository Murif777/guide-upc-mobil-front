import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainButton from '../components/specificComponent/MainButton';
import MainText from '../components/specificComponent/MainText';
import Animacion from '../components/specificComponent/animacionvoz';
import Camara from '../components/specificComponent/camara';


export default function Main() {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <MainText />
      </View>
      <Animacion />
      <View style={styles.buttonContainer}>
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
    marginTop: 20, 
  },
});