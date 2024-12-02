// // client/src/lib/i18n/languages.ts
// export const languages = [
//   { code: 'en', name: 'English', flag: '🇺🇸' },
//   { code: 'es', name: 'Español', flag: '🇪🇸' },
//   { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
//   { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
// ] as const;

// export type LanguageCode = typeof languages[number]['code'];

// // client/src/context/LanguageContext.tsx
// 'use client';

// import { createContext, useContext, useState } from 'react';
// import { LanguageCode } from '@/lib/i18n/languages';

// interface LanguageContextType {
//   currentLanguage: LanguageCode;
//   setLanguage: (lang: LanguageCode) => void;
//   translate: (key: string) => string;
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// export function LanguageProvider({ children }: { children: React.ReactNode }) {
//   const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

//   const setLanguage = async (lang: LanguageCode) => {
//     // Here you would integrate with Azure Translator API
//     // For now, we'll just set the language
//     setCurrentLanguage(lang);
//   };

//   const translate = (key: string) => {
//     // Here you would use Azure Translator API to translate the text
//     // For now, we'll return the key
//     return key;
//   };

//   return (
//     <LanguageContext.Provider value={{ currentLanguage, setLanguage, translate }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext);
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// }

// // client/src/components/layout/LanguageSelector.tsx
// 'use client';

// import { useState } from 'react';
// import { Globe } from 'lucide-react';
// import { useLanguage } from '@/context/LanguageContext';
// import { languages } from '@/lib/i18n/languages';

// export default function LanguageSelector() {
//   const [isOpen, setIsOpen] = useState(false);
//   const { currentLanguage, setLanguage } = useLanguage();

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
//       >
//         <Globe className="h-5 w-5" />
//         <span>{languages.find(l => l.code === currentLanguage)?.flag}</span>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//           <div className="py-1" role="menu">
//             {languages.map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => {
//                   setLanguage(lang.code);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
//                   currentLanguage === lang.code ? 'bg-gray-50 text-[var(--panda-red)]' : ''
//                 }`}
//               >
//                 <span>{lang.flag}</span>
//                 <span>{lang.name}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }