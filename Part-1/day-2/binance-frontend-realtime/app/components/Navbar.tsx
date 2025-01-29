"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearch } from '../context/SearchContext';
import { FiSearch } from 'react-icons/fi';

export function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0E12]/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto px-3">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-semibold text-lg">
              Exchange
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-gray-300">
                Markets
              </Link>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-lg px-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-lg bg-[#2C2D33] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b2ff] focus:ring-opacity-50"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-[#00b2ff] hover:text-[#33c3ff] font-medium">
              Sign up
            </button>
            <button className="px-4 py-2 text-white bg-[#00b2ff] hover:bg-[#33c3ff] rounded-lg font-medium transition-colors">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
