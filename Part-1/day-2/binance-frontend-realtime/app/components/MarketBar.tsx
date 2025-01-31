"use client";
import { useEffect, useState } from "react";
import type { Ticker } from "../utils/types";
import { getTicker } from "../utils/httpClient";
import { SignalingManager } from "../utils/SignalingManager";
import Image from "next/image";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    getTicker(market).then(setTicker);
    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) =>
        setTicker((prevTicker) => ({
          firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
          high: data?.high ?? prevTicker?.high ?? "",
          lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? "",
          low: data?.low ?? prevTicker?.low ?? "",
          priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent:
            data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
          quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: data?.symbol ?? prevTicker?.symbol ?? "",
          trades: data?.trades ?? prevTicker?.trades ?? "",
          volume: data?.volume ?? prevTicker?.volume ?? "",
        })),
      `TICKER-${market}`
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${market}`],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "ticker",
        `TICKER-${market}`
      );
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
    };
  }, [market]);
  //

  return (
    <div>
      <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full no-scrollbar overflow-auto px-3 sm:px-4 py-2 sm:py-0">
          <Ticker market={market} />
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 mt-2 sm:mt-0 pl-0 sm:pl-4">
            <div className="flex flex-col h-full justify-center">
              <p className={`font-medium tabular-nums text-greenText text-sm sm:text-md text-green-500`}>
                ${ticker?.lastPrice}
              </p>
              <p className="font-medium text-xs sm:text-sm tabular-nums">
                ${ticker?.lastPrice}
              </p>
            </div>
            <div className="flex flex-col">
              <p className={`font-medium text-xs text-slate-400 text-sm`}>
                24H Change
              </p>
              <p className={`text-xs sm:text-sm font-medium tabular-nums leading-5 text-greenText ${
                Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"
              }`}>
                {Number(ticker?.priceChange) > 0 ? "+" : ""}{" "}
                {ticker?.priceChange}{" "}
                {Number(ticker?.priceChangePercent)?.toFixed(2)}%
              </p>
            </div>
            <div className="hidden sm:flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H High
              </p>
              <p className="text-xs sm:text-sm font-medium tabular-nums leading-5">
                {ticker?.high}
              </p>
            </div>
            <div className="hidden sm:flex flex-col">
              <p className="font-medium text-xs text-slate-400 text-sm">
                24H Low
              </p>
              <p className="text-xs sm:text-sm font-medium tabular-nums leading-5">
                {ticker?.low}
              </p>
            </div>
            <button
              type="button"
              className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-sm sm:text-base text-left"
              data-rac=""
            >
              <div className="flex flex-col">
                <p className="font-medium text-xs text-slate-400 text-sm">
                  24H Volume
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium tabular-nums leading-5">
                  {ticker?.volume}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Ticker({ market }: { market: string }) {
  return (
    <div className="flex h-[48px] sm:h-[60px] shrink-0 space-x-2 sm:space-x-4">
      <div className="flex flex-row relative ml-0 sm:ml-2 -mr-2 sm:-mr-4">
        <div className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 mt-3 sm:mt-4">
          <div className="relative w-full h-full">
            <Image
              alt="SOL Logo"
              src="/sol.webp"
              fill
              sizes="(max-width: 640px) 20px, 24px"
              className="rounded-full object-contain outline-baseBackgroundL1"
              priority={true}
            />
          </div>
        </div>
        <div className="relative h-5 w-5 sm:h-6 sm:w-6 -ml-2 mt-3 sm:mt-4">
          <div className="relative w-full h-full">
            <Image
              alt="USDC Logo"
              src="/usdc.webp"
              fill
              sizes="(max-width: 640px) 20px, 24px"
              className="rounded-full object-contain"
              priority={true}
            />
          </div>
        </div>
      </div>
      <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-2 sm:p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-1 sm:gap-2">
            <div className="flex flex-row relative">
              <p className="font-medium text-xs sm:text-sm">
                {market.replace("_", " / ")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
