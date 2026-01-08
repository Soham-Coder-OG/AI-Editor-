import React, { memo } from 'react';

export const AdBanner = memo(() => {
  return (
    <div className="w-full bg-surface/50 border border-muted/30 rounded-lg text-center animate-fade-in p-4 group">
      <span className="text-xs text-subtle/50 uppercase tracking-wider">Advertisement</span>
      <div className="flex items-center justify-center h-20 text-subtle group-hover:text-text transition-colors">
        Your Ad Could Be Here! Promote Your Brand.
      </div>
    </div>
  );
});