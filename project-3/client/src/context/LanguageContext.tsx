// client/src/context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

// Define all supported languages
export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
] as const;

// Type definitions
export type LanguageCode = (typeof languages)[number]['code'];

export interface Translation {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}

// Basic translations (you can expand this)
const translations: Translation = {
  'Welcome to Panda Express': {
    en: 'Welcome to Panda Express',
    es: 'Bienvenido a Panda Express',
    zh: '欢迎光临熊猫快餐',
    vi: 'Chào mừng đến với Panda Express',
  },
  'Menu': {
    en: 'Menu',
    es: 'Menú',
    zh: '菜单',
    vi: 'Thực đơn',
  },
  'Cart': {
    en: 'Cart',
    es: 'Carrito',
    zh: '购物车',
    vi: 'Giỏ hàng',
  },
  // Add more translations as needed
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const translate = useCallback((key: string): string => {
    if (translations[key] && translations[key][currentLanguage]) {
      return translations[key][currentLanguage];
    }

    // If translation not found, return the key itself
    console.warn(`Translation missing for key: ${key} in language: ${currentLanguage}`);
    return key;
  }, [currentLanguage]);

  const isRTL = currentLanguage === 'ar'; // Add more RTL languages if needed

  const setLanguage = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage, 
        translate,
        isRTL
      }}
    >
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