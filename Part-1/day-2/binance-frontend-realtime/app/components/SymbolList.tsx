'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getIconUrl } from '../utils/symbolUtils';

interface MarketSymbol {
  pair: string;
  baseSymbol: string;
  quoteSymbol: string;
  isPerpetual: boolean;
}

const MARKET_SYMBOLS = [
  "AAVE_USDC", "ACT_USDC", "ANIME_USDC", "BOME_USDC", "BONK_USDC", "BTC_USDC", 
  "BTC_USDC_PERP", "CLOUD_USDC", "DOGE_USDC_PERP", "DRIFT_USDC", "ENA_USDC", 
  "ETH_USDC", "ETH_USDC_PERP", "GOAT_USDC", "HNT_USDC", "HONEY_USDC", "IO_USDC", 
  "JTO_USDC", "JUP_USDC", "J_USDC", "KMNO_USDC", "LDO_USDC", "LINK_USDC", 
  "MELANIA_USDC", "MEW_USDC", "ME_USDC", "MOBILE_USDC", "MOODENG_USDC", 
  "MOTHER_USDC", "ONDO_USDC", "PENGU_USDC", "PEPE_USDC", "POL_USDC", "PRCL_USDC", 
  "PYTH_USDC", "RAY_USDC", "RENDER_USDC", "SHFL_USDC", "SHIB_USDC", "SOL_USDC", 
  "SOL_USDC_PERP", "SONIC_USDC", "STRK_USDC", "SUI_USDC_PERP", "TNSR_USDC", 
  "TRUMP_USDC", "UNI_USDC", "USDT_USDC", "WEN_USDC", "WIF_USDC", "WLD_USDC", 
  "W_USDC", "XRP_USDC_PERP", "ZEX_USDC", "ZRO_USDC"
];

// Generic coin SVG for fallback
const GenericCoinIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
    <svg viewBox="0 0 32 32" className="w-6 h-6 text-gray-400">
      <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.2"/>
      <path d="M16 4a6 6 0 00-6 6v4a6 6 0 0012 0v-4a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
    </svg>
  </div>
);

function parseMarketSymbol(symbol: string): MarketSymbol {
  const parts = symbol.split('_');
  const isPerpetual = parts.includes('PERP');
  
  return {
    pair: symbol,
    baseSymbol: parts[0],
    quoteSymbol: 'USDC',
    isPerpetual
  };
}

const CryptoIcon = ({ symbol }: { symbol: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getIconUrl(symbol);
  const isSvg = iconUrl.endsWith('.svg');

  if (error) {
    return <GenericCoinIcon />;
  }

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="relative w-full h-full">
        <Image
          src={iconUrl}
          alt={`${symbol} icon`}
          fill
          sizes="32px"
          className="rounded-full object-contain"
          onError={() => setError(true)}
          priority={true}
          loading="eager"
        />
      </div>
    </div>
  );
};

export function SymbolList() {
  const marketSymbols = MARKET_SYMBOLS.map(parseMarketSymbol);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {marketSymbols.map((market) => (
        <div
          key={market.pair}
          className="bg-[#1E1F25] rounded-lg p-4 hover:bg-[#2C2D33] transition-colors cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <CryptoIcon symbol={market.pair} />
            </div>
            <div>
              <h3 className="text-white font-medium">
                {market.baseSymbol}/{market.quoteSymbol}
              </h3>
              {market.isPerpetual && (
                <span className="text-[#00b2ff] text-xs font-medium">
                  PERP
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 


