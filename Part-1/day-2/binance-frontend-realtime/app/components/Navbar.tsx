"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

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
              <Link href="/markets" className="text-white hover:text-gray-300">
                Markets
              </Link>
              <Link href="/trade" className="text-gray-400 hover:text-gray-300">
                Trade
              </Link>
              <Link href="/futures" className="text-gray-400 hover:text-gray-300">
                Futures
              </Link>
              <Link href="/lend" className="text-gray-400 hover:text-gray-300">
                Lend
              </Link>
              <button className="text-gray-400 hover:text-gray-300">
                More
              </button>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search markets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1C1D21] text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-1 focus:ring-[#00b2ff] transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
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
