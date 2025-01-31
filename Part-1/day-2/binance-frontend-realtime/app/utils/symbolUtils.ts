// Common symbol mappings for icon fetching
const symbolMapping: { [key: string]: string } = {
  'AAVE': 'AAVE',
  'ACT': 'ACT',
  'ANIME': 'ANIME',
  'BOME': 'BOME',
  'BONK': 'BONK',
  'BTC': 'BTC',
  'CLOUD': 'CLOUD',
  'DOGE': 'DOGE',
  'DRIFT': 'DRIFT',
  'ENA': 'ENA',
  'ETH': 'ETH',
  'GOAT': 'GOAT',
  'HNT': 'HNT',
  'HONEY': 'HONEY',
  'IO': 'IO',
  'JTO': 'JTO',
  'JUP': 'JUP',
  'J': 'J',
  'KMNO': 'KMNO',
  'LDO': 'LDO',
  'LINK': 'LINK',
  'MELANIA': 'MELANIA',
  'MEW': 'MEW',
  'ME': 'ME',
  'MOBILE': 'MOBILE',
  'MOODENG': 'MOODENG',
  'MOTHER': 'MOTHER',
  'ONDO': 'ONDO',
  'PENGU': 'PENGU',
  'PEPE': 'PEPE',
  'POL': 'POL',
  'PRCL': 'PRCL',
  'PYTH': 'PYTH',
  'RAY': 'RAY',
  'RENDER': 'RENDER',
  'SHFL': 'SHFL',
  'SHIB': 'SHIB',
  'SOL': 'SOL',
  'SONIC': 'SONIC',
  'STRK': 'STRK',
  'SUI': 'SUI',
  'TNSR': 'TNSR',
  'TRUMP': 'TRUMP',
  'UNI': 'UNI',
  'USDT': 'USDT',
  'WEN': 'WEN',
  'WIF': 'WIF',
  'WLD': 'WLD',
  'W': 'W',
  'XRP': 'XRP',
  'ZEX': 'ZEX',
  'ZRO': 'ZRO'
};

// List of symbols that should use SVG instead of PNG
const svgSymbols = new Set([
  'SUI',
  'DOGE',
  'XRP',
  'ENA',
  'MELANIA',
  'TRUMP',
  'ZEX',
  'W'
]);

export function getIconUrl(symbol: string): string {
  // Extract base symbol (remove _USDC or _USDC_PERP)
  const baseSymbol = symbol.split('_')[0];
  
  // Use SVG for specific symbols, PNG for others
  const extension = svgSymbols.has(baseSymbol) ? 'svg' : 'png';
  
  // For SVG files, use lowercase filename without _USDC
  if (extension === 'svg') {
    return `/icons/${baseSymbol.toLowerCase()}.svg`;
  }
  
  // For PNG files, use the original format
  return `/icons/${baseSymbol}_USDC.png`;
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