'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginButton from './LoginButton';
import Weather from './Weather';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { Users, Calculator, ChevronDown } from 'lucide-react'; // Import icons
import { Search } from 'lucide-react'; // Import the magnifier icon
import ScreenMagnifier from '../../components/ScreenMagnifier';
import ScreenZoom from '../ScreenZoom';

export default function Navbar() {
  const pathname = usePathname();
  const { translate } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [magnification, setMagnification] = useState(1.5);
  const [isAccessibilityDropdownOpen, setIsAccessibilityDropdownOpen] = useState(false);

  useEffect(() => {
    if (magnifierEnabled) {
      // Apply the scale transformation based on the magnification value
      document.body.style.transform = `scale(${magnification})`;
      document.body.style.transformOrigin = 'top left'; // Keep zoom anchored at the top left
      document.body.style.transition = 'transform 0.3s ease'; // Smooth zoom transition
    } else {
      // Reset the transform when magnifier is disabled
      document.body.style.transform = 'none';
    }
  }, [magnifierEnabled, magnification]);
  // Function to toggle high contrast mode
  const toggleHighContrastMode = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  // Function to toggle enlarged text
  const toggleEnlargedText = () => {
    document.documentElement.classList.toggle('text-lg');
  };

  // Function to enable all accessibility features
  const enableAllAccessibilityFeatures = () => {
    toggleHighContrastMode();
    toggleEnlargedText();
    
  };

  const toggleAccessibilityDropdown = () => {
    setIsAccessibilityDropdownOpen(!isAccessibilityDropdownOpen);
  };

  
  return (
    <nav className="bg-white shadow-lg border-b-4 border-[var(--panda-red)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
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
            <Link
              href="/menu"
              className={`nav-link ${pathname === '/menu' ? 'nav-active' : ''}`}
            >
              {translate('Menu')}
            </Link>
            <Link
              href="/cart"
              className={`nav-link ${pathname === '/cart' ? 'nav-active' : ''}`}
            >
              {translate('Cart')}
            </Link>

            {/* Accessibility Dropdown */}
            {/* Accessibility Dropdown */}
<div className="relative">
  <button
    type="button"
    onClick={toggleAccessibilityDropdown}
    className="nav-link px-4 py-2 text-[var(--panda-black)]"
    aria-expanded={isAccessibilityDropdownOpen}
  >
    {translate('Accessibility')}
  </button>

  {/* Dropdown Menu */}
  {isAccessibilityDropdownOpen && (
    <div
      className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md py-2 z-50"
      style={{ zIndex: 50 }}
    >
      <button
        onClick={() => document.documentElement.classList.toggle('high-contrast')}
        className="px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none"
      >
        {translate('High Contrast')}
      </button>
      <button
        onClick={() => document.documentElement.classList.toggle('text-lg')}
        className="px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none"
      >
        {translate('Increase Text Size')}
      </button>
      <button
        onClick={() => setMagnifierEnabled((prev) => !prev)}
        className={`px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none ${
          magnifierEnabled ? 'bg-blue-100' : ''
        }`}
      >
        {translate('Magnifier')}
      </button>
      <button
        onClick={() => {
          document.documentElement.classList.toggle('high-contrast');
          document.documentElement.classList.toggle('text-lg');
          setMagnifierEnabled(true);
        }}
        className="px-4 py-2 text-left w-full hover:bg-gray-100 focus:outline-none"
      >
        {translate('Enable All')}
      </button>
    </div>
  )}
</div>


          </div>

          {/* Right Side Quick Access Buttons */}
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
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Magnifier Options */}
      {magnifierEnabled && (
        <div className="flex justify-center mt-4">
          <label htmlFor="magnification" className="mr-2">
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
          <span className="ml-2">{magnification}x</span>
        </div>
      )}

      
      {/* <ScreenMagnifier enabled={magnifierEnabled} magnification={magnification} /> */}
    </nav>
  );
}
