'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthButton from '../AuthButton';
import Weather from './Weather';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import ScreenMagnifier from '../ScreenMagnifier';

interface AccessibilityOption {
  id: 'high-contrast' | 'text-lg' | 'magnifier';
  label: string;
  action: () => void;
}

export default function Navbar() {
  const pathname = usePathname();
  const { translate } = useLanguage();
  const [isAccessibilityDropdownOpen, setIsAccessibilityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [magnification, setMagnification] = useState(1.5);
  const [selectedOption, setSelectedOption] = useState<AccessibilityOption['id'] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const accessibilityOptions: AccessibilityOption[] = [
    {
      id: 'high-contrast',
      label: translate('High Contrast'),
      action: () => document.documentElement.classList.toggle('high-contrast')
    },
    {
      id: 'text-lg',
      label: translate('Increase Text Size'),
      action: () => document.documentElement.classList.toggle('text-lg')
    },
    {
      id: 'magnifier',
      label: translate('Magnifier'),
      action: () => setMagnifierEnabled(prev => !prev)
    }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccessibilityDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (magnifierEnabled) {
      document.body.style.transform = `scale(${magnification})`;
      document.body.style.transformOrigin = 'top left';
      document.body.style.transition = 'transform 0.3s ease';
    } else {
      document.body.style.transform = 'none';
    }

    return () => {
      document.body.style.transform = 'none';
    };
  }, [magnifierEnabled, magnification]);

  const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
    <Link
      href={href}
      className={`nav-link ${pathname === href ? 'text-[var(--panda-red)]' : ''} hover:text-[var(--panda-red)] transition-colors`}
      onClick={onClick}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b-4 border-[var(--panda-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/panda-logo.png"
                alt="Panda Express"
                fill
                className="object-contain rounded-full"
                priority
              />
            </div>
            <span className="text-xl font-bold">Panda Express</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/menu">{translate('Menu')}</NavLink>
            <NavLink href="/cart">{translate('Cart')}</NavLink>

            {/* Accessibility Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAccessibilityDropdownOpen(!isAccessibilityDropdownOpen)}
                className="nav-link px-4 py-2"
              >
                {translate('Accessibility')}
              </button>

              {isAccessibilityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                  {accessibilityOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => {
                        option.action();
                        setSelectedOption(option.id === selectedOption ? null : option.id);
                      }}
                      className={`px-4 py-2 text-left w-full hover:bg-gray-100 ${
                        selectedOption === option.id ? 'bg-blue-100 text-blue-800' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Manager Button */}
            <Link
              href="/admin"
              className="flex items-center space-x-1 px-3 py-2 bg-[var(--panda-gold)] text-black rounded-md hover:bg-[var(--panda-light-gold)] transition-colors"
            >
              <Users size={18} />
              <span>Manager</span>
            </Link>

            {/* Cashier Button */}
            <Link
              href="/cashier"
              className="flex items-center space-x-1 px-3 py-2 bg-[var(--panda-red)] text-white rounded-md hover:bg-[var(--panda-dark-red)] transition-colors"
            >
              <Calculator size={18} />
              <span>Cashier</span>
            </Link>

            {/* Weather, Language Selector, and Login Button */}
            <Weather />
            <LanguageSelector />
            <AuthButton />
          </div>
        </div>
      </div>

        {/* Magnifier Controls */}
        {magnifierEnabled && (
          <div className="absolute left-0 right-0 bg-white border-t px-4 py-2">
            <div className="flex items-center space-x-4 max-w-7xl mx-auto">
              <label htmlFor="magnification" className="text-sm font-medium">
                {translate('Magnification Level')}:
              </label>
              <input
                type="range"
                id="magnification"
                min="1.5"
                max="4"
                step="0.5"
                value={magnification}
                onChange={(e) => setMagnification(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm">{magnification}x</span>
            </div>
          </div>
        )}
      </div>
      
      {magnifierEnabled && <ScreenMagnifier enabled={magnifierEnabled} magnification={magnification} />}
    </nav>
  );
}