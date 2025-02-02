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
    const response = await axiosInstance.get<Depth>(`/depth?symbol=${market}`);
    return response.data;
  } catch (error: unknown) {
    console.warn(`Failed to fetch depth for ${market}, using fallback data`);
    return { ...FALLBACK_DATA.depth };
  }
}

export async function getTrades(market: string): Promise<Trade[]> {
  try {
    const response = await axiosInstance.get<Trade[]>(`/trades?symbol=${market}`);
    return response.data;
  } catch (error: unknown) {
    console.warn(`Failed to fetch trades for ${market}, using fallback data`);
    return [...FALLBACK_DATA.trade];
  }
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  try {
    const response = await axiosInstance.get<KLine[]>(`/klines`, {
      params: {
        symbol: market,
        interval,
        startTime,
        endTime,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.warn(`Failed to fetch klines for ${market}, using fallback data`);
    return [...FALLBACK_DATA.kline];
  }
}
