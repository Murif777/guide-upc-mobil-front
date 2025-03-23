import React from 'react';
import { View } from 'react-native';
import MainButton from './src/components/specificComponent/MainButton';
import MainText from './src/components/specificComponent/MainText';
import "../global.css";

export default function App() {
  return (
    <View className="flex-1 justify-center items-center" style={{backgroundColor:'#28242c'}} >
      <MainText />
      <MainButton />
    </View>
  );
}
