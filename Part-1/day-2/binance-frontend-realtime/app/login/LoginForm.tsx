"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Invalid credentials");
        return;
      }

      const data = await response.json();
      // Store the token
      localStorage.setItem('token', data.token);
      
      router.push("/");
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0E12] relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://backpack.exchange/candlestick-chart.svg"
          alt="Candlestick Chart"
          fill
          style={{ objectFit: 'cover', opacity: 0.1 }}
        />
      </div>

      <div className="max-w-md w-full space-y-8 p-8 bg-[#1C1D21]/80 backdrop-blur-md rounded-lg relative z-10">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="text-[#FF5C5C]">
              <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" fill="currentColor"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Sign In
          </h2>
        </div>

        {justRegistered && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">Registration successful! Please sign in.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1C1D21] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b2ff] focus:border-transparent"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1C1D21] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b2ff] focus:border-transparent"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-white bg-[#00b2ff] hover:bg-[#33c3ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b2ff] transition-colors duration-200"
            >
              Sign in
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/forgot-password" className="text-[#00b2ff] hover:text-[#33c3ff]">
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 