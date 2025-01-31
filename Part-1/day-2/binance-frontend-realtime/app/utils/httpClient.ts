import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "http://localhost:4000/api/v1";
const BASE_URL = "https://exchange-proxy.arjitchitkara.me/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

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
    const response = await axiosInstance.get('/tickers');
    console.log("Tickers received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickers:", error.response ? error.response.data : error.message);
    throw new Error("Failed to fetch tickers");
  }
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axiosInstance.get(`/depth?symbol=${market}`);
  return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axiosInstance.get(`/trades?symbol=${market}`);
  return response.data;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  const response = await axiosInstance.get(
    `/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
  );
  const data: KLine[] = response.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
