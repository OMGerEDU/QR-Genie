
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import QRURLInput from './form/QRURLInput';
import QRVCardInput from './form/QRVCardInput';
import QRWifiInput from './form/QRWifiInput';
import QREventInput from './form/QREventInput';
import QRStyleOptions from './form/QRStyleOptions';
import QRLogoUpload from './form/QRLogoUpload';
import { Loader2 } from 'lucide-react';
import QRSequenceInput from './form/QRSequenceInput';

export default function QRForm({ onGenerate, isGenerating }) {
  const { t } = useLanguage();
  const [qrType, setQrType] = useState('url');
  const [formData, setFormData] = useState({
    url: { text: '' },
    vcard: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      website: ''
    },
    wifi: {
      ssid: '',
      password: '',
      encryption: 'WPA',
      hidden: false
    },
    event: {
      title: '',
      location: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    },
    sequence: {
      template: '',
      start: 1,
      end: 10
    }
  });
  
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
        logoUrl: null,
        logoSize: 50,
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
        logoUrl: null,
        logoSize: 50,
        dotStyle: 'square',
        cornerSquareType: 'square',
        cornerDotType: 'square'
      };
    }
  });
  
  const [formError, setFormError] = useState(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle when not in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      if (e.key === '1') {
        setQrType('url');
      } else if (e.key === '2') {
        setQrType('vcard');
      } else if (e.key === '3') {
        setQrType('wifi');
      } else if (e.key === '4') {
        setQrType('event');
      } else if (e.key === '5') {
        setQrType('sequence');
      } else if (e.key === 'g') {
        handleSubmit(new Event('keydown'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData, styleOptions]);

  const handleInputChange = (type, field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleStyleChange = useCallback((property, value) => {
    setStyleOptions(prev => {
      const newOptions = {
        ...prev,
        [property]: value
      };

      // Save to localStorage
      try {
        localStorage.setItem('qr-style-preset', JSON.stringify(newOptions));
      } catch (error) {
        console.error('Error saving style preset:', error);
      }

      return newOptions;
    });
  }, []);

  const validateForm = () => {
    setFormError(null);
    
    if (qrType === 'url' && !formData.url.text.trim()) {
      setFormError('Please enter a URL or text');
      return false;
    }
    
    if (qrType === 'vcard') {
      if (!formData.vcard.firstName.trim() && !formData.vcard.lastName.trim()) {
        setFormError('Please enter at least a name');
        return false;
      }
    }
    
    if (qrType === 'wifi') {
      if (!formData.wifi.ssid.trim()) {
        setFormError('Please enter a network name (SSID)');
        return false;
      }
    }
    
    if (qrType === 'event') {
      if (!formData.event.title.trim()) {
        setFormError('Please enter an event title');
        return false;
      }
      if (!formData.event.startDate) {
        setFormError('Please enter a start date');
        return false;
      }
    }

    if (qrType === 'sequence') {
      if (!formData.sequence.template.includes('{n}')) {
        setFormError('Template must include {n} placeholder');
        return false;
      }
      if (parseInt(formData.sequence.start) >= parseInt(formData.sequence.end)) {
        setFormError('End number must be greater than start number');
        return false;
      }
       if (parseInt(formData.sequence.end) - parseInt(formData.sequence.start) > 500) {
        setFormError('Maximum range is 500 numbers');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const prepareQRData = () => {
      let content = '';
      
      if (qrType === 'sequence') {
        const seq = formData.sequence;
        content = seq.template.replace('{n}', seq.start);
        return {
          content,
          options: styleOptions,
          type: qrType,
          rawFormData: formData[qrType],
          isSequence: true,
          sequenceStart: parseInt(seq.start),
          sequenceEnd: parseInt(seq.end),
          sequenceTemplate: seq.template
        };
      }

      if (qrType === 'url') {
        content = formData.url.text.trim();
        
        // If it's not already a URL and doesn't contain spaces, assume it's a URL and add https://
        if (!content.startsWith('http://') && !content.startsWith('https://') && 
            !content.startsWith('mailto:') && !content.startsWith('tel:') && 
            !content.includes(' ') && content.includes('.')) {
          content = 'https://' + content;
        }
      } 
      else if (qrType === 'vcard') {
        const vcard = formData.vcard;
        content = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `N:${vcard.lastName};${vcard.firstName}`,
          `FN:${vcard.firstName} ${vcard.lastName}`,
          vcard.company ? `ORG:${vcard.company}` : '',
          vcard.email ? `EMAIL:${vcard.email}` : '',
          vcard.phone ? `TEL:${vcard.phone}` : '',
          vcard.website ? `URL:${vcard.website}` : '',
          'END:VCARD'
        ].filter(line => line).join('\n');
      } 
      else if (qrType === 'wifi') {
        const wifi = formData.wifi;
        content = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};H:${wifi.hidden ? 'true' : 'false'};;`;
      } 
      else if (qrType === 'event') {
        const event = formData.event;
        // Format dates as YYYYMMDDTHHMMSSZ
        const formatDateTime = (date, time) => {
          if (!date) return '';
          const dateParts = date.split('-');
          let formattedDate = dateParts.join('');
          
          if (time) {
            const timeParts = time.split(':');
            formattedDate += `T${timeParts.join('')}00`;
          } else {
            formattedDate += 'T000000';
          }
          
          return formattedDate;
        };
        
        const startDateTime = formatDateTime(event.startDate, event.startTime);
        const endDateTime = event.endDate ? formatDateTime(event.endDate, event.endTime) : '';
        
        content = [
          'BEGIN:VEVENT',
          `SUMMARY:${event.title}`,
          `LOCATION:${event.location || ''}`,
          `DESCRIPTION:${event.description || ''}`,
          `DTSTART:${startDateTime}`,
          endDateTime ? `DTEND:${endDateTime}` : '',
          'END:VEVENT'
        ].filter(line => line).join('\n');
      }
      
      return {
        content,
        options: styleOptions,
        type: qrType,
        rawFormData: formData[qrType]
      };
    };
    
    onGenerate(prepareQRData());
  };

  // Make sure style preferences are shared across tabs
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        {/* QR Code Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('qrType')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {['url', 'vcard', 'wifi', 'event', 'sequence'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setQrType(type)}
                className={`py-2 px-4 rounded-md ${
                  qrType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Input Form Based on QR Type */}
        <div className="mb-6">
          {qrType === 'url' && (
            <QRURLInput 
              value={formData.url}
              onChange={(field, value) => handleInputChange('url', field, value)} 
            />
          )}
          
          {qrType === 'vcard' && (
            <QRVCardInput 
              value={formData.vcard}
              onChange={(field, value) => handleInputChange('vcard', field, value)} 
            />
          )}
          
          {qrType === 'wifi' && (
            <QRWifiInput 
              value={formData.wifi}
              onChange={(field, value) => handleInputChange('wifi', field, value)} 
            />
          )}
          
          {qrType === 'event' && (
            <QREventInput 
              value={formData.event}
              onChange={(field, value) => handleInputChange('event', field, value)} 
            />
          )}

          {qrType === 'sequence' && (
            <QRSequenceInput 
              value={formData.sequence}
              onChange={(field, value) => handleInputChange('sequence', field, value)} 
            />
          )}
        </div>

        {/* Style Options */}
        <div className="mb-6">
          <QRStyleOptions 
            options={styleOptions}
            onChange={handleStyleChange}
          />
        </div>

        {/* Logo Upload */}
        <div className="mb-6">
          <QRLogoUpload 
            logoUrl={styleOptions.logoUrl}
            onLogoChange={(url) => handleStyleChange('logoUrl', url)}
            logoSize={styleOptions.logoSize}
            onLogoSizeChange={(size) => handleStyleChange('logoSize', size)}
          />
        </div>

        {/* Submit Button */}
        <div>
          {formError && (
            <p className="text-red-500 mb-2 text-sm">{formError}</p>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('generate')}...
              </>
            ) : (
              t('generate')
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
