import React, { useState } from 'react';
import { IconClipboard } from './icons/IconClipboard';
import { IconCheck } from './icons/IconCheck';
import { IconAlertTriangle } from './icons/IconAlertTriangle';

interface DatabaseErrorDisplayProps {
  sqlScript: string;
  onRetry: () => void;
}

export const DatabaseErrorDisplay = ({ sqlScript, onRetry }: DatabaseErrorDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 animate-fade-in text-text">
      <div className="w-full max-w-3xl bg-surface border border-red-500/30 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center">
            <IconAlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h1 className="text-2xl font-bold text-red-400">Database Setup Required</h1>
            <p className="text-subtle mt-2">
                Your application is connected to Supabase, but the required <code className="bg-background text-primary/80 px-1.5 py-0.5 rounded-md text-sm">profiles</code> table is missing.
            </p>
        </div>

        <div className="text-left mt-8">
            <h2 className="font-semibold text-text mb-2">How to fix this:</h2>
            <ol className="list-decimal list-inside space-y-2 text-subtle text-sm">
                <li>Go to your Supabase Project dashboard.</li>
                <li>In the left sidebar, navigate to the <span className="font-bold">SQL Editor</span>.</li>
                <li>Click <span className="font-bold">"+ New query"</span>.</li>
                <li>Copy the SQL script below and paste it into the editor.</li>
                <li>Click the <span className="font-bold">"RUN"</span> button.</li>
            </ol>
        </div>

        <div className="relative bg-background border border-muted/50 rounded-lg my-6">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-surface hover:bg-muted/50 text-subtle rounded-lg transition-colors duration-200"
                aria-label="Copy SQL script"
            >
                {copied ? <IconCheck className="w-5 h-5 text-green-400" /> : <IconClipboard className="w-5 h-5" />}
            </button>
            <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
                <code>{sqlScript}</code>
            </pre>
        </div>
        
        <div className="text-center">
            <button
                onClick={onRetry}
                className="w-full max-w-xs justify-center items-center gap-2 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary to-secondary hover:shadow-glow-primary"
            >
                I've run the script, Retry
            </button>
        </div>
      </div>
    </div>
  );
};
