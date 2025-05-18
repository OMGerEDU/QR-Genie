import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function QRWifiInput({ value, onChange }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('wifi')}</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('ssid')}
        </label>
        <input
          type="text"
          value={value.ssid}
          onChange={(e) => onChange('ssid', e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('password')}
        </label>
        <input
          type="text"
          value={value.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('encryptionType')}
        </label>
        <select
          value={value.encryption}
          onChange={(e) => onChange('encryption', e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="hidden-network"
          checked={value.hidden}
          onChange={(e) => onChange('hidden', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="hidden-network" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {t('hidden')}
        </label>
      </div>
    </div>
  );
}