import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import GoogleTranslate from '../GoogleTranslate';

// Define supported languages with their details
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm 
                   hover:shadow-md transition-all duration-200 border border-gray-200"
        aria-expanded={isOpen}
      >
        <Globe className="h-5 w-5 text-[var(--panda-red)]" />
        <span className="text-sm font-medium text-gray-700">Select Language</span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-200 z-50">
          {/* Quick Select Languages */}
          <div className="p-2 space-y-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  // Add your language change logic here
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 
                         hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-200 mx-2" />
          
          {/* Google Translate Section */}
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2">More languages</div>
            <GoogleTranslate />
          </div>
        </div>
      )}
    </div>
  );
}