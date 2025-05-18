import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function QRURLInput({ value, onChange }) {
  const { t } = useLanguage();
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {t('enterURL')}
      </label>
      <input
        type="text"
        value={value.text}
        onChange={(e) => onChange('text', e.target.value)}
        placeholder="https://example.com"
        className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}