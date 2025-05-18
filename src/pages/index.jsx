
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../components/i18n/LanguageContext';
// Import the LocalStorageEntity creator
import { createLocalStorageEntity } from '../components/storage/LocalStorageEntity';
import QRForm from '../components/qr/QRForm';
import QRCodePreview from '../components/qr/QRCodePreview';
import QRHistoryCarousel from '../components/qr/QRHistoryCarousel';
import BatchQRGenerator from '../components/qr/BatchQRGenerator';
import QRScanner from '../components/scanner/QRScanner';

export default function Home() {
  const { t } = useLanguage();
  const [qrData, setQrData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator', 'batch', 'scanner'
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [qrName, setQrName] = useState('');
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState(null);
  const [sequenceData, setSequenceData] = useState(null);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [generatedSequences, setGeneratedSequences] = useState([]);
  const [isGeneratingSequence, setIsGeneratingSequence] = useState(false);

  // Create a QRHistory entity instance
  const QRHistory = React.useMemo(() => createLocalStorageEntity('QRHistory'), []);

  // Handle PWA install prompt
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setPwaInstallPrompt(e);
    });
  }, []);

  const generateQRCode = async (qrDataRequest) => {
    setIsGenerating(true);
    
    try {
      if (qrDataRequest.isSequence) {
        // Handle sequence generation
        setSequenceData(qrDataRequest);
        const sequences = [];
        
        // Generate first QR code
        const firstQR = qrDataRequest.sequenceTemplate.replace('{n}', qrDataRequest.sequenceStart);
        const firstResult = await generateSingleQR(firstQR, qrDataRequest.options);
        sequences.push(firstResult);
        
        setQrData({
          ...firstResult,
          isSequence: true,
          currentIndex: qrDataRequest.sequenceStart,
          totalCount: qrDataRequest.sequenceEnd - qrDataRequest.sequenceStart + 1,
          options: qrDataRequest.options
        });
        
        setGeneratedSequences(sequences);
        setCurrentSequenceIndex(0);
      } else {
        // Handle regular QR code generation
        const result = await generateSingleQR(qrDataRequest.content, qrDataRequest.options);
        setQrData({
          ...result,
          content: qrDataRequest.content,
          type: qrDataRequest.type,
          options: qrDataRequest.options,
          formData: qrDataRequest.rawFormData
        });
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced to accept style options
  const generateSingleQR = async (content, styleOptions) => {
    // This would typically call your QR generation API with style options
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, these options would be passed to the QR code generator
        // Create URL with style options
        let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${styleOptions.size}x${styleOptions.size}&data=${encodeURIComponent(content)}`;
        
        // Add color params if supported by the service
        if (styleOptions.foregroundColor) {
          qrUrl += `&color=${encodeURIComponent(styleOptions.foregroundColor.replace('#', ''))}`;
        }
        if (styleOptions.backgroundColor) {
          qrUrl += `&bgcolor=${encodeURIComponent(styleOptions.backgroundColor.replace('#', ''))}`;
        }
        
        resolve({
          dataUrl: qrUrl,
          svgSource: `<svg><!-- Mock SVG for ${content} with style options --></svg>`,
          content: content,
          styleOptions: styleOptions
        });
      }, 500);
    });
  };

  const generateNextSequence = async () => {
    if (!sequenceData || isGeneratingSequence) return;
    
    setIsGeneratingSequence(true);
    const nextIndex = sequenceData.sequenceStart + currentSequenceIndex + 1;
    
    if (nextIndex <= sequenceData.sequenceEnd) {
      const content = sequenceData.sequenceTemplate.replace('{n}', nextIndex);
      const result = await generateSingleQR(content, sequenceData.options);
      
      setGeneratedSequences(prev => [...prev, result]);
      setCurrentSequenceIndex(prev => prev + 1);
      setQrData({
        ...result,
        isSequence: true,
        currentIndex: nextIndex,
        totalCount: sequenceData.sequenceEnd - sequenceData.sequenceStart + 1,
        options: sequenceData.options
      });
    }
    
    setIsGeneratingSequence(false);
  };

  const generateAllSequences = async () => {
    if (!sequenceData || isGeneratingSequence) return;
    
    setIsGeneratingSequence(true);
    const sequences = [...generatedSequences];
    
    for (let i = sequences.length; i < sequenceData.sequenceEnd - sequenceData.sequenceStart + 1; i++) {
      const currentNum = sequenceData.sequenceStart + i;
      const content = sequenceData.sequenceTemplate.replace('{n}', currentNum);
      const result = await generateSingleQR(content, sequenceData.options);
      sequences.push(result);
    }
    
    setGeneratedSequences(sequences);
    setCurrentSequenceIndex(sequences.length - 1);
    setQrData({
      ...sequences[sequences.length - 1],
      isSequence: true,
      currentIndex: sequenceData.sequenceEnd,
      totalCount: sequenceData.sequenceEnd - sequenceData.sequenceStart + 1,
      options: sequenceData.options
    });
    
    setIsGeneratingSequence(false);
    
    // Trigger download
    downloadAllSequences(sequences);
  };

  const downloadAllSequences = (sequences) => {
    // In a real implementation, this would create a zip file
    // For demo purposes, we'll just download them one by one
    sequences.forEach((seq, index) => {
      const link = document.createElement('a');
      link.href = seq.dataUrl;
      link.download = `qr-sequence-${sequenceData.sequenceStart + index}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleHistorySelect = (historyItem) => {
    setQrData({
      dataUrl: historyItem.preview,
      content: historyItem.data,
      type: historyItem.type,
      options: historyItem.style
    });
  };

  const saveQRCode = async () => {
    if (!qrData) return;
    
    try {
      await QRHistory.create({
        type: qrData.type,
        data: qrData.formData,
        style: qrData.options,
        preview: qrData.dataUrl,
        name: qrName || `QR-${new Date().toISOString().slice(0, 10)}`
      });
      
      setShowSaveDialog(false);
      setQrName('');
    } catch (error) {
      console.error('Error saving QR code:', error);
    }
  };
  
  const installPwa = async () => {
    if (!pwaInstallPrompt) return;
    
    // Show the install prompt
    pwaInstallPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await pwaInstallPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the saved prompt since it can't be used twice
    setPwaInstallPrompt(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          {t('appName')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('tagline')}
        </p>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Form */}
        <div className="lg:col-span-2">
          {/* Tab Selector */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-800">
              <button
                className={`flex-1 py-4 px-6 text-center transition-colors ${
                  activeTab === 'generator'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('generator')}
              >
                {t('generate')}
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center transition-colors ${
                  activeTab === 'batch'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('batch')}
              >
                {t('batchGeneration')}
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center transition-colors ${
                  activeTab === 'scanner'
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                onClick={() => setActiveTab('scanner')}
              >
                {t('scanQR')}
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'generator' && (
            <QRForm 
              onGenerate={generateQRCode} 
              isGenerating={isGenerating} 
            />
          )}

          {activeTab === 'batch' && (
            <BatchQRGenerator />
          )}

          {activeTab === 'scanner' && (
            <QRScanner />
          )}
        </div>

        {/* Right Side - Preview and History */}
        <div className="space-y-6">
          {/* QR Preview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t('preview')}
            </h3>
            <QRCodePreview qrData={qrData} isGenerating={isGenerating} />
            
            {qrData?.isSequence && (
              <div className="mt-4 space-y-2">
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Sequence {qrData.currentIndex} of {qrData.totalCount}
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={generateNextSequence}
                    disabled={isGeneratingSequence || currentSequenceIndex >= qrData.totalCount - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Generate Next
                  </button>
                  <button
                    onClick={generateAllSequences}
                    disabled={isGeneratingSequence}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Generate & Download All
                  </button>
                </div>
              </div>
            )}
            
            {qrData && !qrData.isSequence && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  {t('save')}
                </button>
              </div>
            )}
          </div>
          
          {/* History */}
          <QRHistoryCarousel onSelect={handleHistorySelect} />
        </div>
      </div>
      
      {/* PWA Install Prompt */}
      {pwaInstallPrompt && (
        <div className="fixed bottom-0 inset-x-0 bg-blue-600 text-white p-4 flex items-center justify-between">
          <span>{t('addToHomeScreen')}</span>
          <div className="space-x-2">
            <button 
              className="bg-white text-blue-600 px-4 py-2 rounded-md"
              onClick={installPwa}
            >
              {t('accept')}
            </button>
            <button 
              className="text-white px-4 py-2"
              onClick={() => setPwaInstallPrompt(null)}
            >
              {t('later')}
            </button>
          </div>
        </div>
      )}
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Save QR Code
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={qrName}
                onChange={(e) => setQrName(e.target.value)}
                placeholder="Enter a name for this QR code"
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={saveQRCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
