'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import AIChat from '@/components/chat/AIChat';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <AIChat />
    </LanguageProvider>
  );
}