'use client';

import React, { memo } from 'react';

export const SkeletonRow = memo(() => (
  <tr className="border-b border-gray-100">
    {[...Array(8)].map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div 
          className="h-4 bg-gray-200 rounded animate-pulse" 
          style={{ width: `${60 + Math.random() * 40}%` }} 
        />
      </td>
    ))}
  </tr>
));

SkeletonRow.displayName = 'SkeletonRow';