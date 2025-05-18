
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { Upload, FileText, X, Loader2, Download } from 'lucide-react';

export default function BatchQRGenerator() {
  const { t } = useLanguage();
  const { settings } = useAccessibility();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [qrResults, setQrResults] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Add style options state
  const [styleOptions, setStyleOptions] = useState(() => {
    // Try to load saved style preset
    try {
      const savedPreset = localStorage.getItem('qr-style-preset');
      const defaultStyle = {
        size: 300,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        errorCorrectionLevel: 'M',
        margin: 4,
        dotStyle: 'square',
        cornerSquareType: 'square',
        cornerDotType: 'square'
      };

      if (savedPreset) {
        return { ...defaultStyle, ...JSON.parse(savedPreset) };
      }

      return defaultStyle;
    } catch (error) {
      console.error('Error loading style preset:', error);
      return {
        size: 300,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        errorCorrectionLevel: 'M',
        margin: 4,
        dotStyle: 'square',
        cornerSquareType: 'square',
        cornerDotType: 'square'
      };
    }
  });

  // Listen for style preset changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'qr-style-preset' && e.newValue) {
        try {
          const newStyle = JSON.parse(e.newValue);
          setStyleOptions(prev => ({
            ...prev,
            ...newStyle
          }));
        } catch (error) {
          console.error('Error parsing style preset:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
    parseCSV(selectedFile);
    setError(null);
  };
  
  const parseCSV = (file) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const parsedData = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim());
          const entry = {};
          
          headers.forEach((header, index) => {
            entry[header] = values[index] || '';
          });
          
          parsedData.push(entry);
        }
        
        setCsvData(parsedData);
        setIsProcessing(false);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setError('Invalid CSV format. Please check the file and try again.');
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading the file');
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    
    if (droppedFile.type !== 'text/csv' && !droppedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(droppedFile);
    parseCSV(droppedFile);
    setError(null);
  };
  
  const handleClearFile = () => {
    setFile(null);
    setCsvData([]);
    setQrResults([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateBatchQRCodes = async () => {
    if (csvData.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would use a batch API or process in chunks
      setQrResults([]);
      // Mock generation for this demo
      setTimeout(() => {
        // Result structure mock
        const results = csvData.map((row, index) => {
          // Apply style options to batch generated QR codes
          let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${styleOptions.size}x${styleOptions.size}&data=${encodeURIComponent(JSON.stringify(row))}`;
          
          if (styleOptions.foregroundColor) {
            qrUrl += `&color=${encodeURIComponent(styleOptions.foregroundColor.replace('#', ''))}`;
          }
          if (styleOptions.backgroundColor) {
            qrUrl += `&bgcolor=${encodeURIComponent(styleOptions.backgroundColor.replace('#', ''))}`;
          }

          return {
            id: `qr-${index}`,
            dataUrl: qrUrl,
            data: row,
            options: styleOptions
          };
        });
        
        setQrResults(results);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating QR codes:', error);
      setError('Error generating QR codes. Please try again.');
      setIsProcessing(false);
    }
  };

  const downloadAllQRCodes = () => {
    if (qrResults.length === 0) return;
    
    // In a real implementation, this would zip all QR codes
    alert('In a real implementation, this would download a zip file with all QR codes');
  };

  // Add style options section
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('batchProcessing')}
      </h3>
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <Upload 
              className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" 
              style={{ 
                transition: settings.reduceMotion ? 'none' : 'all 0.2s ease' 
              }}
            />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('uploadCSV')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop a CSV file or click to browse
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {csvData.length} {csvData.length === 1 ? 'row' : 'rows'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearFile}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Style Options Notice - inform user that the style from other tabs applies here */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm text-blue-800 dark:text-blue-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              QR codes will be generated using the style options from the Generator tab. To change style, go back to the Generator tab.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md">
              {error}
            </div>
          )}
          
          {csvData.length > 0 && (
            <>
              <button
                onClick={generateBatchQRCodes}
                disabled={isProcessing}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t('generate')
                )}
              </button>
              
              {qrResults.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Generated QR Codes ({qrResults.length})
                    </h4>
                    <button
                      onClick={downloadAllQRCodes}
                      className="flex items-center py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {t('downloadAll')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {qrResults.map((result, index) => (
                      <div key={result.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:shadow-md transition-shadow">
                        <img 
                          src={result.dataUrl} 
                          alt={`QR Code ${index + 1}`}
                          className="w-full h-auto"
                        />
                        <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 truncate">
                          {Object.values(result.data)[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
