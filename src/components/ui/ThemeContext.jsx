import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem('qr-genie-theme');
    if (stored) {
      setTheme(stored);
    }
  }, []);

  // Handle theme changes and system preference
  useEffect(() => {
    const applyTheme = () => {
      let darkMode = false;
      
      if (theme === 'dark') {
        darkMode = true;
      } else if (theme === 'light') {
        darkMode = false;
      } else if (theme === 'system') {
        darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(darkMode);
      document.documentElement.classList.toggle('dark', darkMode);
    };

    applyTheme();
    localStorage.setItem('qr-genie-theme', theme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}