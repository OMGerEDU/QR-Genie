
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { Download, Copy, Check, Share } from 'lucide-react';

export default function QRCodePreview({ qrData, isGenerating }) {
  const { t } = useLanguage();
  const { settings } = useAccessibility();
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (qrData && qrData.dataUrl) {
      setPreviewUrl(qrData.dataUrl);
    }
  }, [qrData]);

  const downloadQR = (format) => {
    if (!qrData || !qrData.dataUrl) return;
    
    const link = document.createElement('a');
    
    // For SVG downloads, we want to use the SVG source directly
    if (format === 'svg' && qrData.svgSource) {
      const blob = new Blob([qrData.svgSource], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    } else {
      // For other formats, use the dataUrl that's already in the specified format
      link.href = qrData.dataUrl;
    }
    
    link.download = `qr-genie-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!qrData || !qrData.dataUrl) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrData.dataUrl);
      const blob = await response.blob();
      
      // Use clipboard API to copy the image
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR code:', err);
    }
  };

  const shareQR = async () => {
    if (!qrData || !qrData.dataUrl || !navigator.share) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(qrData.dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Genie - Generated QR Code',
        text: 'Check out this QR code I created with QR Genie!',
        files: [file]
      });
    } catch (err) {
      console.error('Failed to share QR code:', err);
      // Fallback to showing share options modal
      setShowShareOptions(true);
    }
  };

  // Add visual indication of style options
  const renderStyleInfo = () => {
    if (!qrData || !qrData.options) return null;
    
    return (
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center gap-2 text-center">
          {qrData.options.foregroundColor && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1 rounded-sm" 
                style={{backgroundColor: qrData.options.foregroundColor}}></span>
              <span>Foreground</span>
            </div>
          )}
          {qrData.options.backgroundColor && (
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1 rounded-sm border border-gray-300" 
                style={{backgroundColor: qrData.options.backgroundColor}}></span>
              <span>Background</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-xs mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="QR Code Preview" 
              className="w-full h-auto"
              style={{ 
                filter: settings.highContrast ? 'contrast(1.5)' : 'none',
                transition: settings.reduceMotion ? 'none' : 'all 0.2s ease' 
              }}
            />
            {renderStyleInfo()}
          </>
        ) : (
          <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
        )}
      </div>
      
      {previewUrl && (
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button
            onClick={() => downloadQR('svg')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-1" />
            {t('svgDownload')}
          </button>
          
          <button
            onClick={() => downloadQR('png')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={isGenerating}
          >
            <Download className="w-4 h-4 mr-1" />
            {t('pngDownload')}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={isGenerating}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-500" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                {t('copy')}
              </>
            )}
          </button>
          
          {navigator.share && (
            <button
              onClick={shareQR}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={isGenerating}
            >
              <Share className="w-4 h-4 mr-1" />
              {t('shareQR')}
            </button>
          )}
        </div>
      )}
      
      {/* Share options modal */}
      {showShareOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">{t('shareQR')}</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Social sharing buttons would go here */}
              <button
                onClick={() => setShowShareOptions(false)}
                className="mt-4 w-full py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
