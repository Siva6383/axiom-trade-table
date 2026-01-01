'use client';

import { useState, useEffect } from 'react';
import type { Token } from '@/types/token';

const generateMockTokens = (): Token[] => {
  const tokens: Token[] = [];
  const categories: Token['category'][] = ['new', 'finalStretch', 'migrated'];
  const names = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'BOME', 'MEME'];
  
  for (let i = 0; i < 24; i++) {
    tokens.push({
      id: `token-${i}`,
      name: names[i % names.length],
      symbol: `${names[i % names.length]}${i}`,
      category: categories[i % 3],
      price: Math.random() * 10,
      priceChange24h: (Math.random() - 0.5) * 50,
      volume24h: Math.random() * 1000000,
      marketCap: Math.random() * 10000000,
      holders: Math.floor(Math.random() * 10000),
      liquidity: Math.random() * 500000,
      progress: Math.random() * 100,
      createdAt: Date.now() - Math.random() * 86400000 * 7,
    });
  }
  return tokens;
};

export const useMockWebSocket = (enabled = true) => {
  const [data, setData] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    setTimeout(() => {
      setData(generateMockTokens());
      setIsLoading(false);
    }, 1500);

    const interval = setInterval(() => {
      setData(prev => prev.map(token => ({
        ...token,
        price: token.price * (1 + (Math.random() - 0.5) * 0.02),
        priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 2,
        volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.1),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { data, isLoading, error };
};