export interface Token {
  id: string;
  name: string;
  symbol: string;
  category: 'new' | 'finalStretch' | 'migrated';
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  holders: number;
  liquidity: number;
  progress: number;
  createdAt: number;
}

export interface SortConfig {
  key: keyof Token;
  direction: 'asc' | 'desc';
}