import { useWindowSize } from '../hooks/useWindowSize';
import { useRouter } from 'next/router';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { generateSparklineData } from '../utils/generateSparklineData';
import { getPercentageColor } from '../utils/getPercentageColor';
import { COLORS } from '../constants/colors';
import { MarketFlow } from './MarketFlow';
import { useWindowDimensions } from '../hooks/useWindowDimensions';

const MarketRow = React.memo(function MarketRow({ market, index }: { market: Ticker; index: number }) {
  const router = useRouter();
  const { width } = useWindowSize();
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
      className="hover:bg-[#1C1D21] transition-all cursor-pointer h-[60px] sm:h-[80px] focus-within:bg-[#1C1D21] focus-within:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      role="row"
      tabIndex={0}
      aria-rowindex={index + 1}
    >
      <td className="px-2 sm:px-4 lg:px-8 py-2 sm:py-4 whitespace-nowrap" role="cell">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="h-8 w-8 sm:h-10 lg:h-12 sm:w-10 lg:w-12 rounded-full bg-[#1C1D21] flex items-center justify-center">
            <CryptoIcon symbol={market.symbol} size={width < 640 ? 'small' : 'default'} />
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-white">{market.symbol.replace("USDT", "")}</p>
            <p className="text-xs sm:text-sm text-gray-400">USDT</p>
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-4 lg:px-8 py-2 sm:py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm sm:text-base font-medium text-white">
          ${Number(market.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </td>
      <td className="hidden sm:table-cell px-4 lg:px-8 py-2 sm:py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm sm:text-base font-medium text-gray-300">${mockMarketCap}M</span>
      </td>
      <td className="hidden sm:table-cell px-4 lg:px-8 py-2 sm:py-4 text-right whitespace-nowrap" role="cell">
        <span className="text-sm sm:text-base font-medium text-gray-300">
          ${Number(market.volume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </td>
      <td className="px-2 sm:px-4 lg:px-8 py-2 sm:py-4 text-right whitespace-nowrap" role="cell">
        <span className={`text-sm sm:text-base font-semibold ${getPercentageColor(priceChange)}`}>
          {priceChange > 0 ? "+" : ""}
          {priceChange.toFixed(2)}%
        </span>
      </td>
      <td className="hidden lg:table-cell px-4 lg:px-8 py-2 sm:py-4" role="cell">
        <SparklineChart 
          data={sparklineData} 
          color={priceChange === 0 ? COLORS.TEXT.PRIMARY : (priceChange > 0 ? COLORS.SUCCESS : COLORS.DANGER)}
        />
      </td>
    </tr>
  );
});

export const Markets = () => {
  const { isMobile } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'table' | 'flow'>('table');
  const [tickers, setTickers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Your existing data fetching logic
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00b2ff]"></div>
        </div>
      );
    }

    return activeTab === 'table' ? (
      <div className="w-full overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[800px]" role="grid">
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
    ) : (
      <MarketFlow markets={tickers} />
    );
  }, [activeTab, tickers, isLoading]);

  return (
    <div className="min-h-screen bg-[#14151b]">
      <div className="pt-16 sm:pt-24 pb-8">
        <div className="relative mx-auto max-w-[1440px] w-full px-3">
          {/* Background Gradient Effects */}
          <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[250px] sm:h-[500px] bg-[#00b2ff]/10 rounded-full blur-[128px] -z-10" />
          <div className="absolute top-32 right-1/4 w-[250px] sm:w-[500px] h-[200px] sm:h-[400px] bg-purple-500/10 rounded-full blur-[128px] -z-10" />
          
          {/* Market Stats Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 mb-4 sm:mb-0">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <MarketCategoryCard title="New" markets={newMarkets} />
            <MarketCategoryCard title="Top Gainers" markets={topGainers} />
            <MarketCategoryCard title="Popular" markets={popular} />
          </div>

          {/* View toggle */}
          <div className="flex justify-end mb-6">
            <div className="inline-flex rounded-lg border border-gray-800 p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'table'
                    ? 'bg-[#2C2D33] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('table')}
              >
                Table View
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'flow'
                    ? 'bg-[#2C2D33] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('flow')}
              >
                Flow View
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col bg-[#14151b] shadow-xl rounded-xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}; 