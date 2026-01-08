import React from 'react';
import { IconXCircle } from './icons/IconXCircle';
import { IconAlertTriangle } from './icons/IconAlertTriangle';

interface ConnectionErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Step = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="text-left">
        <h3 className="font-bold text-text text-lg">{title}</h3>
        <div className="text-subtle text-sm space-y-2 mt-1">{children}</div>
    </div>
);


export const ConnectionErrorModal = ({ isOpen, onClose }: ConnectionErrorModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
      aria-labelledby="connection-error-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-surface border border-red-500/30 rounded-2xl shadow-2xl shadow-background/50 max-w-lg w-full m-4 relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-5">
                <IconAlertTriangle className="h-7 w-7 text-red-400" />
            </div>
            <h2 id="connection-error-modal-title" className="text-2xl font-bold text-red-400">Connection Failed</h2>
            <p className="text-subtle mt-2">Could not connect to the authentication service. This can happen for a few reasons.</p>
        </div>
        
        <div className="px-8 pb-8 space-y-6">
            <Step title="1. Check your Internet Connection">
                <p>Please ensure you are connected to the internet and try again.</p>
            </Step>

            <Step title="2. Disable Browser Extensions">
                <p>
                    Ad-blockers or privacy-focused browser extensions can sometimes interfere with authentication requests. Try temporarily disabling them.
                </p>
            </Step>

            <Step title="3. Check your Supabase Project Status">
                <p>
                    Free-tier Supabase projects can be paused after a week of inactivity. Please visit your{' '}
                    <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a>{' '}
                    and ensure your project is active.
                </p>
            </Step>
        </div>

        <div className="p-6 bg-background/50 border-t border-muted/50 text-right">
             <button 
                onClick={onClose} 
                className="w-full sm:w-auto text-white font-medium rounded-lg text-sm px-6 py-3 text-center bg-primary hover:bg-primary/80 transition-colors"
              >
                Okay, I'll check
              </button>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-subtle hover:text-text transition-colors"
          aria-label="Close modal"
        >
          <IconXCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};