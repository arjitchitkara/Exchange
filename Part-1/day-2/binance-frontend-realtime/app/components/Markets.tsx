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
    
const getPercentageColor = (percentage: number) => {
  if (percentage === 0) return "text-white";
  return percentage > 0 ? "text-[#00C853]" : "text-[#FF1744]";
};

const MarketCategoryCard = React.memo(function MarketCategoryCard({ title, markets }: MarketCardProps) {
  const router = useRouter();
  
  const handleClick = useCallback((e: React.MouseEvent, symbol: string) => {
    e.preventDefault();
    router.push(`/trade/${symbol}`);
  }, [router]);

  return (
    <div className="bg-[#14151b] rounded-xl border border-gray-800/50 backdrop-blur-sm p-3">
      <h2 className="text-white text-sm font-medium mb-2">{title}</h2>
      <div className="space-y-2">
        {markets.slice(0, 5).map((market) => (
          <div 
            key={market.symbol} 
            className="flex items-center justify-between cursor-pointer hover:bg-[#1C1D21] p-2 rounded-lg transition-colors"
            onClick={(e) => handleClick(e, market.symbol)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-[#1C1D21] flex items-center justify-center">
                <CryptoIcon symbol={market.symbol} size="small" />
              </div>
              <span className="text-white text-sm">{market.symbol.replace("USDT", "")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`text-sm font-medium ${getPercentageColor(Number(market.priceChangePercent))}`}>
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

// Add the GenericCoinIcon component
const GenericCoinIcon = () => (
  <div className="h-6 w-6 rounded-full bg-[#2C2D33] flex items-center justify-center">
    <svg viewBox="0 0 32 32" className="h-4 w-4 text-gray-400">
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
      <path d="M16 4a6 6 0 00-6 6v4a6 6 0 0012 0v-4a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
    </svg>
  </div>
);

// Update the CryptoIcon component
const CryptoIcon = ({ symbol, size = 'default' }: { symbol: string, size?: 'small' | 'default' }) => {
  const [error, setError] = useState(false);
  const baseSymbol = symbol.split('_')[0];

  const dimensions = {
    small: { width: 24, height: 24 },
    default: { width: 40, height: 40 }
  };

  const { width, height } = dimensions[size];
  const containerClass = size === 'small' ? 'h-6 w-6' : 'h-12 w-12';

  // Special cases for SVG icons
  const svgSymbols = new Set(['SUI', 'DOGE', 'XRP', 'ENA', 'MELANIA', 'TRUMP', 'ZEX', 'W']);
  if (svgSymbols.has(baseSymbol)) {
    return (
      <div className={`relative ${containerClass} flex items-center justify-center`}>
        <div className="relative w-full h-full">
          <Image
            src={`/icons/${baseSymbol.toLowerCase()}.svg`}
            alt={`${symbol} icon`}
            fill
            sizes={size === 'small' ? '24px' : '40px'}
            className="rounded-full object-contain"
            onError={() => setError(true)}
            priority={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${containerClass}`}>
        <GenericCoinIcon />
      </div>
    );
  }

  return (
    <div className={`relative ${containerClass} flex items-center justify-center`}>
      <div className="relative w-full h-full">
        <Image
          src={`/icons/${baseSymbol}_USDC.png`}
          alt={`${symbol} icon`}
          fill
          sizes={size === 'small' ? '24px' : '40px'}
          className="rounded-full object-contain"
          onError={() => setError(true)}
          priority={true}
        />
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-[#14151b]">
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
          <div className="flex flex-col bg-[#14151b] shadow-xl rounded-xl border border-gray-800/50 backdrop-blur-sm">
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
};

const MarketRow = React.memo(function MarketRow({ market, index }: { market: Ticker; index: number }) {
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
      className="hover:bg-[#1C1D21] transition-all cursor-pointer h-[80px] focus-within:bg-[#1C1D21] focus-within:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="row"
      tabIndex={0}
      aria-rowindex={index + 1}
    >
      <td className="px-8 py-4 whitespace-nowrap" role="cell">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-[#1C1D21] flex items-center justify-center">
            <CryptoIcon symbol={market.symbol} />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{market.symbol.replace("USDT", "")}</p>
            <p className="text-sm text-gray-400">USDT</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-base font-medium text-white">${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-base font-medium text-gray-300">${mockMarketCap}M</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-base font-medium text-gray-300">${Number(market.volume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </td>
      <td className="px-8 py-4 text-right whitespace-nowrap" role="cell">
        <span
          className={`text-base font-semibold ${getPercentageColor(priceChange)}`}
        >
          {priceChange > 0 ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-8 py-4" role="cell">
        <SparklineChart 
          data={sparklineData} 
          color={priceChange === 0 ? COLORS.TEXT.PRIMARY : (priceChange > 0 ? COLORS.SUCCESS : COLORS.DANGER)}
        />
      </td>
    </tr>
  );
});

