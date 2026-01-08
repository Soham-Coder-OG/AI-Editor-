import React from 'react';
import { IconSparkles } from './icons/IconSparkles';
import { IconXCircle } from './icons/IconXCircle';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal = ({ isOpen, onClose, onUpgrade }: UpgradeModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      aria-labelledby="upgrade-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface border border-primary/20 rounded-2xl shadow-glow-primary max-w-sm w-full m-4 p-8 text-center relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-subtle hover:text-text transition-colors"
          aria-label="Close modal"
        >
          <IconXCircle className="w-6 h-6" />
        </button>

        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <IconSparkles className="h-8 w-8 text-primary" />
        </div>
        
        <h2 id="upgrade-modal-title" className="text-2xl font-bold text-text">You've Used All Your Free Credits!</h2>
        <p className="text-subtle mt-3">
          Upgrade your plan to continue creating amazing images with unlimited potential.
        </p>
        
        <div className="mt-8 flex flex-col gap-3">
          <button 
            onClick={onUpgrade} 
            className="w-full justify-center items-center gap-2 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary to-secondary hover:shadow-glow-primary"
          >
            View Plans
          </button>
          <button 
            onClick={onClose} 
            className="w-full text-subtle font-medium rounded-lg text-sm px-6 py-3 text-center hover:bg-muted/30 transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};