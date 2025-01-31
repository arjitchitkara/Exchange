const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();

const targetUrl = "https://api.backpack.exchange"; // Target API server

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

// ✅ Proxy Requests to Target API
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
