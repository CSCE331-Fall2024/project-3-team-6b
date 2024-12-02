'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleAuthAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (session) {
        // User is signed in, perform sign-out
        await signOut({ redirect: true, callbackUrl: '/' });
      } else {
        // User is signed out, perform sign-in
        await signIn('google', { redirect: true, callbackUrl: '/' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <button 
        onClick={handleAuthAction} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {session ? 'Sign Out' : 'Sign In'}
      </button>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
