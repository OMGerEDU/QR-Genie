import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AccessibilityPanel from '../components/accessibility/AccessibilityPanel';

export default function Layout({ children, currentPageName }) {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      if (e.key === 'l') {
        window.dispatchEvent(new CustomEvent('qr-genie-toggle-language'));
      } else if (e.key === 'a') {
        window.dispatchEvent(new CustomEvent('qr-genie-toggle-accessibility'));
      } else if (e.key === '?') {
        window.dispatchEvent(new CustomEvent('qr-genie-show-shortcuts'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
      <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <AccessibilityPanel />
        {/* Global styles */}
        <style>{`
        :root {
          --color-bg:         #F7FAFC;
          --color-surface:    #E5F1F7;
          --color-main:       #007BA7;
          --color-accent:     #45B8C9;
          --color-success:    #38B48B;
          --color-warning:    #FFD166;
          --color-error:      #FF6F61;
          --color-text:       #192B35;
          --color-text-muted: #5B7380;
          --color-border:     #D7E3EA;
        }
        .dark {
          --color-bg:         #15222A;
          --color-surface:    #1B2B35;
          --color-main:       #2FAFE3;
          --color-accent:     #59C5EB;
          --color-success:    #41E1AE;
          --color-warning:    #FFC857;
          --color-error:      #FF9580;
          --color-text:       #F7FAFC;
          --color-text-muted: #9EB3C2;
          --color-border:     #314652;
        }
        .high-contrast {
          --color-bg:         #FFFFFF;
          --color-surface:    #E0E0E0;
          --color-main:       #0000FF;
          --color-accent:     #FF0000;
          --color-success:    #00AA00;
          --color-warning:    #FFDD00;
          --color-error:      #CC0000;
          --color-text:       #000000;
          --color-text-muted: #333333;
          --color-border:     #000000;
        }
        .focus-visible :focus-visible {
          outline: 3px solid var(--color-main);
          outline-offset: 2px;
        }
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      </div>
  );
}
