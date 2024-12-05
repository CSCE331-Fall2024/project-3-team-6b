'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import AuthButton from '../AuthButton';
import Weather from './Weather';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Calculator, ChevronDown , Accessibility, Info  } from 'lucide-react'; // Import icons
import { Search } from 'lucide-react'; // Import the magnifier icon
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

  const toggleAccessibilityDropdown = () => {
    setIsAccessibilityDropdownOpen(!isAccessibilityDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsAccessibilityDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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

  // useEffect(() => {
  //   if (magnifierEnabled) {
  //     document.body.style.transform = `scale(${magnification})`;
  //     document.body.style.transformOrigin = 'top left';
  //     document.body.style.transition = 'transform 0.3s ease';
  //   } else {
  //     document.body.style.transform = 'none';
  //   }

  //   return () => {
  //     document.body.style.transform = 'none';
  //   };
  // }, [magnifierEnabled, magnification]);

  useEffect(() => {
    if (magnifierEnabled) {
      const content = document.querySelector('main'); // or any other wrapper for your content
      const navbar = document.querySelector('#navbar'); 
      
      if (navbar) {
        const navbarElement = navbar as HTMLElement;

        navbarElement.style.position = 'fixed';
        navbarElement.style.top = '0';
        navbarElement.style.left = '0';
        navbarElement.style.right = '0';
        navbarElement.style.zIndex = '10';  // Ensure the navbar is above other content
        navbarElement.style.width = '100%'; // Ensure navbar stretches across the entire width
        navbarElement.style.boxSizing = 'border-box';// Include padding and borders in width calculation
      }
      if (content) {
        content.style.transform = `scale(${magnification})`;
        content.style.transformOrigin = 'top left';
        content.style.transition = 'transform 0.3s ease';
        content.style.marginTop = `${(1 - magnification) * -100}px`; // Adjust the margin to prevent overlap
        content.style.transition = 'margin-top 0.3s ease';
      }
    } else {
      const content = document.querySelector('main');
      if (content) {
        content.style.transform = 'none';
      }
    }
  
    return () => {
      const content = document.querySelector('main');
      if (content) {
        content.style.transform = 'none';
      }
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b-4 border-[var(--panda-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
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

          {/* Navigation Links */}

          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/menu">{translate('Menu')}</NavLink>
            <NavLink href="/cart">{translate('Cart')}</NavLink>

            {/* Accessibility Dropdown */}

            
    <div className="relative">
      <button
        type="button"
        onClick={toggleAccessibilityDropdown}
        className="nav-link px-4 py-2 text-[var(--panda-black)]"
        aria-expanded={isAccessibilityDropdownOpen}
      >
         <Accessibility size={60}  color="red" strokeWidth={2.5}/>
      </button>
      

      {/* Dropdown Menu */}
      {isAccessibilityDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
          style={{ zIndex: 50 }}
          ref={dropdownRef}
        >
          <button
            onClick={() => {
              document.documentElement.classList.toggle('high-contrast');
              setSelectedOption((prev) => (prev === 'high-contrast' ? null : 'high-contrast'));
            }}
            className={`px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none ${
              selectedOption === 'high-contrast' ? 'bg-blue-100 text-blue-800' : ''
            }`}
          >
            {translate('High Contrast')}
          </button>
          <button
            onClick={() => {
              document.documentElement.classList.toggle('text-lg');
              setSelectedOption((prev) => (prev === 'text-lg' ? null : 'text-lg'));
            }}
            className={`px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none ${
              selectedOption === 'text-lg' ? 'bg-blue-100 text-blue-800' : ''
            }`}
          >
            {translate('Increase Text Size')}
          </button>
          <button
            onClick={() => {
              setMagnifierEnabled((prev) => !prev);
              setSelectedOption((prev) => (prev === 'magnifier' ? null : 'magnifier'));
            }}
            className={`px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none ${
              selectedOption === 'magnifier' && magnifierEnabled ? 'bg-blue-100 text-blue-800' : ''
            }`}
          >
            {translate('Magnifier')}
          </button>
          
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
          {/* Wiki/Documentation Link - Now separated and always on far right */}
    <Link
      href="/documentation"
      className="ml-2 p-2 text-[var(--panda-red)] hover:bg-gray-100 rounded-full transition-colors"
      title="Documentation"
    >
      <Info size={16} />
    </Link>
        </div>
      </div>
      

        {/* Magnifier Controls */}
        {/* Magnifier Controls */}
{magnifierEnabled && (
  <div className="fixed bottom-0 left-0 right-0 bg-[var(--panda-red)] text-white p-6 shadow-2xl z-[100]">
    <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
      <label 
        htmlFor="magnification" 
        className="text-2xl font-bold tracking-wide"
      >
        {translate('Magnification Level')}
      </label>
      <div className="flex items-center space-x-6">
        <input
          type="range"
          id="magnification"
          min="1.5"
          max="4"
          step="0.5"
          value={magnification}
          onChange={(e) => setMagnification(Number(e.target.value))}
          className="w-96 h-4 bg-white appearance-none cursor-pointer rounded-full 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-12 
            [&::-webkit-slider-thumb]:h-12 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:shadow-lg"
        />
        <span className="text-4xl font-bold">{magnification}x</span>
      </div>
    </div>
  </div>
)}
      {/* </div> */}
      
      
    </nav>
  );
}