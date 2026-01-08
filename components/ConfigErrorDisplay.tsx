import React from 'react';
import { IconAlertTriangle } from './icons/IconAlertTriangle';
import { IconKey } from './icons/IconKey';
import { IconFileText } from './icons/IconFileText';

interface ConfigErrorDisplayProps {
  error: Error;
}

const envFileContent = `SUPABASE_URL="your-supabase-url-here"\nSUPABASE_ANON_KEY="your-supabase-anon-key-here"`;

export const ConfigErrorDisplay = ({ error }: ConfigErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 animate-fade-in text-text">
      <div className="w-full max-w-3xl bg-surface border border-red-500/30 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center">
          <IconAlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-2xl font-bold text-red-400">Configuration Error</h1>
          <p className="text-subtle mt-2">
            The application cannot connect to the authentication service. Please configure your environment variables.
          </p>
        </div>

        <div className="text-left mt-8 space-y-6">
            <div>
                <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mt-1">
                        <IconFileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text text-lg">1. Create a <code className="bg-background text-primary/80 px-1.5 py-0.5 rounded-md text-sm">.env.local</code> file</h2>
                        <p className="text-sm text-subtle mt-1">In the root directory of your project, create a new file named exactly <code className="bg-background text-primary/80 px-1.5 py-0.5 rounded-md text-sm">.env.local</code>.</p>
                    </div>
                </div>
            </div>
            
            <div>
                <div className="flex items-start gap-3 mb-2">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg mt-1">
                        <IconKey className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-text text-lg">2. Add your Supabase Keys</h2>
                        <p className="text-sm text-subtle mt-1">Copy the following into your new file and replace the placeholders with your actual Supabase Project URL and Anon Key.</p>
                         <pre className="mt-3 bg-background border border-muted/50 rounded-lg p-3 text-xs text-slate-300 overflow-x-auto">
                            <code>{envFileContent}</code>
                        </pre>
                        <p className="text-xs text-subtle mt-2">You can find these keys in your Supabase Dashboard under <span className="font-semibold text-text/80">Project Settings &gt; API</span>.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-subtle">
            After creating the file, you must <span className="font-bold text-text/80">restart your development server</span> for the changes to apply.
        </div>
      </div>
    </div>
  );
};