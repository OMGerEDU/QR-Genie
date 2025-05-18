import React, { createContext, useContext, useState, useEffect } from 'react';

// Dictionary of translations
const translations = {
  appName: { en: 'QR Genie', he: 'קוסם הQR' },
  tagline: { 
    en: 'Create professional QR codes in seconds', 
    he: 'צור קודי QR מקצועיים תוך שניות' 
  },
  generate: { en: 'Generate QR', he: 'צור קוד QR' },
  download: { en: 'Download', he: 'הורדה' },
  history: { en: 'History', he: 'היסטוריה' },
  settings: { en: 'Settings', he: 'הגדרות' },
  url: { en: 'URL', he: 'כתובת אתר' },
  text: { en: 'Text', he: 'טקסט' },
  vcard: { en: 'Contact (vCard)', he: 'איש קשר (vCard)' },
  wifi: { en: 'Wi-Fi', he: 'Wi-Fi' },
  event: { en: 'Event', he: 'אירוע' },
  size: { en: 'Size', he: 'גודל' },
  color: { en: 'Color', he: 'צבע' },
  background: { en: 'Background', he: 'רקע' },
  errorCorrection: { en: 'Error Correction', he: 'תיקון שגיאות' },
  low: { en: 'Low', he: 'נמוך' },
  medium: { en: 'Medium', he: 'בינוני' },
  quartile: { en: 'Quartile', he: 'רבעון' },
  high: { en: 'High', he: 'גבוה' },
  logoOverlay: { en: 'Logo Overlay', he: 'לוגו מרכזי' },
  uploadLogo: { en: 'Upload Logo', he: 'העלה לוגו' },
  advancedOptions: { en: 'Advanced Options', he: 'אפשרויות מתקדמות' },
  batchGeneration: { en: 'Batch Generation', he: 'יצירה מרובה' },
  uploadCSV: { en: 'Upload CSV', he: 'העלה קובץ CSV' },
  scanQR: { en: 'Scan QR Code', he: 'סרוק קוד QR' },
  firstName: { en: 'First Name', he: 'שם פרטי' },
  lastName: { en: 'Last Name', he: 'שם משפחה' },
  email: { en: 'Email', he: 'דוא"ל' },
  phone: { en: 'Phone', he: 'טלפון' },
  company: { en: 'Company', he: 'חברה' },
  website: { en: 'Website', he: 'אתר אינטרנט' },
  ssid: { en: 'Network Name (SSID)', he: 'שם רשת (SSID)' },
  password: { en: 'Password', he: 'סיסמה' },
  hidden: { en: 'Hidden Network', he: 'רשת נסתרת' },
  encryptionType: { en: 'Encryption Type', he: 'סוג הצפנה' },
  eventTitle: { en: 'Event Title', he: 'כותרת האירוע' },
  location: { en: 'Location', he: 'מיקום' },
  startDate: { en: 'Start Date', he: 'תאריך התחלה' },
  endDate: { en: 'End Date', he: 'תאריך סיום' },
  description: { en: 'Description', he: 'תיאור' },
  cancel: { en: 'Cancel', he: 'ביטול' },
  save: { en: 'Save', he: 'שמור' },
  copy: { en: 'Copy', he: 'העתק' },
  copied: { en: 'Copied!', he: 'הועתק!' },
  accessibility: { en: 'Accessibility', he: 'נגישות' },
  fontSize: { en: 'Font Size', he: 'גודל גופן' },
  contrast: { en: 'High Contrast', he: 'ניגודיות גבוהה' },
  animations: { en: 'Reduce Animations', he: 'הפחתת אנימציות' },
  readingGuide: { en: 'Reading Guide', he: 'מדריך קריאה' },
  theme: { en: 'Theme', he: 'ערכת נושא' },
  light: { en: 'Light', he: 'בהיר' },
  dark: { en: 'Dark', he: 'כהה' },
  system: { en: 'System', he: 'מערכת' },
  cookieConsent: { 
    en: 'We use cookies to enhance your experience. By continuing, you agree to our use of cookies.',
    he: 'אנו משתמשים בעוגיות כדי לשפר את החוויה שלך. המשך שימוש באתר מהווה הסכמה לשימוש בעוגיות.'
  },
  accept: { en: 'Accept', he: 'אישור' },
  learnMore: { en: 'Learn More', he: 'מידע נוסף' },
  recentQRCodes: { en: 'Recent QR Codes', he: 'קודי QR אחרונים' },
  noHistory: { 
    en: 'No history yet. Generate a QR code to see it here.', 
    he: 'אין היסטוריה עדיין. צור קוד QR כדי לראותו כאן.' 
  },
  enterURL: { en: 'Enter URL or text', he: 'הזן כתובת אתר או טקסט' },
  svgDownload: { en: 'SVG (Vector)', he: 'SVG (וקטורי)' },
  pngDownload: { en: 'PNG (Image)', he: 'PNG (תמונה)' },
  jpgDownload: { en: 'JPG (Image)', he: 'JPG (תמונה)' },
  pdfDownload: { en: 'PDF Document', he: 'PDF מסמך' },
  backToTop: { en: 'Back to Top', he: 'חזרה למעלה' },
  showKeyboardShortcuts: { en: 'Keyboard Shortcuts', he: 'קיצורי מקלדת' },
  keyboardShortcuts: {
    en: {
      l: 'Change language',
      a: 'Open accessibility menu',
      '?': 'Show keyboard shortcuts',
      esc: 'Close dialog',
      1: 'URL mode',
      2: 'vCard mode',
      3: 'Wi-Fi mode',
      4: 'Event mode',
      g: 'Generate QR code',
      s: 'Save current QR code',
      d: 'Download current QR code',
      h: 'Toggle history panel'
    },
    he: {
      l: 'החלפת שפה',
      a: 'תפריט נגישות',
      '?': 'הצג קיצורי מקלדת',
      esc: 'סגור חלון',
      1: 'מצב כתובת אתר',
      2: 'מצב איש קשר',
      3: 'מצב Wi-Fi',
      4: 'מצב אירוע',
      g: 'צור קוד QR',
      s: 'שמור קוד QR נוכחי',
      d: 'הורד קוד QR נוכחי',
      h: 'הצג/הסתר היסטוריה'
    }
  },
  liveTour: { en: 'Take a Tour', he: 'סיור מודרך' },
  startTour: { en: 'Start Tour', he: 'התחל סיור' },
  nextStep: { en: 'Next', he: 'הבא' },
  prevStep: { en: 'Previous', he: 'הקודם' },
  finishTour: { en: 'Finish', he: 'סיום' },
  skipTour: { en: 'Skip', he: 'דלג' },
  tourSteps: {
    en: [
      {
        title: 'Welcome to QR Genie!',
        content: 'This quick tour will show you how to create professional QR codes in seconds.'
      },
      {
        title: 'Choose a QR Code Type',
        content: 'Select the type of QR code you want to create - URL, vCard, Wi-Fi or Event.'
      },
      {
        title: 'Enter Your Data',
        content: 'Fill in the fields based on the type of QR code you selected.'
      },
      {
        title: 'Customize Your QR Code',
        content: 'Change colors, size, and add a logo to make your QR code unique.'
      },
      {
        title: 'Generate & Download',
        content: 'Click Generate, then download your QR code in multiple formats.'
      },
      {
        title: 'Access History',
        content: 'All your generated QR codes are saved here for easy access.'
      }
    ],
    he: [
      {
        title: 'ברוכים הבאים ל-QR Genie!',
        content: 'סיור מהיר זה יראה לך כיצד ליצור קודי QR מקצועיים תוך שניות.'
      },
      {
        title: 'בחר סוג קוד QR',
        content: 'בחר את סוג קוד ה-QR שברצונך ליצור - כתובת אתר, איש קשר, Wi-Fi או אירוע.'
      },
      {
        title: 'הזן את הנתונים שלך',
        content: 'מלא את השדות בהתאם לסוג קוד ה-QR שבחרת.'
      },
      {
        title: 'התאם אישית את קוד ה-QR שלך',
        content: 'שנה צבעים, גודל, והוסף לוגו כדי להפוך את קוד ה-QR שלך לייחודי.'
      },
      {
        title: 'צור והורד',
        content: 'לחץ על צור, ולאחר מכן הורד את קוד ה-QR שלך במספר פורמטים.'
      },
      {
        title: 'גישה להיסטוריה',
        content: 'כל קודי ה-QR שיצרת נשמרים כאן לגישה קלה.'
      }
    ]
  },
  qrType: { en: 'QR Code Type', he: 'סוג קוד QR' },
  data: { en: 'Data', he: 'נתונים' },
  style: { en: 'Style', he: 'עיצוב' },
  preview: { en: 'Preview', he: 'תצוגה מקדימה' },
  batchProcessing: { en: 'Batch Processing', he: 'עיבוד אצווה' },
  downloadAll: { en: 'Download All', he: 'הורד הכל' },
  scannerInstructions: { 
    en: 'Point your camera at a QR code to scan it',
    he: 'כוון את המצלמה לקוד QR כדי לסרוק אותו'
  },
  scannedResult: { en: 'Scanned Result', he: 'תוצאת סריקה' },
  noCamera: { 
    en: 'No camera found or access denied',
    he: 'לא נמצאה מצלמה או שהגישה נדחתה'
  },
  chat: { en: 'Chat Support', he: 'תמיכה בצ\'אט' },
  startChat: { en: 'Start Chat', he: 'התחל צ\'אט' },
  chatPlaceholder: { en: 'Type your message...', he: 'הקלד את ההודעה שלך...' },
  closeChat: { en: 'Close Chat', he: 'סגור צ\'אט' },
  errorMessage: { 
    en: 'Something went wrong. Please try again.',
    he: 'משהו השתבש. אנא נסה שוב.'
  },
  shareQR: { en: 'Share QR Code', he: 'שתף קוד QR' },
  addToHomeScreen: { 
    en: 'Add to Home Screen',
    he: 'הוסף למסך הבית'
  },
  later: { en: 'Later', he: 'מאוחר יותר' },
  eyeStyle: { en: 'Eye Style', he: 'סגנון עיניים' },
  dotStyle: { en: 'Dot Style', he: 'סגנון נקודות' },
  cornerStyle: { en: 'Corner Style', he: 'סגנון פינות' }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Check for saved language preference or browser language
  const getSavedLanguage = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('qr-genie-language');
      if (saved) return saved;
      
      // Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith('he')) return 'he';
    }
    return 'en'; // Default to English
  };

  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    setLanguage(getSavedLanguage());
  }, []);

  useEffect(() => {
    // Set RTL based on language
    setIsRTL(language === 'he');
    
    // Save language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('qr-genie-language', language);
      document.dir = language === 'he' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key) => {
    const parts = key.split('.');
    let value = translations;
    
    // Navigate through nested objects
    for (const part of parts) {
      if (!value[part]) {
        console.warn(`Translation missing for: ${key}`);
        return key;
      }
      value = value[part];
    }
    
    if (typeof value === 'object' && value[language]) {
      return value[language];
    }
    
    console.warn(`Translation missing for: ${key} in ${language}`);
    return key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'he' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}