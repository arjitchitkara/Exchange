"use client";

import { useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { getTickers } from "../utils/httpClient";
import { useRouter } from "next/navigation";

export const Markets = () => {
  const [tickers, setTickers] = useState<Ticker[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTickers()
      .then((m) => {
        setTickers(m);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load markets");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="text-center text-lg text-white">Loading markets...</div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col flex-1 max-w-[1280px] w-full p-6">
      <div className="flex flex-col bg-black shadow-md rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Markets</h2>
          </div>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="min-w-full divide-y divide-gray-700">
            <MarketHeader />
            <tbody className="divide-y divide-gray-800">
              {tickers?.map((m) => (
                <MarketRow key={m.symbol} market={m} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function MarketRow({ market }: { market: Ticker }) {
  const router = useRouter();
  return (
    <tr
      className="cursor-pointer hover:bg-gray-700 transition-all"
        onClick={() => router.push(`/trade/${market.symbol}`)}
      >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVvBqZC_Q1TSYObZaMvK0DRFeHZDUtVMh08Q&s"
            }
              alt={market.symbol}
            className="h-10 w-10 rounded-full border border-gray-500"
            />
          <div>
            <p className="text-sm font-medium text-white">{market.symbol}</p>
            <p className="text-xs text-gray-400">Pair</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-right text-sm text-white">
        {market.lastPrice}
      </td>
      <td className="px-6 py-4 text-right text-sm text-white">{market.high}</td>
      <td className="px-6 py-4 text-right text-sm text-white">
        {market.volume}
      </td>
      <td
        className={`px-6 py-4 text-right text-sm font-medium ${
          Number(market.priceChangePercent) > 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {Number(market.priceChangePercent).toFixed(2)}%
      </td>
    </tr>
  );
}

function MarketHeader() {
  return (
    <thead className="bg-gray-800">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
        >
          Name
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
        >
          Last Price
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
        >
          High Price
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
        >
          24h Volume
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
        >
          24h Change
        </th>
      </tr>
    </thead>
  );
}
