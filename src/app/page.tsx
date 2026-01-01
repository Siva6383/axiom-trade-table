'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useMockWebSocket } from '@/hooks/useMockWebSocket';
import { TokenTable } from '@/components/table/TokenTable';
import { SkeletonRow } from '@/components/ui/Skeleton';
import type { Token, SortConfig } from '@/types/token';

export default function AxiomTradeTable() {
  const [activeTab, setActiveTab] = useState<'new' | 'finalStretch' | 'migrated'>('new');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'volume24h', direction: 'desc' });
  const { data: allTokens, isLoading, error } = useMockWebSocket();
  
  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key: key as keyof Token,
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
    { id: 'new' as const, label: 'New Pairs', icon: '🆕' },
    { id: 'finalStretch' as const, label: 'Final Stretch', icon: '🏁' },
    { id: 'migrated' as const, label: 'Migrated', icon: '✅' }
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Token Discovery</h1>
          <p className="text-gray-600">Real-time token tracking and analytics</p>
        </div>
        
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