'use client';

import React, { memo, useState, useCallback } from 'react';
import { Info, ExternalLink } from 'lucide-react';
import type { Token, SortConfig } from '@/types/token';
import { Tooltip } from '@/components/ui/Tooltip';
import { Popover } from '@/components/ui/Popover';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PriceCell } from './PriceCell';

interface TokenTableProps {
  tokens: Token[];
  category: string;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
}

export const TokenTable = memo<TokenTableProps>(({ tokens, category, onSort, sortConfig }) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  
  const handleSort = useCallback((key: string) => {
    onSort(key);
  }, [onSort]);
  
  const SortButton = memo<{ column: string; label: string }>(({ column, label }) => (
  <button
    onClick={() => handleSort(column)}
    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
  >
    {label}
    {sortConfig.key === column && (
      <span className="text-blue-600">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    )}
  </button>
));

SortButton.displayName = 'SortButton';
  
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <SortButton column="name" label="Token" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <SortButton column="price" label="Price" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <SortButton column="volume24h" label="Volume 24h" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <SortButton column="marketCap" label="Market Cap" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <SortButton column="holders" label="Holders" />
              </th>
              {category === 'finalStretch' && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progress
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Age
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tokens.map((token) => (
              <tr
                key={token.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => setSelectedToken(token)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{token.name}</div>
                      <div className="text-sm text-gray-500">{token.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <PriceCell price={token.price} change={token.priceChange24h} />
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    ${(token.volume24h / 1000).toFixed(1)}K
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Tooltip content="Total market capitalization">
                    <div className="font-medium text-gray-900">
                      ${(token.marketCap / 1000000).toFixed(2)}M
                    </div>
                  </Tooltip>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    {token.holders.toLocaleString()}
                  </div>
                </td>
                {category === 'finalStretch' && (
                  <td className="px-4 py-4">
                    <ProgressBar value={token.progress} />
                  </td>
                )}
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-600">
                    {Math.floor((Date.now() - token.createdAt) / 3600000)}h ago
                  </div>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Popover
                      trigger={
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Info className="w-4 h-4 text-gray-600" />
                        </button>
                      }
                    >
                      <div className="p-4 space-y-2">
                        <div className="text-sm font-semibold text-gray-900">Quick Info</div>
                        <div className="text-sm text-gray-600">
                          <div>Liquidity: ${(token.liquidity / 1000).toFixed(1)}K</div>
                          <div>Created: {new Date(token.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </Popover>
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={!!selectedToken}
        onClose={() => setSelectedToken(null)}
        title={selectedToken?.name || ''}
      >
        {selectedToken && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-xl font-bold text-gray-900">${selectedToken.price.toFixed(6)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">24h Change</div>
                <div className={`text-xl font-bold ${selectedToken.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedToken.priceChange24h.toFixed(2)}%
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Market Cap</div>
                <div className="text-xl font-bold text-gray-900">${(selectedToken.marketCap / 1000000).toFixed(2)}M</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Holders</div>
                <div className="text-xl font-bold text-gray-900">{selectedToken.holders.toLocaleString()}</div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  This is a detailed view of the token. In production, this would include charts, transaction history, and more analytics.
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
});

TokenTable.displayName = 'TokenTable';