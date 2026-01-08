import React from 'react';
import { IconSparkles } from './icons/IconSparkles';
import { IconTrash } from './icons/IconTrash';
import { Spinner } from './Spinner';

interface PromptControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

export const PromptControls = ({ prompt, setPrompt, isLoading, onSubmit, onClear }: PromptControlsProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };
  
  return (
    <div className="bg-surface border border-muted/50 rounded-xl p-4 w-full flex flex-col md:flex-row items-center gap-4 shadow-2xl shadow-background">
      <div className="w-full">
        <label htmlFor="prompt-input" className="sr-only">
          Enter your editing instruction or prompt
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., make the cat wear sunglasses"
          className="w-full h-24 md:h-auto resize-none bg-background border border-muted rounded-lg p-3 text-text placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          disabled={isLoading}
        />
      </div>
      <div className="flex w-full md:w-auto items-center gap-3">
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt}
          className="flex-grow w-full justify-center items-center gap-2 text-white font-semibold rounded-lg text-sm px-6 py-3 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary via-primary to-secondary hover:shadow-glow-primary disabled:from-muted disabled:to-muted/80 disabled:cursor-not-allowed disabled:shadow-none bg-[length:200%_100%] hover:bg-[position:100%_0]"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <IconSparkles className="w-5 h-5" />
              <span>Generate</span>
            </>
          )}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading}
          className="p-3 bg-muted/20 hover:bg-muted/40 text-subtle rounded-lg disabled:opacity-50 transition-colors duration-200"
          aria-label="Clear prompt"
        >
          <IconTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};