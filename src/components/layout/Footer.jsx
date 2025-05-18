import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { GithubIcon, ArrowUpIcon } from 'lucide-react';

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('qr-genie-cookies-accepted');
    if (!cookiesAccepted) {
      setShowCookieBanner(true);
    }

    // Setup scroll listener for back-to-top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('qr-genie-cookies-accepted', 'true');
    setShowCookieBanner(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 OMGerEDU • QR Genie
            </span>
          </div>
          
          <div className="flex mt-4 justify-center md:mt-0 space-x-6">
            <a
              href="https://github.com/OMGerEDU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/in/omger"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-gray-900 text-white p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm">{t('cookieConsent')}</div>
              <div className="flex flex-shrink-0 space-x-4">
                <button
                  onClick={acceptCookies}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('accept')}
                </button>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white px-4 py-2 text-sm font-medium"
                >
                  {t('learnMore')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed z-30 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-150`}
          style={{
            bottom: '20px',
            [isRTL ? 'right' : 'left']: '20px'
          }}
          aria-label={t('backToTop')}
        >
          <ArrowUpIcon className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}