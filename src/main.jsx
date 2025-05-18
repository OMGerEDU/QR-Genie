import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './components/i18n/LanguageContext'
import { ThemeProvider } from './components/ui/ThemeContext'
import { AccessibilityProvider } from './components/accessibility/AccessibilityContext'
import './index.css'; // or './App.css' if that's where your Tailwind is!

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LanguageProvider>
            <ThemeProvider>
                <AccessibilityProvider>
                    <App />
                </AccessibilityProvider>
            </ThemeProvider>
        </LanguageProvider>
    </React.StrictMode>
)
