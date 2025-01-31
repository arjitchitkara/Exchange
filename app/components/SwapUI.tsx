import { useState } from "react";
import Image from "next/image";
import { useWindowSize } from '../hooks/useWindowSize';

export function SwapUI({ market }: { market: string }) {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const [type, setType] = useState("limit");
  const { width } = useWindowSize();

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-row h-[48px] sm:h-[60px]">
          <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
          <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="flex flex-row absolute right-1 top-1 p-1 sm:p-2">
          <div className="relative">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="relative w-full h-full">
                <Image
                  src="/usdc.webp"
                  alt="USDC"
                  fill
                  sizes={width < 640 ? '20px' : '24px'}
                  className="rounded-full object-contain"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row absolute right-1 top-1 p-1 sm:p-2">
          <div className="relative">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <div className="relative w-full h-full">
                <Image
                  src="/sol.webp"
                  alt="SOL"
                  fill
                  sizes={width < 640 ? '20px' : '24px'}
                  className="rounded-full object-contain"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 