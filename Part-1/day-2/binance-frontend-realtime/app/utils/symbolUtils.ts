// Common symbol mappings for icon fetching
const symbolMapping: { [key: string]: string } = {
  // Major cryptocurrencies
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'BONK': 'bonk',
  'JUP': 'jupiter',
  'MATIC': 'polygon',
  'DOT': 'polkadot',
  'ADA': 'cardano',
  'AVAX': 'avalanche',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'DOGE': 'dogecoin',
  'SHIB': 'shiba-inu',
  // Additional tokens
  'ATOM': 'cosmos',
  'XRP': 'ripple',
  'LTC': 'litecoin',
  'DAI': 'dai',
  'AAVE': 'aave',
  'ALGO': 'algorand',
  'APE': 'apecoin',
  'APT': 'aptos',
  'ARB': 'arbitrum',
  'BLUR': 'blur',
  'CFG': 'centrifuge',
  'COMP': 'compound',
  'CRV': 'curve-dao-token',
  'FTM': 'fantom',
  'GMT': 'stepn',
  'HBAR': 'hedera-hashgraph',
  'IMX': 'immutable-x',
  'INJ': 'injective-protocol',
  'LDO': 'lido-dao',
  'MANA': 'decentraland',
  'NEAR': 'near',
  'OP': 'optimism',
  'PEPE': 'pepe',
  'PYTH': 'pyth-network',
  'RUNE': 'thorchain',
  'SAND': 'the-sandbox',
  'SEI': 'sei-network',
  'SNX': 'synthetix-network-token',
  'SUI': 'sui',
  'TIA': 'celestia',
  'WLD': 'worldcoin-wld',
  'XLM': 'stellar',
  'ZRX': '0x'
};

export function getIconUrl(baseAsset: string): string[] {
  const normalizedSymbol = symbolMapping[baseAsset] || baseAsset.toLowerCase();
  
  return [
    // Primary URL - CoinGecko by ID (most reliable)
    `https://assets.coingecko.com/coins/images/1/${normalizedSymbol}/thumb.png`,
    // Fallback 1 - Alternative CoinGecko format
    `https://assets.coingecko.com/coins/images/1/${baseAsset.toLowerCase()}/thumb.png`,
    // Fallback 2 - Direct CoinGecko CDN
    `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/svg/color/${baseAsset.toLowerCase()}.svg`,
    // Final fallback - Base64 encoded generic crypto icon
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiM3MDcwNzAiLz48cGF0aCBkPSJNMTYgNGE2IDYgMCAwIDAtNiA2djRhNiA2IDAgMCAwIDEyIDB2LTRhNiA2IDAgMCAwLTYtNnptMCA4YTIgMiAwIDEgMSAyLTIgMiAyIDAgMCAxLTIgMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4='
  ];
}

// Helper function to get display format
export function getDisplaySymbol(symbol: string): string {
  const [base, quote] = symbol.split('_');
  return `${base}/${quote}`;
}

// These functions are no longer needed but kept for compatibility
export function normalizeSymbol(symbol: string): string {
  return symbol;
}

export function denormalizeSymbol(symbol: string): string {
  return symbol;
} 