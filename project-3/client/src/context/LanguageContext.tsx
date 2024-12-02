'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export interface Translation {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}

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
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  const isRTL = useMemo(() => currentLanguage === 'en', [currentLanguage]);

  const translate = useCallback((key: string): string => {
    if (key in translations && currentLanguage in translations[key]) {
      return translations[key][currentLanguage];
    }
    return key;
  }, [currentLanguage]);

  const handleLanguageChange = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const value = useMemo(() => ({
    currentLanguage,
    setLanguage: handleLanguageChange,
    translate,
    isRTL
  }), [currentLanguage, handleLanguageChange, translate, isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}