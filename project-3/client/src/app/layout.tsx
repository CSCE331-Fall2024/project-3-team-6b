import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/app/Providers'
import ClientLayout from '@/app/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panda Express POS',
  description: 'Point of Sale System for Panda Express',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}