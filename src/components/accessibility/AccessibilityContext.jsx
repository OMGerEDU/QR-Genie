import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'medium', // small, medium, large, x-large
    highContrast: false,
    reduceMotion: false,
    readingGuide: false,
    focusIndicators: true,
    dyslexicFont: false
  });

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('qr-genie-accessibility');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  useEffect(() => {
    loadSettings();

    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    document.documentElement.classList.toggle('text-sm', settings.fontSize === 'small');
    document.documentElement.classList.toggle('text-base', settings.fontSize === 'medium');
    document.documentElement.classList.toggle('text-lg', settings.fontSize === 'large');
    document.documentElement.classList.toggle('text-xl', settings.fontSize === 'x-large');
    
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
    document.documentElement.classList.toggle('focus-visible', settings.focusIndicators);
    document.documentElement.classList.toggle('dyslexic-font', settings.dyslexicFont);
    
    // Save settings
    localStorage.setItem('qr-genie-accessibility', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider 
      value={{ 
        isOpen, 
        togglePanel, 
        settings, 
        updateSetting,
        readingGuideActive: settings.readingGuide
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}