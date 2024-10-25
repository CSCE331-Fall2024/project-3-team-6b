// client/src/components/layout/LoginButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut } from 'lucide-react';

export default function LoginButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // In a real app, this would check a global auth state
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <UserCircle className="h-6 w-6" />
            <span>Account</span>
          </button>
          
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="btn-primary flex items-center space-x-2"
        >
          <UserCircle className="h-6 w-6" />
          <span>Login</span>
        </button>
      )}
    </div>
  );
}