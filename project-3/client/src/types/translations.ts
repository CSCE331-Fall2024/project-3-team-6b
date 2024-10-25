// client/src/types/translations.ts
import { LanguageCode } from '@/context/LanguageContext';

export interface TranslationKey {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}