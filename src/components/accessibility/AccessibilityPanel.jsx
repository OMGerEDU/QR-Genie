
import React, { useEffect } from 'react';
import { useAccessibility } from './AccessibilityContext';
import { useLanguage } from '../i18n/LanguageContext';
import { X } from 'lucide-react';

export default function AccessibilityPanel() {
  const { isOpen, togglePanel, settings, updateSetting } = useAccessibility();
  const { t, isRTL } = useLanguage();

  // Close panel with Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        togglePanel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, togglePanel]);

  if (!isOpen) {
    return (
      <button
        className="fixed z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-150"
        style={{ 
          bottom: '20px',
          [isRTL ? 'left' : 'right']: '20px'
        }}
        onClick={togglePanel}
        aria-label={t('accessibility')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={togglePanel}
      />
      
      {/* Panel */}
      <div
        className={`fixed z-50 top-0 ${isRTL ? 'left-0' : 'right-0'} w-full sm:max-w-sm h-screen bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out transform`}
      >
        <div className="h-full flex flex-col divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('accessibility')}
            </h2>
            <button
              onClick={togglePanel}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Font Size */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('fontSize')}</h3>
              <div className="grid grid-cols-4 gap-2">
                {['small', 'medium', 'large', 'x-large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`px-3 py-2 rounded-md text-center transition-colors ${
                      settings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-300'
                    }`}
                  >
                    <span className={size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : size === 'x-large' ? 'text-xl' : ''}>
                      {size === 'small' ? 'A' : size === 'medium' ? 'AA' : size === 'large' ? 'AAA' : 'AAAA'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="high-contrast" className="font-medium text-gray-900 dark:text-white">
                  {t('contrast')}
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="high-contrast"
                    id="high-contrast"
                    checked={settings.highContrast}
                    onChange={(e) => updateSetting('highContrast', e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="high-contrast"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="reduce-motion" className="font-medium text-gray-900 dark:text-white">
                  {t('animations')}
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="reduce-motion"
                    id="reduce-motion"
                    checked={settings.reduceMotion}
                    onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="reduce-motion"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.reduceMotion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="reading-guide" className="font-medium text-gray-900 dark:text-white">
                  {t('readingGuide')}
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="reading-guide"
                    id="reading-guide"
                    checked={settings.readingGuide}
                    onChange={(e) => updateSetting('readingGuide', e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="reading-guide"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.readingGuide ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="dyslexic-font" className="font-medium text-gray-900 dark:text-white">
                  Dyslexic Font
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="dyslexic-font"
                    id="dyslexic-font"
                    checked={settings.dyslexicFont}
                    onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor="dyslexic-font"
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      settings.dyslexicFont ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reading Guide */}
      {settings.readingGuide && (
        <div 
          className="fixed z-30 left-0 right-0 h-8 bg-yellow-200 opacity-30 pointer-events-none" 
          style={{ 
            top: `${Math.max(0, window.scrollY + window.innerHeight / 2 - 16)}px`,
            transition: settings.reduceMotion ? 'none' : 'top 0.1s ease-out'
          }}
        />
      )}
      
      {/* Style for toggles */}
      <style jsx global>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #2563eb;
        }
        .toggle-label {
          transition: background-color 0.2s ease;
        }
        .high-contrast {
          filter: contrast(1.5);
        }
        .reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
        .dyslexic-font {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      `}</style>
    </>
  );
}
