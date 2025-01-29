"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Ticker } from "../utils/types";
import { getTickers } from "../utils/httpClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparklines, SparklinesLine } from "react-sparklines";
import dynamic from 'next/dynamic';
import React from "react";
import { FiSearch } from 'react-icons/fi';
import { useSearch } from '../context/SearchContext';
import { useDebounce } from '../hooks/useDebounce';

const TABS = ["Spot", "Futures", "Lending"] as const;
type Tab = typeof TABS[number];

interface MarketCardProps {
  title: string;
  markets: Ticker[];
    }
    
const MarketCategoryCard = React.memo(function MarketCategoryCard({ title, markets }: MarketCardProps) {
  const router = useRouter();
  
  const handleClick = useCallback((e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    router.push(`/trade/${symbol}`);
  }, [router]);

  return (
    <div className="bg-[#1C1D21] rounded-xl border border-gray-800/50 backdrop-blur-sm p-3">
      <h2 className="text-white text-sm font-medium mb-2">{title}</h2>
      <div className="space-y-2">
        {markets.slice(0, 5).map((market) => (
          <div 
            key={market.symbol} 
            className="flex items-center justify-between cursor-pointer hover:bg-[#2C2D33] p-2 rounded-lg transition-colors"
            onClick={(e) => handleClick(e, market.symbol)}
            role="button"
            tabIndex={0}
    >
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-[#2C2D33] flex items-center justify-center">
                <img
                  src="/default-coin.png"
                  alt={`${market.symbol} icon`}
                  className="h-4 w-4"
                />
              </div>
              <span className="text-white text-sm">{market.symbol.replace("USDT", "")}</span>
            </div>
        <div className="flex items-center space-x-3">
              <span className="text-white text-sm">${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`text-sm font-medium ${Number(market.priceChangePercent) >= 0 ? "text-[" + COLORS.SUCCESS + "]" : "text-[" + COLORS.DANGER + "]"}`}>
                {Number(market.priceChangePercent) > 0 ? "+" : ""}
                {Number(market.priceChangePercent).toFixed(2)}%
              </span>
          </div>
          </div>
        ))}
        </div>
    </div>
  );
});

// Create a client-only version of Sparklines
const ClientOnlySparklines = dynamic(() => import('react-sparklines').then(mod => mod.Sparklines), {
  ssr: false
});

const ClientOnlySparklinesLine = dynamic(() => import('react-sparklines').then(mod => mod.SparklinesLine), {
  ssr: false
});

// Helper function to generate mock sparkline data
function generateSparklineData(min: number, max: number, points: number = 50): number[] {
    const data: number[] = [];
    let lastValue = (max + min) / 2;
    
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * ((max - min) / 5);
      lastValue = Math.max(min, Math.min(max, lastValue + change));
      data.push(lastValue);
    }
    return data;
}

const SparklineChart = React.memo(function SparklineChart({ data, color }: { data: number[], color: string }) {
  return (
    <div className="w-[120px] h-[32px]">
      <ClientOnlySparklines data={data} width={120} height={32}>
        <ClientOnlySparklinesLine color={color} style={{ strokeWidth: 1, fill: "none" }} />
      </ClientOnlySparklines>
    </div>
  );
});

// Constants for WCAG compliant colors
const COLORS = {
  SUCCESS: "#00C853", // Darker green for better contrast
  DANGER: "#FF1744",  // Brighter red for better contrast
  TEXT: {
    PRIMARY: "#FFFFFF",
    SECONDARY: "#B3B3B3"
  }
} as const;

type SortField = 'price' | 'marketCap' | 'volume' | 'change' | null;
type SortDirection = 'asc' | 'desc';

interface MarketHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

function MarketHeader({ sortField, sortDirection, onSort }: MarketHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <thead className="bg-[#1C1D21]">
      <tr className="h-[48px]" role="row">
        <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[280px]" role="columnheader">
          Name
        </th>
        <th 
          scope="col" 
          className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px] cursor-pointer hover:text-white group" 
          role="columnheader"
          onClick={() => onSort('price')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span>Price</span>
            <span className="opacity-50 group-hover:opacity-100">{getSortIcon('price')}</span>
          </div>
        </th>
        <th 
          scope="col" 
          className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px] cursor-pointer hover:text-white group" 
          role="columnheader"
          onClick={() => onSort('marketCap')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span>Market Cap</span>
            <span className="opacity-50 group-hover:opacity-100">{getSortIcon('marketCap')}</span>
          </div>
        </th>
        <th 
          scope="col" 
          className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[180px] cursor-pointer hover:text-white group" 
          role="columnheader"
          onClick={() => onSort('volume')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span>24h Volume</span>
            <span className="opacity-50 group-hover:opacity-100">{getSortIcon('volume')}</span>
          </div>
        </th>
        <th 
          scope="col" 
          className="px-8 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-[160px] cursor-pointer hover:text-white group" 
          role="columnheader"
          onClick={() => onSort('change')}
        >
          <div className="flex items-center justify-end space-x-1">
            <span>24h Change</span>
            <span className="opacity-50 group-hover:opacity-100">{getSortIcon('change')}</span>
          </div>
        </th>
        <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-[200px]" role="columnheader">
          Last 7 Days
        </th>
      </tr>
    </thead>
  );
}

