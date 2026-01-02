'use client';

import { useState, useEffect } from 'react';
import type { Token } from '@/types/token';

const generateMockTokens = (): Token[] => {
  const tokens: Token[] = [];
  const categories: Token['category'][] = ['new', 'finalStretch', 'migrated'];
  const names = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'BOME', 'MEME', 'WOJAK', 'PEPE2'];
  const baseColors = [
    'from-blue-400 to-purple-500',
    'from-green-400 to-teal-500',
    'from-pink-400 to-rose-500',
    'from-orange-400 to-red-500',
    'from-indigo-400 to-blue-500'
  ];
  
  for (let i = 0; i < 30; i++) {
    const category = categories[i % 3];
    tokens.push({
      id: `token-${i}`,
      name: names[i % names.length],
      symbol: `${names[i % names.length]}${i}`,
      category,
      price: Math.random() * 10,
      priceChange24h: (Math.random() - 0.5) * 50,
      volume24h: Math.random() * 1000000,
      marketCap: Math.random() * 10000000,
      holders: Math.floor(Math.random() * 10000),
      liquidity: Math.random() * 500000,
      progress: category === 'finalStretch' ? 60 + Math.random() * 35 : Math.random() * 100,
      createdAt: Date.now() - Math.random() * 86400000 * 7,
      txCount: Math.floor(Math.random() * 5000),
      colorGradient: baseColors[i % baseColors.length],
      isHot: Math.random() > 0.7,
      isNew: category === 'new' && Math.random() > 0.5,
      verified: Math.random() > 0.3,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      lastUpdate: Date.now()
    });
  }
  return tokens;
};

export const useMockWebSocket = (enabled = true) => {
  const [data, setData] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<Error | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    if (!enabled) return;

    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('connected');
      setData(generateMockTokens());
      setIsLoading(false);
    }, 2000);

    const interval = setInterval(() => {
      setData(prev => prev.map(token => {
        const priceChange = (Math.random() - 0.5) * 0.03;
        const newPrice = token.price * (1 + priceChange);
        
        return {
          ...token,
          price: newPrice,
          priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 2,
          volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.1),
          lastUpdate: Date.now(),
          trend: priceChange > 0 ? 'up' : 'down'
        };
      }));
    }, 2500);

    return () => {
      clearInterval(interval);
      setConnectionStatus('disconnected');
    };
  }, [enabled]);

  return { data, isLoading, error, connectionStatus };
};