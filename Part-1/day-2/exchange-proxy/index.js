const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const app = express();

const targetUrl = "https://api.backpack.exchange"; // Target API server

// Cache storage
const cache = {
  Tickers1: null,
  Markets1: null,
  lastUpdate: null,
};

// ✅ FIXED: Handle CORS correctly (Allow localhost:3000 & production domain)
const allowedOrigins = [
  "http://localhost:3000",
  "https://exchange-proxy.arjitchitkara.me",
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

// New endpoints to serve cached data
app.get("/api/v1/Tickers1", (req, res) => {
  if (cache.Tickers1) {
    res.json(cache.Tickers1);
  } else {
    res.status(503).json({ error: "Cache not yet available" });
  }
});

app.get("/api/v1/Markets1", (req, res) => {
  if (cache.Markets1) {
    res.json(cache.Markets1);
  } else {
    res.status(503).json({ error: "Cache not yet available" });
  }
});

// Original proxy middleware for other routes
app.use(
  "/",
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Optionally modify request headers
    },
    onProxyRes: (proxyRes, req, res) => {
      // Optionally modify response headers
    },
  })
);

const port = 4000;
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
