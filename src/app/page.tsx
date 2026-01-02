'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle, Search, Filter, Sparkles, Zap, CheckCircle2, BarChart3, TrendingUp } from 'lucide-react';
import { useMockWebSocket } from '@/hooks/useMockWebSocket';
import { TokenTable } from '@/components/table/TokenTable';
import { ShimmerRow } from '@/components/ui/Skeleton';
import type { Token, SortConfig } from '@/types/token';

export default function AxiomTradeTable() {
  const [activeTab, setActiveTab] = useState<'new' | 'finalStretch' | 'migrated'>('new');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'volume24h', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: allTokens, isLoading, error, connectionStatus } = useMockWebSocket();
  
  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key: key as keyof Token,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);
  
  const filteredAndSortedTokens = useMemo(() => {
    let filtered = allTokens.filter(t => t.category === activeTab);
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * multiplier;
    });
  }, [allTokens, activeTab, sortConfig, searchQuery]);
  
  const tabs = [
    { id: 'new' as const, label: 'New Pairs', icon: Sparkles, count: allTokens.filter(t => t.category === 'new').length },
    { id: 'finalStretch' as const, label: 'Final Stretch', icon: Zap, count: allTokens.filter(t => t.category === 'finalStretch').length },
    { id: 'migrated' as const, label: 'Migrated', icon: CheckCircle2, count: allTokens.filter(t => t.category === 'migrated').length }
  ];
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-200">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Connection Error</h2>
          </div>
          <p className="text-gray-600 mb-4">Failed to connect to WebSocket. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Axiom-Trade-Table
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                Real-time token tracking • {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all w-64"
                />
              </div>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="flex border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-5 font-bold transition-all relative ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <table className="w-full">
                  <tbody>
                    {[...Array(8)].map((_, i) => (
                      <ShimmerRow key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : filteredAndSortedTokens.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No tokens found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Tokens</div>
            </div>
            <div className="text-3xl font-black text-gray-900">{allTokens.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Active Category</div>
            </div>
            <div className="text-3xl font-black text-purple-600">{filteredAndSortedTokens.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Last Update</div>
            </div>
            <div className="text-3xl font-black text-green-600">Live</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Volume</div>
            </div>
            <div className="text-3xl font-black text-orange-600">
              ${(allTokens.reduce((acc, t) => acc + t.volume24h, 0) / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}