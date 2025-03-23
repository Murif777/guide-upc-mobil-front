import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Creamos el componente Tab
const Tab = createBottomTabNavigator();

// Componentes de ejemplo para cada pantalla
const HomeScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Pantalla de Inicio GUIDE-UPC</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.screenText}>Pantalla de Perfil</Text>
  </View>
);

// Componente principal que contiene la Tab Bar
export default function tab_bar() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Definimos los iconos para cada ruta
            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            // Retornamos el icono con las propiedades correspondientes
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            backgroundColor: "  #2d2e35",
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

// Estilos para los componentes de pantalla
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bfbfbf',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});