import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';

// Define style presets in a centralized way
const STYLE_PRESETS = {
  classic: {
    dotStyle: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF'
  },
  modern: {
    dotStyle: 'dots',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    foregroundColor: '#1E3A8A', // Deep blue
    backgroundColor: '#FFFFFF'
  },
  rounded: {
    dotStyle: 'rounded',
    cornerSquareType: 'dot',
    cornerDotType: 'dot',
    foregroundColor: '#312E81', // Indigo
    backgroundColor: '#F3F4F6'
  },
  elegant: {
    dotStyle: 'classy',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'square',
    foregroundColor: '#4C1D95', // Purple
    backgroundColor: '#F0FDFA'
  }
};

export default function QRStyleOptions({ options, onChange }) {
  const { t } = useLanguage();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('');
  
  const validateColor = useCallback((color) => {
    // Check if it's a valid hex color
    const isHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!isHex.test(color)) {
      return '#000000'; // Default to black if invalid
    }
    return color;
  }, []);

  const handleColorChange = useCallback((type, value) => {
    const validColor = validateColor(value);
    onChange(type, validColor);
    setActivePreset(''); // Clear active preset when manually changing colors
  }, [onChange, validateColor]);

  const handleSizeChange = useCallback((value) => {
    // Ensure size is within bounds
    const size = Math.min(Math.max(100, parseInt(value) || 100), 1000);
    onChange('size', size);
  }, [onChange]);

  const handleMarginChange = useCallback((value) => {
    // Ensure margin is within bounds
    const margin = Math.min(Math.max(0, parseInt(value) || 0), 50);
    onChange('margin', margin);
  }, [onChange]);

  const applyStylePreset = useCallback((preset) => {
    const presetStyles = STYLE_PRESETS[preset];
    
    // Apply all preset styles at once
    Object.entries(presetStyles).forEach(([key, value]) => {
      onChange(key, value);
    });
    
    // Mark this preset as active
    setActivePreset(preset);

    // Save preset to localStorage
    try {
      localStorage.setItem('qr-style-preset', JSON.stringify({
        ...presetStyles,
        presetName: preset
      }));
    } catch (error) {
      console.error('Error saving style preset:', error);
    }
  }, [onChange]);

  // Initialize active preset on component mount
  React.useEffect(() => {
    try {
      const savedPreset = localStorage.getItem('qr-style-preset');
      if (savedPreset) {
        const parsed = JSON.parse(savedPreset);
        if (parsed.presetName) {
          setActivePreset(parsed.presetName);
        } else {
          // Try to detect which preset matches current options
          for (const [name, preset] of Object.entries(STYLE_PRESETS)) {
            if (
              preset.dotStyle === options.dotStyle &&
              preset.cornerSquareType === options.cornerSquareType &&
              preset.cornerDotType === options.cornerDotType
            ) {
              setActivePreset(name);
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading style preset:', error);
    }
  }, [options]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {t('style')}
        </h3>

        {/* Quick Style Presets */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(STYLE_PRESETS).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyStylePreset(preset)}
                className={`px-4 py-2 rounded-md text-gray-900 dark:text-gray-100 transition-colors capitalize ${
                  activePreset === preset 
                    ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500" 
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        
        {/* Basic Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('size')} (px)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={options.size}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="flex-1"
              />
              <input
                type="number"
                min="100"
                max="1000"
                value={options.size}
                onChange={(e) => handleSizeChange(e.target.value)}
                className="w-20 px-2 py-1 text-center border rounded-md text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('margin')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="50"
                value={options.margin}
                onChange={(e) => handleMarginChange(e.target.value)}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="50"
                value={options.margin}
                onChange={(e) => handleMarginChange(e.target.value)}
                className="w-20 px-2 py-1 text-center border rounded-md text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Color Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('color')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.foregroundColor}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                className="w-10 h-10 rounded-md cursor-pointer border"
              />
              <input
                type="text"
                value={options.foregroundColor}
                onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-1 border rounded-md text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => handleColorChange('foregroundColor', '#000000')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                title="Reset to default"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('background')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-10 h-10 rounded-md cursor-pointer border"
              />
              <input
                type="text"
                value={options.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 px-3 py-1 border rounded-md text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => handleColorChange('backgroundColor', '#FFFFFF')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                title="Reset to default"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        {advancedOpen ? (
          <ChevronUp className="w-4 h-4 mr-1" />
        ) : (
          <ChevronDown className="w-4 h-4 mr-1" />
        )}
        {t('advancedOptions')}
      </button>
      
      {/* Advanced Options */}
      {advancedOpen && (
        <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
          {/* Error Correction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('errorCorrection')}
            </label>
            <select
              value={options.errorCorrectionLevel}
              onChange={(e) => {
                onChange('errorCorrectionLevel', e.target.value);
                setActivePreset('');
              }}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
            >
              <option value="L">L - {t('low')} (7%)</option>
              <option value="M">M - {t('medium')} (15%)</option>
              <option value="Q">Q - {t('quartile')} (25%)</option>
              <option value="H">H - {t('high')} (30%)</option>
            </select>
          </div>

          {/* Pattern Styles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dot Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('dotStyle')}
              </label>
              <select
                value={options.dotStyle}
                onChange={(e) => {
                  onChange('dotStyle', e.target.value);
                  setActivePreset('');
                }}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              >
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            {/* Corner Square Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('cornerStyle')}
              </label>
              <select
                value={options.cornerSquareType}
                onChange={(e) => {
                  onChange('cornerSquareType', e.target.value);
                  setActivePreset('');
                }}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            {/* Corner Dot Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('eyeStyle')}
              </label>
              <select
                value={options.cornerDotType}
                onChange={(e) => {
                  onChange('cornerDotType', e.target.value);
                  setActivePreset('');
                }}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
              >
                <option value="square">Square</option>
                <option value="dot">Dot</option>
              </select>
            </div>
          </div>

          {/* Save Current Style as Preset */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('qr-style-preset', JSON.stringify({
                  dotStyle: options.dotStyle,
                  cornerSquareType: options.cornerSquareType,
                  cornerDotType: options.cornerDotType,
                  foregroundColor: options.foregroundColor,
                  backgroundColor: options.backgroundColor,
                  errorCorrectionLevel: options.errorCorrectionLevel
                }));
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Save Current Style as Default
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .dark input[type="range"] {
          background: #374151;
        }

        input[type="color"] {
          -webkit-appearance: none;
          padding: 0;
        }

        input[type="color"]::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        input[type="color"]::-webkit-color-swatch {
          border: none;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}