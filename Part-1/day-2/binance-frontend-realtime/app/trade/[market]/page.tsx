"use client";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { Depth } from "@/app/components/depth/Depth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTicker } from "@/app/utils/httpClient";
import { Ticker } from "@/app/utils/types";

export default function Page() {
  const { market } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    if (!market) return;

    const loadMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await getTicker(market as string);
        setTicker(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load market:', err);
        setError('Failed to load market data');
        // Redirect to markets page after a delay if market not found
        setTimeout(() => router.push('/markets'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarketData();
  }, [market, router]);

  if (!market || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0E12] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00b2ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0E12] text-white">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-gray-400">Redirecting to markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0E12] pt-16">
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-3">
        <MarketBar market={market as string} />
        
        <div className="grid grid-cols-[1fr,auto,300px] gap-4 mt-4">
          {/* Main trading view and depth */}
          <div className="flex flex-col bg-[#1C1D21] rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="h-[600px]">
                <TradeView market={market as string} />
              </div>
            </div>

          {/* Depth chart */}
          <div className="w-[300px] bg-[#1C1D21] rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-white font-medium">Order Book</h2>
              </div>
            <div className="h-[556px] overflow-y-auto custom-scrollbar">
              <Depth market={market as string} />
            </div>
          </div>

          {/* Swap UI */}
          <div className="w-[300px] bg-[#1C1D21] rounded-lg border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-white font-medium">Swap</h2>
              </div>
            <div className="p-4">
              <SwapUI market={market as string} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
