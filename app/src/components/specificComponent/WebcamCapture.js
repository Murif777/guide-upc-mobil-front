import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { CamService } from '../../services/CamService';
import SistemaRutas from './SistemaRutas';
import VentanaEmergente from '../common/VentanaEmergente';
import NavigationControls from '../common/NavigationControls';
import '../../assets/styles/WebCamCapture.css';

const WebcamCapture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const startLocation = searchParams.get('start');
  const endLocation = searchParams.get('end');

  const webcamRef = useRef(null);
  const sistemaRutasRef = useRef(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
   
  //const [currentRouteStep, setCurrentRouteStep] = useState(0);

  const CAPTURE_INTERVAL = 1000;

  useEffect(() => {
    let intervalId = null;
    const processFrame = async () => {
      if (webcamRef.current && isStreaming) {
        try {
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) return;

          const base64Data = imageSrc.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }

          const blob = new Blob(byteArrays, { type: 'image/png' });
          const results = await CamService.sendCam(blob);

          // Handle QR code detection results
          if (results.qr_data) {
            const detectedQrData = results.qr_data.join(', ').toLowerCase();
            setQrData(detectedQrData);

            // Route verification logic
            if (sistemaRutasRef.current) {
              const { route, handleRouteQRVerification } = sistemaRutasRef.current;
              
              // Check if the QR matches the current route step
              const stepVerified = handleRouteQRVerification(detectedQrData,setIsStreaming);
              
              if (stepVerified) {
                setMessage(`Verificado: ${detectedQrData}`);
                // Optional: Automatically trigger next step or read instruction
                // sistemaRutasRef.current.handleNext();
              } else {
                //setMessage(`QR no corresponde a la ruta actual${detectedQrData}`);
              }
            }
          } else {
            setQrData('');
            setMessage('');
          }

          setErrorMessage('');
        } catch (error) {
          console.error('Error processing frame:', error);
          setErrorMessage('Error al procesar el frame: ' + error.message);
        }
      }
    };

    if (isStreaming) {
      intervalId = setInterval(processFrame, CAPTURE_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isStreaming]);



return (
  <>


      <NavigationControls 
        setShowTutorial={setShowTutorial} 
        tutorialKey="camguideTutorialVisto" 
      />

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-4">
      <div className="webcam-container w-full max-w-md">
        <div className="relative mb-4">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            className="w-full rounded-lg shadow-lg"
            mirrored={true}
            videoConstraints={{
              width: 350,
              height: 560,
              facingMode: "user"
            }}
          />
          <div className="webcam-overlay absolute top-0 left-0 w-full h-full flex flex-col">
            {isStreaming && (
              <div className="detection-status absolute top-2 right-2 flex items-center">
                <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  Detectando...
                  QR Data: {qrData}
                </span>
              </div>
            )}
          
            {/* Mueve el contenedor de ruta al final (bottom) */}
            <div className="mt-auto ">
              <div className="ruta-container bg-white bg-opacity-50 p-2 rounded ">
                <SistemaRutas
                  ref={sistemaRutasRef}
                  startLocation={startLocation}
                  endLocation={endLocation}
                  hidenitem={true}
                />
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded text-center">
            {errorMessage}
          </div>
        )}

        {message && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded text-center">
            {message}
          </div>
        )}

        <div className="mt-4"></div>
      </div>
    </div>
    </>
  );
};

export default WebcamCapture;