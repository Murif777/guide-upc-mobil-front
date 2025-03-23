import { useColorScheme } from 'react-native';

export default function useThemeColor() {
  const theme = useColorScheme() || 'light'; // Default to 'light' if no theme is detected

  // Define the Colors object
  const Colors = {
    light: {
      text: '#11181C', 
      background: '#FFFFFF',
    },
    dark: {
      text: '#FFFFFF', 
      background: '#151718', 
    },
  };

  // Return the colors for the current theme
  return {
    textColor: Colors[theme].text,
    backgroundColor: Colors[theme].background,
  };
}