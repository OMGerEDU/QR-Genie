import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function QRSequenceInput({ value, onChange }) {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sequence Generator</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Template Text
        </label>
        <input
          type="text"
          value={value.template}
          onChange={(e) => onChange('template', e.target.value)}
          placeholder="Use {n} for number placement, e.g., 'Product-{n}'"
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Number
          </label>
          <input
            type="number"
            value={value.start}
            onChange={(e) => onChange('start', parseInt(e.target.value))}
            min="0"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Number
          </label>
          <input
            type="number"
            value={value.end}
            onChange={(e) => onChange('end', parseInt(e.target.value))}
            min="0"
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Preview
        </label>
        <div className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          {value.template && value.start !== undefined ? (
            value.template.replace('{n}', value.start)
          ) : (
            'Enter template and numbers above'
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use {'{n}'} in your template where you want the number to appear</li>
          <li>Maximum range allowed: 500 numbers</li>
          <li>Example: "Product-{'{n}'}" with start=1, end=100 will generate "Product-1" through "Product-100"</li>
        </ul>
      </div>
    </div>
  );
}