import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
// Import the LocalStorageEntity creator instead of QRHistory directly
import { createLocalStorageEntity } from '../storage/LocalStorageEntity';

export default function QRHistoryCarousel({ onSelect }) {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create a QRHistory entity instance
  const QRHistory = React.useMemo(() => createLocalStorageEntity('QRHistory'), []);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await QRHistory.list('-created_date', 10);
        setHistory(data);
      } catch (error) {
        console.error('Failed to load QR history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [QRHistory]);

  if (history.length === 0 && !loading) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('recentQRCodes')}
      </h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => onSelect(item)}
            >
              {item.preview && (
                <div className="flex-shrink-0 w-12 h-12 mr-4">
                  <img 
                    src={item.preview} 
                    alt={item.name || 'QR Code'} 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-grow text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {item.name || `QR ${new Date(item.created_date).toLocaleDateString()}`}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.created_date).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}