import React, { useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    g_gTranslateIsAdded: boolean;
  }
}

// Initialize the global flag
if (typeof window !== 'undefined') {
  window.g_gTranslateIsAdded = window.g_gTranslateIsAdded || false;
}

export default function GoogleTranslate() {
  const { currentLanguage } = useLanguage();
  const googleTranslateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Skip if already initialized
    if (window.g_gTranslateIsAdded) {
      return;
    }

    window.googleTranslateElementInit = () => {
      if (!window.g_gTranslateIsAdded && googleTranslateRef.current) {
        window.g_gTranslateIsAdded = true;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,vi,zh-CN,zh-TW,ja,ko,th,fr,de,it,ru,ar,hi,tl',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          googleTranslateRef.current
        );

        // Add custom styling
        const style = document.createElement('style');
        style.textContent = `
          .goog-te-gadget {
            font-family: inherit !important;
            font-size: 13px !important;
            margin: -4px 0 !important;
          }
          .goog-te-gadget-simple {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            line-height: 1.2 !important;
          }
          .goog-te-gadget-simple .goog-te-menu-value {
            padding: 0 !important;
            margin: 0 !important;
            vertical-align: middle !important;
          }
          .goog-te-gadget-simple .goog-te-menu-value span:not(:first-child) {
            display: none !important;
          }
          .goog-te-gadget-simple .goog-te-menu-value span:first-child {
            color: transparent !important;
            visibility: visible !important;
          }
          .goog-te-gadget img {
            display: none !important;
          }
          .goog-te-gadget-simple span {
            margin-right: 0 !important;
            border: none !important;
          }
          .goog-te-combo {
            padding: 4px !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            color: #374151 !important;
            background-color: white !important;
            min-width: 120px !important;
            appearance: auto !important;
            -webkit-appearance: auto !important;
          }
          .goog-logo-link {
            display: none !important;
          }
          .goog-te-banner-frame {
            display: none !important;
          }
          #goog-gt-tt, .goog-te-balloon-frame {
            display: none !important;
          }
          .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    // Add the script only if not already added
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      id="google_translate_element" 
      ref={googleTranslateRef}
      style={{ position: 'relative', zIndex: 1 }}
    />
  );
}