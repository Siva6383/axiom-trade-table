import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Info, AlertCircle, Loader2 } from 'lucide-react';

// Mock WebSocket for real-time updates
const useMockWebSocket = (enabled = true) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    // Initial load
    setTimeout(() => {
      setData(generateMockTokens());
      setIsLoading(false);
    }, 1500);

    // Simulate real-time updates
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

const generateMockTokens = () => {
  const tokens = [];
  const categories = ['new', 'finalStretch', 'migrated'];
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

// Tooltip Component
const Tooltip = memo(({ children, content }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap animate-in fade-in duration-200">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
});

// Popover Component
const Popover = memo(({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-64 animate-in fade-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        </>
      )}
    </div>
  );
});

// Modal Component
const Modal = memo(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </div>
    </div>
  );
});

// Skeleton Loader
const SkeletonRow = memo(() => (
  <tr className="border-b border-gray-100">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
));

// Price Cell with smooth transitions
const PriceCell = memo(({ price, change }) => {
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

// Progress Bar
const ProgressBar = memo(({ value, showLabel = true }) => (
  <div className="w-full">
    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    {showLabel && (
      <span className="text-xs text-gray-500 mt-1">{value.toFixed(1)}%</span>
    )}
  </div>
));

// Main Table Component
const TokenTable = memo(({ tokens, category, onSort, sortConfig }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  
  const handleSort = useCallback((key) => {
    onSort(key);
  }, [onSort]);
  
  const SortButton = ({ column, label }) => (
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
  );
  
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
            {tokens.map((token, idx) => (
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

// Main App Component
export default function AxiomTradeTable() {
  const [activeTab, setActiveTab] = useState('new');
  const [sortConfig, setSortConfig] = useState({ key: 'volume24h', direction: 'desc' });
  const { data: allTokens, isLoading, error } = useMockWebSocket();
  
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);
  
  const filteredAndSortedTokens = useMemo(() => {
    const filtered = allTokens.filter(t => t.category === activeTab);
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * multiplier;
    });
  }, [allTokens, activeTab, sortConfig]);
  
  const tabs = [
    { id: 'new', label: 'New Pairs', icon: '🆕' },
    { id: 'finalStretch', label: 'Final Stretch', icon: '🏁' },
    { id: 'migrated', label: 'Migrated', icon: '✅' }
  ];
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Error Loading Data</h2>
          </div>
          <p className="text-gray-600">Failed to load token data. Please refresh the page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Token Discovery</h1>
          <p className="text-gray-600">Real-time token tracking and analytics</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Table Content */}
          <div className="p-6">
            {isLoading ? (
              <table className="w-full">
                <tbody>
                  {[...Array(8)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            ) : (
              <TokenTable
                tokens={filteredAndSortedTokens}
                category={activeTab}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            )}
          </div>
        </div>
        
        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Total Tokens</div>
            <div className="text-2xl font-bold text-gray-900">{allTokens.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Active Category</div>
            <div className="text-2xl font-bold text-blue-600">{filteredAndSortedTokens.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Last Update</div>
            <div className="text-2xl font-bold text-gray-900">Live</div>
          </div>
        </div>
      </div>
    </div>
  );
}