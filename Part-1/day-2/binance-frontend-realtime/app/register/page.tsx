"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define a schema for validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the User Agreement and Privacy Policy");
      return;
    }
    setError("");

    // Validate inputs
    const result = registerSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
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
            Create Account
          </h2>
        </div>

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

            <div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-700 bg-[#1C1D21] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b2ff] focus:border-transparent"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-[#00b2ff] focus:ring-[#00b2ff] border-gray-700 rounded bg-[#1C1D21]"
            />
            <label htmlFor="agree" className="ml-2 block text-sm text-gray-400">
              By signing up, I agree to the{" "}
              <Link href="/terms" className="text-[#00b2ff] hover:text-[#33c3ff]">
                User Agreement
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#00b2ff] hover:text-[#33c3ff]">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={!agreed}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg text-white bg-[#00b2ff] hover:bg-[#33c3ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b2ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
