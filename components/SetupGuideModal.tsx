import React from 'react';
import { IconXCircle } from './icons/IconXCircle';
import { IconKey } from './icons/IconKey';
import { IconFileText } from './icons/IconFileText';
import { IconGoogle } from './icons/IconGoogle';

interface SetupGuideModalProps {
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

export const SetupGuideModal = ({ isOpen, onClose }: SetupGuideModalProps) => {
  if (!isOpen) return null;
  
  const envFileContent = `SUPABASE_URL="your-supabase-url-here"\nSUPABASE_ANON_KEY="your-supabase-anon-key-here"`;

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
            <h2 id="setup-modal-title" className="text-2xl font-bold text-text">Connect to Supabase</h2>
            <p className="text-subtle mt-1">Follow these steps to link your Supabase project and exit Demo Mode.</p>
        </div>
        
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
            <Step icon={<IconKey className="w-5 h-5 text-primary" />} title="Step 1: Get your API Keys">
                <p>
                    In your Supabase project dashboard, go to{' '}
                    <span className="font-semibold text-text/80">Project Settings</span> (the gear icon) &gt;{' '}
                    <span className="font-semibold text-text/80">API</span>.
                </p>
                <p>
                    You will find your <code className="bg-background text-primary/80 px-1 py-0.5 rounded text-xs">Project URL</code> and{' '}
                    <code className="bg-background text-primary/80 px-1 py-0.5 rounded text-xs">anon</code>{' '}<code className="bg-background text-primary/80 px-1 py-0.5 rounded text-xs">public</code> key. Keep this page open for the next step.
                </p>
            </Step>

            <Step icon={<IconFileText className="w-5 h-5 text-primary" />} title="Step 2: Set Environment Variables">
                <p>
                    In your project's root directory, create a file named <code className="bg-background text-primary/80 px-1 py-0.5 rounded text-xs">.env.local</code>.
                </p>
                <p>Copy and paste the following content into the file, replacing the placeholder values with the keys from Step 1.</p>
                <pre className="bg-background border border-muted/50 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto mt-2">
                    <code>{envFileContent}</code>
                </pre>
            </Step>

            <Step icon={<IconGoogle className="w-5 h-5" />} title="Step 3: Enable Google Provider">
                <p>
                    For Google Sign-In to work, you must enable it in Supabase. Go to{' '}
                    <span className="font-semibold text-text/80">Authentication</span> &gt;{' '}
                    <span className="font-semibold text-text/80">Providers</span>.
                </p>
                <p>
                    Find <span className="font-semibold text-text/80">Google</span> in the list and enable it. You will need to provide a Client ID and Secret, which you can get from the Google Cloud Console.
                </p>
            </Step>
            
            <div className="!mt-12 text-center text-sm text-subtle">
                After completing these steps, you may need to <span className="font-bold text-text/80">restart your development server</span> for the changes to take effect.
            </div>
        </div>

        <div className="p-6 bg-background/50 border-t border-muted/50 text-right">
             <button 
                onClick={onClose} 
                className="w-full sm:w-auto text-white font-medium rounded-lg text-sm px-6 py-3 text-center bg-primary hover:bg-primary/80 transition-colors"
              >
                Got it, thanks!
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
