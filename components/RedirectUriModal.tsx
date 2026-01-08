import React, { useState, useEffect } from 'react';
import { IconXCircle } from './icons/IconXCircle';
import { IconSettings } from './icons/IconSettings';
import { IconClipboard } from './icons/IconClipboard';
import { IconCheck } from './icons/IconCheck';

interface RedirectUriModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Step = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mt-1">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-text text-lg">{title}</h3>
            <div className="text-subtle text-sm space-y-2 mt-1">{children}</div>
        </div>
    </div>
);

export const RedirectUriModal = ({ isOpen, onClose }: RedirectUriModalProps) => {
  const [copied, setCopied] = useState(false);
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    // This ensures window is defined, preventing SSR errors.
    setOriginUrl(window.location.origin);
  }, []);

  if (!isOpen) return null;
  
  const handleCopy = () => {
    if (originUrl) {
      navigator.clipboard.writeText(originUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
      aria-labelledby="setup-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-surface border border-primary/20 rounded-2xl shadow-glow-primary max-w-2xl w-full m-4 relative transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 border-b border-muted/50">
            <h2 id="setup-modal-title" className="text-2xl font-bold text-text">Google Sign-In Configuration</h2>
            <p className="text-subtle mt-1">It looks like your app's URL isn't registered with your authentication provider. Follow these steps to fix it.</p>
        </div>
        
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <Step icon={<IconSettings className="w-5 h-5 text-primary" />} title="Update URL Configuration">
                <p>
                    In your Supabase project dashboard, navigate to{' '}
                    <span className="font-semibold text-text/80">Authentication</span>, then{' '}
                    <span className="font-semibold text-text/80">URL Configuration</span>.
                </p>
                <div>
                    <p>Copy your application's URL below:</p>
                    <div className="relative bg-background border border-muted/50 rounded-lg my-2 flex items-center pr-2">
                        <pre className="p-3 text-sm text-slate-300 overflow-x-auto flex-grow">
                            <code>{originUrl || 'Loading...'}</code>
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="p-2 bg-surface hover:bg-muted/50 text-subtle rounded-lg transition-colors duration-200 flex-shrink-0"
                            aria-label="Copy URL"
                            disabled={!originUrl}
                        >
                            {copied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconClipboard className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                 <p>
                    Paste this URL into both the{' '}
                    <span className="font-semibold text-text/80">Site URL</span> field and the{' '}
                    <span className="font-semibold text-text/80">Additional Redirect URLs</span> list.
                </p>
                <p className="text-xs text-muted">
                    Note: If you deploy your app to a live URL, you will need to add that new URL here as well.
                </p>
            </Step>
        </div>

        <div className="p-6 bg-background/50 border-t border-muted/50 text-right">
             <button 
                onClick={onClose} 
                className="w-full sm:w-auto text-white font-medium rounded-lg text-sm px-6 py-3 text-center bg-primary hover:bg-primary/80 transition-colors"
              >
                I've updated my settings
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