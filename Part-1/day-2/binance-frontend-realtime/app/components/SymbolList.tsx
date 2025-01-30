'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

// Mapping of Backpack symbols to CoinGecko IDs
const backpackToCoinGecko: { [key: string]: string } = {
  // Major cryptocurrencies
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'BONK': 'bonk',
  'JUP': 'jupiter',
  'MATIC': 'matic-network',
  'DOT': 'polkadot',
  'ADA': 'cardano',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  // DeFi tokens
  'AAVE': 'aave',
  'CRV': 'curve-dao-token',
  'LDO': 'lido-dao',
  'SNX': 'havven',
  'SUSHI': 'sushi',
  'YFI': 'yearn-finance',
  'MKR': 'maker',
  'COMP': 'compound-governance-token',
  // Layer 1s & Layer 2s
  'ATOM': 'cosmos',
  'NEAR': 'near',
  'FTM': 'fantom',
  'APT': 'aptos',
  'SUI': 'sui',
  'ARB': 'arbitrum',
  'OP': 'optimism',
  'RNDR': 'render-token',
  // Gaming & Metaverse
  'SAND': 'the-sandbox',
  'MANA': 'decentraland',
  'AXS': 'axie-infinity',
  'IMX': 'immutable-x',
  'GALA': 'gala',
  // Other Popular Tokens
  'BLUR': 'blur',
  'INJ': 'injective-protocol',
  'TIA': 'celestia',
  'SEI': 'sei-network',
  'PYTH': 'pyth-network',
  'WLD': 'worldcoin-wld',
  'STRK': 'starknet',
  'DYM': 'dymension',
  'JTO': 'jito-governance',
  'MEME': 'memecoin',
  'ZETA': 'zeta',
  'HNT': 'helium',
  'RAY': 'raydium',
  'MOBILE': 'helium-mobile',
  'IOT': 'helium-iot',
  'WIF': 'wif',
  'BOME': 'book-of-meme',
  'AIDOGE': 'arbitrum-doge',
  'TOSHI': 'toshi',
  'MYRO': 'myro',
  'SLERF': 'slerf',
  'ANALOS': 'analos',
  'WEN': 'wen-3',
  'SAMO': 'samoyedcoin',
  'GUANO': 'guano',
  'MNGO': 'mango-markets',
  'ORCA': 'orca',
  'MSOL': 'msol',
  'JITOSOL': 'jito-staked-sol',
  'BSOL': 'basis-markets',
  'USDR': 'real-usd'
};

// Generic coin SVG for fallback
const GenericCoinSvg = () => (
  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
    <svg viewBox="0 0 32 32" className="w-8 h-8 text-gray-400">
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
      <path d="M16 4a6 6 0 00-6 6v4a6 6 0 0012 0v-4a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
    </svg>
  </div>
);

export function SymbolList() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchCoins() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
        const data = await response.json();
        
        // Filter coins that are on Backpack Exchange
        const filteredCoins = data.filter((coin: any) => 
          Object.values(backpackToCoinGecko).includes(coin.id)
        );

        setCoins(filteredCoins);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCoins();
  }, []);

  const handleImageError = (coinId: string) => {
    setImageErrors(prev => new Set([...prev, coinId]));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00b2ff]"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="bg-[#1E1F25] rounded-lg p-4 hover:bg-[#2C2D33] transition-colors flex flex-col items-center"
        >
          <div className="relative w-12 h-12 mb-2">
            {imageErrors.has(coin.id) ? (
              <GenericCoinSvg />
            ) : (
              <Image
                src={coin.image}
                alt={coin.name}
                width={48}
                height={48}
                className="rounded-full"
                priority={true}
                onError={() => handleImageError(coin.id)}
              />
            )}
          </div>
          <h3 className="text-white font-semibold text-center">
            {coin.symbol.toUpperCase()}
          </h3>
          <p className="text-gray-400 text-xs text-center mt-1">
            {coin.name}
          </p>
        </div>
      ))}
    </div>
  );
} 


