"use client";

import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTickers } from "../utils/httpClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TABS = ["Spot", "Futures", "Lending"] as const;
type Tab = typeof TABS[number];

export const Markets = () => {
  const [tickers, setTickers] = useState<Ticker[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Spot");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getTickers()
      .then((m) => {
        setTickers(m);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load markets");
        setLoading(false);
      });
  }, []);

  const filteredTickers = tickers?.filter((ticker) =>
    ticker.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-[#0D0E12]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00b2ff]"></div>
      </div>
    );
  if (error) return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)] bg-[#0D0E12]">
      <div className="text-center text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{error}</div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0D0E12] pt-6 pb-12">
      <div className="relative mx-auto max-w-[1440px] w-full px-3">
        {/* Background Gradient Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#00b2ff]/10 rounded-full blur-[128px] -z-10" />
        <div className="absolute top-32 right-1/4 w-[500px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] -z-10" />
        
        {/* Market Stats Bar */}
        <div className="flex items-center justify-between mb-6 text-sm px-2">
          <div className="flex items-center space-x-8">
            <div className="text-gray-400">
              24h Volume: <span className="text-white font-medium">${filteredTickers?.reduce((acc, t) => acc + Number(t.volume), 0).toLocaleString()}</span>
            </div>
            <div className="text-gray-400">
              Markets: <span className="text-white font-medium">{filteredTickers?.length}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span>BTC Dominance:</span>
            <span className="text-white font-medium">48.2%</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col bg-[#1C1D21] shadow-xl rounded-xl border border-gray-800/50 backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`px-8 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-[#00b2ff] bg-gray-800/20"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/10"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative max-w-md mx-2">
              <input
                type="text"
                placeholder="Search markets"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2C2D33] text-white px-4 py-2.5 rounded-lg pl-10 focus:outline-none focus:ring-1 focus:ring-[#00b2ff] transition-all"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <MarketHeader />
              <tbody className="divide-y divide-gray-800">
                {filteredTickers?.map((m) => (
                  <MarketRow key={m.symbol} market={m} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function MarketHeader() {
  return (
    <thead className="bg-[#1C1D21]">
      <tr className="h-[48px]">
        <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[280px]">
          Name
        </th>
        <th scope="col" className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px]">
          Price
        </th>
        <th scope="col" className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px]">
          Market Cap
        </th>
        <th scope="col" className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px]">
          24h Volume
        </th>
        <th scope="col" className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[160px]">
          24h Change
        </th>
        <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[200px]">
          Last 7 Days
        </th>
      </tr>
    </thead>
  );
}

function MarketRow({ market }: { market: Ticker }) {
  const router = useRouter();
  const priceChange = Number(market.priceChangePercent);
  const volume = Number(market.volume);
  const lastPrice = Number(market.lastPrice);
  
  // Mock market cap calculation
  const mockMarketCap = (lastPrice * volume).toFixed(2);

  return (
    <tr
      className="hover:bg-[#2C2D33] transition-all cursor-pointer h-[72px]"
      onClick={() => router.push(`/trade/${market.symbol}`)}
    >
      <td className="px-8 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-[#2C2D33] flex items-center justify-center">
            <img
              src="/default-coin.png"
              alt={market.symbol}
              className="h-6 w-6"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{market.symbol.replace("USDT", "")}</p>
            <p className="text-xs text-gray-400">USDT</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap">
        <span className="text-sm text-white">${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap">
        <span className="text-sm text-gray-300">${mockMarketCap}M</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap">
        <span className="text-sm text-gray-300">${Number(market.volume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap">
        <span
          className={`text-sm font-medium ${
            priceChange > 0 ? "text-[#00F2A3]" : "text-[#FF5C5C]"
          }`}
        >
          {priceChange > 0 ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-8 py-4">
        <div className="w-[120px] h-[32px] bg-[#2C2D33] rounded opacity-50"></div>
      </td>
    </tr>
  );
}
