'use client';

import React, { memo } from 'react';

export const ShimmerRow = memo(() => (
  <tr className="border-b border-gray-100">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="relative overflow-hidden h-4 bg-gray-200 rounded" style={{ width: `${60 + Math.random() * 40}%` }}>
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>
      </td>
    ))}
  </tr>
));

ShimmerRow.displayName = 'ShimmerRow';