import React, { useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { TrashIcon } from 'lucide-react';

export default function QRLogoUpload({ logoUrl, onLogoChange, logoSize, onLogoSizeChange }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      onLogoChange(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveLogo = () => {
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {t('logoOverlay')}
      </h3>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('uploadLogo')}
          </label>
          
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('uploadLogo')}
            </label>
            
            {logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                aria-label="Remove logo"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {logoUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo Size (%)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={logoSize}
                  onChange={(e) => onLogoSizeChange(parseInt(e.target.value))}
                  className="w-full mr-2"
                />
                <span className="text-sm text-gray-900 dark:text-gray-100 w-10 text-right">
                  {logoSize}%
                </span>
              </div>
            </div>
          )}
        </div>
        
        {logoUrl && (
          <div className="w-24 h-24 bg-white rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden">
            <img 
              src={logoUrl} 
              alt="Logo Preview" 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
        )}
      </div>
    </div>
  );
}