'use client';

import React, { memo } from 'react';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
}

export const ProgressBar = memo<ProgressBarProps>(({ value, showLabel = true }) => (
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

ProgressBar.displayName = 'ProgressBar';