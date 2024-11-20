import React from 'react';
import { Globe } from 'lucide-react';
import GoogleTranslate from '../GoogleTranslate';

export default function LanguageSelector() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm 
                    hover:shadow-md transition-all duration-200 border border-gray-200">
      <Globe className="h-4 w-4 text-[var(--panda-red)]" />
      <GoogleTranslate />
    </div>
  );
}