"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearch } from '../context/SearchContext';
import { FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';

export function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  // Only render the input after client-side hydration
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <div className="max-w-content">
          <div className="flex items-center justify-between h-16">
            {/* Loading state placeholder */}
            <div className="w-full h-16 animate-pulse bg-gray-800/50" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-content">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-white hover:text-gray-300 font-medium tracking-tight text-sm transition-colors"
              >
                Markets
              </Link>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-lg px-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400 group-focus-within:text-[#00b2ff] transition-colors" />
              </div>
              <input
                type="text"
                className="input-primary pl-9 py-1.5 text-sm"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <button onClick={handleSignOut} className="btn-primary text-sm py-1.5">
                Sign out
              </button>
            ) : (
              <>
                <Link href="/register" className="btn-secondary text-sm">
                  Sign up
                </Link>
                <Link href="/login" className="btn-primary text-sm py-1.5">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 
