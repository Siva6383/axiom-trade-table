import { useEffect, useState, useCallback } from 'react';
import { Token } from '@/types/token';

export const useWebSocket = (url: string = 'wss://mock-websocket') => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateMockTokens = useCallback((): Token[] => {
    // Mock token generation logic
    const names = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'BOME'];
    const categories: Token['category'][] = ['new', 'finalStretch', 'migrated'];
    
    return Array.from({ length: 30 }, (_, i) => ({
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
    }));
  }, []);

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      try {
        setIsConnected(true);
        setTokens(generateMockTokens());

        // Simulate real-time updates
        const interval = setInterval(() => {
          setTokens(prev => prev.map(token => ({
            ...token,
            price: token.price * (1 + (Math.random() - 0.5) * 0.02),
            priceChange24h: token.priceChange24h + (Math.random() - 0.5) * 2,
            volume24h: token.volume24h * (1 + (Math.random() - 0.5) * 0.1),
          })));
        }, 3000);

        return () => {
          clearInterval(interval);
          setIsConnected(false);
        };
      } catch (err) {
        setError(err as Error);
        setIsConnected(false);
      }
    };

    const cleanup = connectWebSocket();
    return cleanup;
  }, [generateMockTokens]);

  return { tokens, isConnected, error };
};