
import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../ui/ThemeContext';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { 
  Moon, 
  Sun, 
  Computer, 
  Menu, 
  X,
  Globe,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { t, toggleLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { togglePanel } = useAccessibility();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              aria-label={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
            >
              <Globe className="h-5 w-5" />
              <span className="ml-1">{language === 'en' ? 'עברית' : 'English'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                aria-label="Toggle theme"
              >
                {theme === 'light' && <Sun className="h-5 w-5" />}
                {theme === 'dark' && <Moon className="h-5 w-5" />}
                {theme === 'system' && <Computer className="h-5 w-5" />}
              </button>
            </div>

            <button
              onClick={togglePanel}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              aria-label="Accessibility options"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <button
              onClick={() => setShowShortcuts(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              aria-label="Keyboard shortcuts"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={toggleLanguage}
              className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>{language === 'en' ? 'עברית' : 'English'}</span>
              </div>
            </button>
            
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
              className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-center">
                {theme === 'light' && <Sun className="h-5 w-5 mr-2" />}
                {theme === 'dark' && <Moon className="h-5 w-5 mr-2" />}
                {theme === 'system' && <Computer className="h-5 w-5 mr-2" />}
                <span>{t('theme')}: {t(theme)}</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                togglePanel();
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 mr-2">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 8v8M8 12h8" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>{t('accessibility')}</span>
              </div>
            </button>
            
            <button
              onClick={() => {
                setShowShortcuts(true);
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <div className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                <span>{t('showKeyboardShortcuts')}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts dialog */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('showKeyboardShortcuts')}
              </h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(t('keyboardShortcuts')).map(([key, description]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {key}
                  </span>
                  <span>{description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
