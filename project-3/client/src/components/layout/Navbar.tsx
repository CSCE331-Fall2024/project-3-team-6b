// client/src/components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LoginButton from './LoginButton';
import Weather from './Weather';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Calculator } from 'lucide-react'; // Import icons

export default function Navbar() {
  const pathname = usePathname();
  const { translate } = useLanguage();

  const navLinks = [
    { href: '/menu', label: translate('Menu') },
    { href: '/cart', label: translate('Cart') },
    { href: '/order-status', label: translate('Accessibility') },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-[var(--panda-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/panda-logo.png"
                  alt="Panda Express"
                  fill
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-xl font-bold">Panda Express</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'nav-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Access Buttons */}
            <Link 
              href="/admin"
              className="flex items-center space-x-1 px-3 py-2 bg-[var(--panda-gold)] text-black rounded-md hover:bg-[var(--panda-light-gold)] transition-colors"
            >
              <Users size={18} />
              <span>Manager</span>
            </Link>
            
            <Link 
              href="/cashier"
              className="flex items-center space-x-1 px-3 py-2 bg-[var(--panda-red)] text-white rounded-md hover:bg-[var(--panda-dark-red)] transition-colors"
            >
              <Calculator size={18} />
              <span>Cashier</span>
            </Link>

            <Weather />
            <LanguageSelector />
            <LoginButton />
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden py-2 border-t">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link block py-1 ${pathname === link.href ? 'nav-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Quick Access */}
            <Link
              href="/manager"
              className="flex items-center space-x-2 px-3 py-2 bg-[var(--panda-gold)] text-black rounded-md hover:bg-[var(--panda-light-gold)] transition-colors mt-2"
            >
              <Users size={18} />
              <span>Manager</span>
            </Link>
            <Link
              href="/cashier"
              className="flex items-center space-x-2 px-3 py-2 bg-[var(--panda-red)] text-white rounded-md hover:bg-[var(--panda-dark-red)] transition-colors"
            >
              <Calculator size={18} />
              <span>Cashier</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}