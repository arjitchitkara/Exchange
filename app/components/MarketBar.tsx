import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useWindowSize } from '../hooks/useWindowSize';

function Ticker({ market }: { market: string }) {
  const { width } = useWindowSize();
  
  return (
    <div className="flex h-[48px] sm:h-[60px] shrink-0 space-x-2 sm:space-x-4">
      <div className="flex flex-row relative ml-0 sm:ml-2 -mr-2 sm:-mr-4">
        <div className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 mt-3 sm:mt-4">
          <div className="relative w-full h-full">
            <Image
              alt="SOL Logo"
              src="/sol.webp"
              fill
              sizes={width < 640 ? '20px' : '24px'}
              className="rounded-full object-contain outline-baseBackgroundL1"
              priority={true}
            />
          </div>
        </div>
        <div className="relative h-5 w-5 sm:h-6 sm:w-6 -ml-2 mt-3 sm:mt-4">
          <div className="relative w-full h-full">
            <Image
              alt="USDC Logo"
              src="/usdc.webp"
              fill
              sizes={width < 640 ? '20px' : '24px'}
              className="rounded-full object-contain"
              priority={true}
            />
          </div>
        </div>
      </div>
      // ... rest of the component
    </div>
  );
}

export default Ticker; 