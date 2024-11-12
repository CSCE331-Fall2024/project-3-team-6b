import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

let googleTranslateInitialized = false;

export default function GoogleTranslate() {
  const [initialized, setInitialized] = useState(false);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (googleTranslateInitialized) {
      setInitialized(true);
      return;
    }

    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (document.getElementById('google_translate_element')) {
        // Prevent re-initializing if the element already exists
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,es,vi,zh-CN,zh-TW,ja,ko,th,fr,de,it,ru,ar,hi,tl',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }

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

      setInitialized(true);
      googleTranslateInitialized = true;
    };

    addScript();

    return () => {
      // Only remove the select element (dropdown) if it exists
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.remove();
      }
    };
  }, []);

  return <div id="google_translate_element" className="min-w-[120px]" />;
}
