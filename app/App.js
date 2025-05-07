import React from 'react';
import Main from './src/pages/Main';
import { VoiceProvider } from './src/components/hooks/useVoice';
import "../global.css";

export default function App() {
  return (
    <VoiceProvider>
    <Main/>
    </VoiceProvider>
  );
}
