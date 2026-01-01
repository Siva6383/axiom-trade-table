'use client';

import React, { memo, useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceCellProps {
  price: number;
  change: number;
}

export const PriceCell = memo<PriceCellProps>(({ price, change }) => {
  const [prevPrice, setPrevPrice] = useState(price);
  const [flashColor, setFlashColor] = useState('');
  
  useEffect(() => {
    if (price !== prevPrice) {
      setFlashColor(price > prevPrice ? 'bg-green-200' : 'bg-red-200');
      setTimeout(() => setFlashColor(''), 500);
      setPrevPrice(price);
    }
  }, [price, prevPrice]);
  
  const isPositive = change >= 0;
  
  return (
    <div className={`transition-colors duration-500 rounded px-2 py-1 ${flashColor}`}>
      <div className="font-semibold text-gray-900">
        ${price.toFixed(6)}
      </div>
      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(change).toFixed(2)}%
      </div>
    </div>
  );
});

PriceCell.displayName = 'PriceCell';