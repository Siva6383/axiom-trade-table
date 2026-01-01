'use client';

import React, { memo, useState } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Popover = memo<PopoverProps>(({ trigger, children }) => {
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
          <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-64">
            {children}
          </div>
        </>
      )}
    </div>
  );
});

Popover.displayName = 'Popover';