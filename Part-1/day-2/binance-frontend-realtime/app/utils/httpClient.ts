import axios, { AxiosError, AxiosResponse } from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "http://localhost:4000/api/v1";
const BASE_URL = "https://exchange-proxy.arjitchitkara.me/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

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
  const tickers = await getTickers();
  const ticker = tickers.find((t) => t.symbol === market);
  if (!ticker) {
    throw new Error(`No ticker found for ${market}`);
  }
  return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
  try {
    console.log("Fetching tickers from:", `${BASE_URL}/tickers`);
    const response = await axiosInstance.get<Ticker[]>('/tickers');
    console.log("Tickers received:", response.data);
    return response.data;
  } catch (error: unknown) {
    await handleRequestError<Ticker[]>(error, 'tickers', [], async (err) => {
      throw new Error("Failed to fetch tickers");
    });
    throw new Error("Failed to fetch tickers");
  }
}

export async function getDepth(market: string): Promise<Depth> {
  try {
    const response = await axiosInstance.get<Depth>(`/depth?symbol=${market}`);
    return response.data;
  } catch (error: unknown) {
    await handleRequestError<Depth>(error, `depth for ${market}`, {} as Depth, async (err) => {
      throw new Error(`Failed to fetch depth for ${market}`);
    });
    throw new Error(`Failed to fetch depth for ${market}`);
  }
}

export async function getTrades(market: string): Promise<Trade[]> {
  try {
    const response = await axiosInstance.get<Trade[]>(`/trades?symbol=${market}`);
    return response.data;
  } catch (error: unknown) {
    await handleRequestError<Trade[]>(error, `trades for ${market}`, [], async (err) => {
      throw new Error(`Failed to fetch trades for ${market}`);
    });
    throw new Error(`Failed to fetch trades for ${market}`);
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
    await handleRequestError<KLine[]>(error, `klines for ${market}`, [], async (err) => {
      throw new Error(`Failed to fetch klines for ${market}`);
    });
    throw new Error(`Failed to fetch klines for ${market}`);
  }
}
