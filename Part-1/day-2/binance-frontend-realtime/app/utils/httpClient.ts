import axios, { AxiosError, AxiosResponse } from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "http://localhost:4000/api/v1";
const BASE_URL = "https://exchange-proxy.arjitchitkara.me/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Enable credentials if cookies or other credentials are required
  withCredentials: true,
  timeout: 5000, // 5 second timeout
});

// Fallback data
const FALLBACK_DATA = {
  ticker: {
    symbol: "",
    firstPrice: "0",
    high: "0",
    lastPrice: "0",
    low: "0",
    priceChange: "0",
    priceChangePercent: "0",
    quoteVolume: "0",
    trades: "0",
    volume: "0"
  } as Ticker,
  depth: {
    lastUpdateId: "0",
    bids: [] as [string, string][],
    asks: [] as [string, string][]
  } as Depth,
  trade: [] as Trade[],
  kline: [] as KLine[]
};

// Type for error handler callback
type ErrorHandler<T> = (error: AxiosError | Error) => Promise<T>;

// Generic error handler with proper typing
async function handleRequestError<T>(
  error: unknown,
  endpoint: string,
  fallback: T,
  customHandler?: ErrorHandler<T>
): Promise<T> {
  if (axios.isAxiosError(error)) {
    console.error(
      `Error fetching ${endpoint}:`,
      error.response ? error.response.data : error.message
    );
    if (customHandler) {
      return customHandler(error);
    }
  } else {
    console.error(`Unknown error fetching ${endpoint}:`, error);
  }
  return fallback;
}

export async function getTicker(market: string): Promise<Ticker> {
  try {
    const tickers = await getTickers();
    const ticker = tickers.find((t) => t.symbol === market);
    if (!ticker) {
      console.warn(`No ticker found for ${market}, using fallback data`);
      return { ...FALLBACK_DATA.ticker, symbol: market };
    }
    return ticker;
  } catch (error) {
    console.warn(`Error in getTicker for ${market}, using fallback data`);
    return { ...FALLBACK_DATA.ticker, symbol: market };
  }
}

export async function getTickers(): Promise<Ticker[]> {
  try {
    console.log("Fetching tickers from:", `${BASE_URL}/Tickers1`);
    const response = await axiosInstance.get<Ticker[]>("/Tickers1");
    console.log("Tickers received:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.warn("Failed to fetch from /Tickers1, trying fallback endpoint");
    try {
      const response = await axiosInstance.get<Ticker[]>("/tickers");
      return response.data;
    } catch (fallbackError) {
      console.warn("Both endpoints failed, returning empty array");
      return [];
    }
  }
}

export async function getMarkets(): Promise<any[]> {
  try {
    console.log("Fetching markets from:", `${BASE_URL}/Markets1`);
    const response = await axiosInstance.get<any[]>("/Markets1");
    return response.data;
  } catch (error: unknown) {
    console.warn("Failed to fetch from /Markets1, trying fallback endpoint");
    try {
      const response = await axiosInstance.get<any[]>("/markets");
      return response.data;
    } catch (fallbackError) {
      console.warn("Both endpoints failed, returning empty array");
      return [];
    }
  }
}

export async function getDepth(market: string): Promise<Depth> {
  try {
    // Try cached endpoint first
    console.log(`🔍 Fetching depth from /Depth1 for ${market}`);
    const response = await axiosInstance.get<Depth>(`/Depth1`, {
      params: { symbol: market }
    });
    console.log(`✅ Successfully got depth data from /Depth1 for ${market}`);
    return response.data;
  } catch (error: unknown) {
    console.warn(`⚠️ Failed to fetch from /Depth1, trying fallback endpoint for ${market}`);
    try {
      console.log(`🔄 Trying fallback depth endpoint for ${market}`);
      const response = await axiosInstance.get<Depth>(`/depth`, {
        params: { symbol: market }
      });
      console.log(`✅ Successfully got depth data from fallback for ${market}`);
      return response.data;
    } catch (fallbackError) {
      console.warn(`❌ Both endpoints failed for ${market}, using fallback data`);
      return { ...FALLBACK_DATA.depth };
    }
  }
}

export async function getTrades(market: string): Promise<Trade[]> {
  try {
    // Try cached endpoint first
    console.log(`🔍 Fetching trades from /Trades1 for ${market}`);
    const response = await axiosInstance.get<Trade[]>(`/Trades1`, {
      params: { symbol: market }
    });
    console.log(`✅ Successfully got trades data from /Trades1 for ${market}`);
    return response.data;
  } catch (error: unknown) {
    console.warn(`⚠️ Failed to fetch from /Trades1, trying fallback endpoint for ${market}`);
    try {
      console.log(`🔄 Trying fallback trades endpoint for ${market}`);
      const response = await axiosInstance.get<Trade[]>(`/trades`, {
        params: { symbol: market }
      });
      console.log(`✅ Successfully got trades data from fallback for ${market}`);
      return response.data;
    } catch (fallbackError) {
      console.warn(`❌ Both endpoints failed for ${market}, using fallback data`);
      return [...FALLBACK_DATA.trade];
    }
  }
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  try {
    // Try cached endpoint first
    console.log(`🔍 Fetching klines from /Klines1 for ${market} (${interval})`);
    const response = await axiosInstance.get<KLine[]>(`/Klines1`, {
      params: {
        symbol: market,
        interval,
        startTime,
        endTime,
      },
    });
    console.log(`✅ Successfully got klines data from /Klines1 for ${market}`);
    return response.data;
  } catch (error: unknown) {
    console.warn(`⚠️ Failed to fetch from /Klines1, trying fallback endpoint for ${market}`);
    try {
      console.log(`🔄 Trying fallback klines endpoint for ${market}`);
      const response = await axiosInstance.get<KLine[]>(`/klines`, {
        params: {
          symbol: market,
          interval,
          startTime,
          endTime,
        },
      });
      console.log(`✅ Successfully got klines data from fallback for ${market}`);
      return response.data;
    } catch (fallbackError) {
      console.warn(`❌ Both endpoints failed for ${market}, using fallback data`);
      return [...FALLBACK_DATA.kline];
    }
  }
}
