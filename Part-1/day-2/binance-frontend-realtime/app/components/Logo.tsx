'use client';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#00b2ff] transform hover:scale-105 transition-transform duration-200"
      >
        <path
          d="M16 2L4 9V23L16 30L28 23V9L16 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 12L10 15V21L16 24L22 21V15L16 12Z"
          fill="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2.5 font-semibold text-white text-lg tracking-tight">Exchange</span>
    </div>
  );
} 