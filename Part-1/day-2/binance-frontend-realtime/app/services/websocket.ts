import { normalizeSymbol, denormalizeSymbol } from '../utils/symbolUtils';

interface SymbolData {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  icon?: string;
}

// Removed WebSocket connection logic

// If needed, you can add other service logic here in the future

// Export an empty object or a placeholder if necessary
export const webSocketService = {}; 
