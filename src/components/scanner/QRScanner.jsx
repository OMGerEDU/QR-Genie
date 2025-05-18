import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CameraIcon, LinkIcon, ClipboardIcon, CheckIcon, XIcon } from 'lucide-react';

export default function QRScanner() {
  const { t } = useLanguage();
  const [hasCamera, setHasCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // Check if camera is available
  useEffect(() => {
    (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(cameras.length > 0);
      } catch (error) {
        console.error('Error checking camera:', error);
        setHasCamera(false);
      }
    })();
  }, []);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  const startScanning = async () => {
    setIsScanning(true);
    setResult(null);
    
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // In a real app, we would use a library like zxing-js
      // This is a mock implementation
      mockQRScanning();
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsScanning(false);
    }
  };
  
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };
  
  // This is a mock implementation for demo purposes
  const mockQRScanning = () => {
    // Simulate finding a QR code after 3 seconds
    setTimeout(() => {
      if (isScanning) {
        stopScanning();
        setResult({
          text: 'https://base44.ai',
          type: 'url'
        });
      }
    }, 3000);
  };
  
  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Could not copy text:', err));
  };
  
  const openURL = () => {
    if (!result || result.type !== 'url') return;
    
    window.open(result.text, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('scanQR')}
      </h3>
      
      {!hasCamera ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <CameraIcon className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p>{t('noCamera')}</p>
        </div>
      ) : isScanning ? (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover bg-black rounded-lg"
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white rounded-lg opacity-70"></div>
          </div>
          
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            {t('scannerInstructions')}
          </p>
          
          <button
            onClick={stopScanning}
            className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <XIcon className="w-4 h-4 mr-2 inline" />
            Cancel
          </button>
        </div>
      ) : result ? (
        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('scannedResult')}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 break-all">
              {result.text}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                  {t('copied')}
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-4 h-4 mr-2" />
                  {t('copy')}
                </>
              )}
            </button>
            
            {result.type === 'url' && (
              <button
                onClick={openURL}
                className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Open Link
              </button>
            )}
            
            <button
              onClick={() => {
                setResult(null);
                startScanning();
              }}
              className="flex items-center py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Scan Again
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <button
            onClick={startScanning}
            className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Start Scanner
          </button>
        </div>
      )}
    </div>
  );
}