'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SymbolData {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  icon?: string;
}

interface SymbolContextType {
  symbols: Map<string, SymbolData>;
  isLoading: boolean;
}

const SymbolContext = createContext<SymbolContextType>({
  symbols: new Map(),
  isLoading: true,
});

export function useSymbols() {
  return useContext(SymbolContext);
}

export function SymbolProvider({ children }: { children: React.ReactNode }) {
  const [symbols, setSymbols] = useState<Map<string, SymbolData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSymbols() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false');
        const data = await response.json();
        
        const symbolsMap = new Map<string, SymbolData>();
        data.forEach((coin: any) => {
          symbolsMap.set(coin.symbol.toUpperCase(), {
            symbol: coin.symbol.toUpperCase(),
            baseAsset: coin.symbol.toUpperCase(),
            quoteAsset: 'USD',
            icon: coin.image
          });
        });

        setSymbols(symbolsMap);
      } catch (error) {
        console.error('Error fetching symbols:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSymbols();
  }, []);

  return (
    <SymbolContext.Provider value={{ symbols, isLoading }}>
      {children}
    </SymbolContext.Provider>
  );
} 