export const Markets = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Spot");
  const { searchQuery, setSearchQuery } = useSearch();
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getTickers();
        setTickers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch markets:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      setSearchQuery("");
    };
  }, [setSearchQuery]);

  const handleSort = useCallback((field: SortField) => {
    setSortField(prev => {
      if (prev === field) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        return field;
      }
      setSortDirection('desc');
      return field;
    });
  }, []);

  // Memoize sort function
  const sortData = useCallback((data: Ticker[]) => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
        let aValue: number, bValue: number;
        
        switch (sortField) {
          case 'price':
            aValue = Number(a.lastPrice);
            bValue = Number(b.lastPrice);
            break;
          case 'marketCap':
            aValue = Number(a.lastPrice) * Number(a.volume);
            bValue = Number(b.lastPrice) * Number(b.volume);
            break;
          case 'volume':
            aValue = Number(a.volume);
            bValue = Number(b.volume);
            break;
          case 'change':
            aValue = Number(a.priceChangePercent);
            bValue = Number(b.priceChangePercent);
            break;
          default:
            return 0;
        }
        
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
  }, [sortField, sortDirection]);
    
  // Filter and sort tickers with debounced search
  const filteredAndSortedTickers = useMemo(() => {
    let filtered = !tickers.length ? [] :
      !debouncedSearchQuery ? tickers :
      tickers.filter(ticker => 
        ticker.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    
    return sortData(filtered);
  }, [tickers, debouncedSearchQuery, sortData]);

  // Memoize derived data
  const { topGainers, newMarkets, popular, totalVolume } = useMemo(() => {
    const sortedByChange = filteredAndSortedTickers
      .slice()
      .sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent));

    return {
      topGainers: sortedByChange.filter(t => Number(t.priceChangePercent) > 0) || [],
      newMarkets: filteredAndSortedTickers.slice(0, 5) || [],
      popular: filteredAndSortedTickers.slice(0, 5) || [],
      totalVolume: tickers.reduce((acc, t) => acc + Number(t.volume), 0)
    };
  }, [filteredAndSortedTickers, tickers]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16 bg-[#0D0E12]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00b2ff]"></div>
      </div>
    );
  }

  if (error) return (
    <div className="flex justify-center items-center min-h-screen pt-16 bg-[#0D0E12]">
      <div className="text-center text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">
        {error.message || 'Failed to load markets'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0E12]">
      <div className="pt-24 pb-8">
        <div className="relative mx-auto max-w-[1440px] w-full px-3">
          {/* Background Gradient Effects */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#00b2ff]/10 rounded-full blur-[128px] -z-10" />
          <div className="absolute top-32 right-1/4 w-[500px] h-[400px] bg-purple-500/10 rounded-full blur-[128px] -z-10" />
          
          {/* Market Stats Bar */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center space-x-8">
              <div className="text-gray-400">
                24h Volume: <span className="text-white font-medium">${totalVolume.toLocaleString()}</span>
              </div>
              <div className="text-gray-400">
                Markets: <span className="text-white font-medium">{tickers?.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <span>BTC Dominance:</span>
              <span className="text-white font-medium">48.2%</span>
            </div>
          </div>

          {/* Market Categories */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <MarketCategoryCard title="New" markets={newMarkets} />
            <MarketCategoryCard title="Top Gainers" markets={topGainers} />
            <MarketCategoryCard title="Popular" markets={popular} />
          </div>

          {/* Main Content */}
          <div className="flex flex-col bg-[#1C1D21] shadow-xl rounded-xl border border-gray-800/50 backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`px-8 py-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#00b2ff] focus:ring-opacity-50 ${
                    activeTab === tab
                      ? "text-white border-b-2 border-[#00b2ff] bg-gray-800/20"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/10"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={activeTab === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" role="grid">
                <MarketHeader 
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <tbody className="divide-y divide-gray-800">
                  {filteredAndSortedTickers.map((m, index) => (
                    <MarketRow key={m.symbol} market={m} index={index} />
                  ))}
                </tbody>
              </table>
              {filteredAndSortedTickers.length === 0 && searchQuery && (
                <div className="text-center py-8 text-gray-400">
                  No markets found matching "{searchQuery}"
                </div>
              )}
                </div>
          </div>
              </div>
            </div>
          </div>
  );
};const MarketRow = React.memo(function MarketRow({ market, index }: { market: Ticker; index: number }) {
  const router = useRouter();
  const priceChange = Number(market.priceChangePercent);
  const volume = Number(market.volume);
  const lastPrice = Number(market.lastPrice);
  
  const mockMarketCap = useMemo(() => 
    (lastPrice * volume).toFixed(2)
  , [lastPrice, volume]);

  const sparklineData = useMemo(() => 
    generateSparklineData(lastPrice * 0.95, lastPrice * 1.05, 50)
  , [lastPrice]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/trade/${market.symbol}`);
    }
  }, [router, market.symbol]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/trade/${market.symbol}`);
  }, [router, market.symbol]);

  return (
    <tr
      className="hover:bg-[#2C2D33] transition-all cursor-pointer h-[72px] focus-within:bg-[#2C2D33] focus-within:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="row"
      tabIndex={0}
      aria-rowindex={index + 1}
    >
      <td className="px-8 py-4 whitespace-nowrap" role="cell">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-[#2C2D33] flex items-center justify-center">
            <img
              src="/default-coin.png"
              alt={`${market.symbol} icon`}
              className="h-6 w-6"
            />
        </div>
          <div>
            <p className="text-sm font-medium text-white">{market.symbol.replace("USDT", "")}</p>
            <p className="text-xs text-gray-400">USDT</p>
      </div>
    </div>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm text-white">${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm text-gray-300">${mockMarketCap}M</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm text-gray-300">${Number(market.volume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span
          className={`text-sm font-medium ${
            priceChange > 0 ? "text-[" + COLORS.SUCCESS + "]" : "text-[" + COLORS.DANGER + "]"
          }`}
        >
          {priceChange > 0 ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-8 py-4" role="cell">
        <SparklineChart 
          data={sparklineData} 
          color={priceChange >= 0 ? COLORS.SUCCESS : COLORS.DANGER}
        />
      </td>
    </tr>
  );
});

