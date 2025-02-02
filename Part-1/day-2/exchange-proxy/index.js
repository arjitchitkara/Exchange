const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const NodeCache = require("node-cache");
const app = express();

const targetUrl = "https://api.backpack.exchange"; // Target API server

// Initialize cache with 2 second TTL
const cache = {
  Tickers1: null,
  Markets1: null,
  lastUpdate: null,
};

// Initialize node-cache for depth, trades, and klines
// stdTTL: time to live in seconds for every generated cache element
const depthCache = new NodeCache({ stdTTL: 2 }); // 2 seconds TTL
const tradesCache = new NodeCache({ stdTTL: 2 });
const klinesCache = new NodeCache({ stdTTL: 2 });

// ✅ FIXED: Handle CORS correctly (Allow localhost:3000 & production domain)
const allowedOrigins = [
  "http://localhost:3000",
  "https://exchange-proxy.arjitchitkara.me",
  "https://exchange-ten-flame.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle CORS Preflight (OPTIONS request)
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

// Function to fetch data from Backpack API
async function fetchBackpackData() {
  try {
    const [tickersResponse, marketsResponse] = await Promise.all([
      axios.get(`${targetUrl}/api/v1/tickers`),
      axios.get(`${targetUrl}/api/v1/markets`),
    ]);

    cache.Tickers1 = tickersResponse.data;
    cache.Markets1 = marketsResponse.data;
    cache.lastUpdate = new Date();

    console.log("Cache updated at:", cache.lastUpdate);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

// Initialize cache and start periodic updates
fetchBackpackData();
setInterval(fetchBackpackData, 2000); // Update every 2 seconds

// Helper function to get cached data or fetch from API
async function getCachedOrFetch(cacheKey, cache, fetchFn) {
  console.log(`🔍 Checking cache for key: ${cacheKey}`);
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`✅ Cache hit for ${cacheKey}`);
    return cachedData;
  }

  console.log(`❌ Cache miss for ${cacheKey}, fetching from API...`);
  try {
    const data = await fetchFn();
    cache.set(cacheKey, data);
    console.log(`💾 Cached new data for ${cacheKey}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching data for ${cacheKey}:`, error.message);
    throw error;
  }
}

// New endpoints to serve cached data
app.get("/api/v1/Tickers1", (req, res) => {
  console.log("📊 Request for /Tickers1");
  if (cache.Tickers1) {
    console.log("✅ Returning cached tickers data");
    res.json(cache.Tickers1);
  } else {
    console.log("❌ Tickers cache not available");
    res.status(503).json({ error: "Cache not yet available" });
  }
});

app.get("/api/v1/Markets1", (req, res) => {
  console.log("🏪 Request for /Markets1");
  if (cache.Markets1) {
    console.log("✅ Returning cached markets data");
    res.json(cache.Markets1);
  } else {
    console.log("❌ Markets cache not available");
    res.status(503).json({ error: "Cache not yet available" });
  }
});

// Cached depth endpoint
app.get("/api/v1/Depth1", async (req, res) => {
  const symbol = req.query.symbol;
  console.log(`📈 Request for /Depth1 with symbol: ${symbol}`);
  if (!symbol) {
    console.log("❌ Missing symbol parameter");
    return res.status(400).json({ error: "Symbol parameter is required" });
  }

  try {
    const data = await getCachedOrFetch(
      `depth:${symbol}`,
      depthCache,
      async () => {
        console.log(`🔄 Fetching fresh depth data for ${symbol}`);
        const response = await axios.get(`${targetUrl}/api/v1/depth`, {
          params: { symbol },
        });
        return response.data;
      }
    );
    console.log(`✅ Successfully returned depth data for ${symbol}`);
    res.json(data);
  } catch (error) {
    console.error(
      `❌ Failed to fetch depth data for ${symbol}:`,
      error.message
    );
    res.status(503).json({ error: "Failed to fetch depth data" });
  }
});

// Keep the original endpoint for fallback
app.get("/api/v1/depth", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol parameter is required" });
  }

  try {
    const response = await axios.get(`${targetUrl}/api/v1/depth`, {
      params: { symbol },
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch depth data" });
  }
});

// Cached trades endpoint
app.get("/api/v1/Trades1", async (req, res) => {
  const symbol = req.query.symbol;
  console.log(`💱 Request for /Trades1 with symbol: ${symbol}`);
  if (!symbol) {
    console.log("❌ Missing symbol parameter");
    return res.status(400).json({ error: "Symbol parameter is required" });
  }

  try {
    const data = await getCachedOrFetch(
      `trades:${symbol}`,
      tradesCache,
      async () => {
        console.log(`🔄 Fetching fresh trades data for ${symbol}`);
        const response = await axios.get(`${targetUrl}/api/v1/trades`, {
          params: { symbol },
        });
        return response.data;
      }
    );
    console.log(`✅ Successfully returned trades data for ${symbol}`);
    res.json(data);
  } catch (error) {
    console.error(
      `❌ Failed to fetch trades data for ${symbol}:`,
      error.message
    );
    res.status(503).json({ error: "Failed to fetch trades data" });
  }
});

// Keep the original endpoint for fallback
app.get("/api/v1/trades", async (req, res) => {
  const symbol = req.query.symbol;
  if (!symbol) {
    return res.status(400).json({ error: "Symbol parameter is required" });
  }

  try {
    const response = await axios.get(`${targetUrl}/api/v1/trades`, {
      params: { symbol },
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch trades data" });
  }
});

// Cached klines endpoint
app.get("/api/v1/Klines1", async (req, res) => {
  const { symbol, interval, startTime, endTime } = req.query;
  console.log(
    `📊 Request for /Klines1 with symbol: ${symbol}, interval: ${interval}`
  );
  if (!symbol || !interval) {
    console.log("❌ Missing required parameters");
    return res
      .status(400)
      .json({ error: "Symbol and interval parameters are required" });
  }

  const cacheKey = `klines:${symbol}:${interval}:${startTime}:${endTime}`;
  try {
    const data = await getCachedOrFetch(cacheKey, klinesCache, async () => {
      console.log(`🔄 Fetching fresh klines data for ${symbol}`);
      const response = await axios.get(`${targetUrl}/api/v1/klines`, {
        params: { symbol, interval, startTime, endTime },
      });
      return response.data;
    });
    console.log(`✅ Successfully returned klines data for ${symbol}`);
    res.json(data);
  } catch (error) {
    console.error(
      `❌ Failed to fetch klines data for ${symbol}:`,
      error.message
    );
    res.status(503).json({ error: "Failed to fetch klines data" });
  }
});

// Keep the original endpoint for fallback
app.get("/api/v1/klines", async (req, res) => {
  const { symbol, interval, startTime, endTime } = req.query;
  if (!symbol || !interval) {
    return res
      .status(400)
      .json({ error: "Symbol and interval parameters are required" });
  }

  try {
    const response = await axios.get(`${targetUrl}/api/v1/klines`, {
      params: { symbol, interval, startTime, endTime },
    });
    res.json(response.data);
  } catch (error) {
    res.status(503).json({ error: "Failed to fetch klines data" });
  }
});

// Remove the original proxy middleware since we're handling all routes explicitly
// This prevents duplicate route handling

const port = 4000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
