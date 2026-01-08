import React from 'react';
import { IconSparkles } from './icons/IconSparkles';
import { IconClock } from './icons/IconClock';
import { IconTrash } from './icons/IconTrash';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  history: string[];
  onClearHistory: () => void;
}

const examplePrompts: string[] = [
  'Add a superhero cape',
  'Make it look like a watercolor painting',
  'Change the background to a fantasy forest',
  'Put sunglasses on the main subject',
  'Apply a vintage, black and white effect',
];

const SuggestionPill = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="bg-surface border border-transparent text-subtle text-sm px-3 py-1.5 rounded-full hover:border-primary hover:text-text transition-all duration-200"
  >
    {children}
  </button>
);

export const PromptSuggestions = ({ onSelectPrompt, history, onClearHistory }: PromptSuggestionsProps) => {
  const hasHistory = history.length > 0;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in -mt-4">
      
      {/* Example Prompts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <IconSparkles className="w-5 h-5 text-secondary" />
          <h3 className="text-md font-semibold text-subtle">Need inspiration? Try these:</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map(prompt => (
            <SuggestionPill key={prompt} onClick={() => onSelectPrompt(prompt)}>
              {prompt}
            </SuggestionPill>
          ))}
        </div>
      </div>
      
      {/* Recent Prompts */}
      {hasHistory && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconClock className="w-5 h-5 text-secondary" />
              <h3 className="text-md font-semibold text-subtle">Recent:</h3>
            </div>
            <button 
              onClick={onClearHistory}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-red-400 transition-colors duration-200"
              aria-label="Clear recent prompts"
            >
              <IconTrash className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map(prompt => (
              <SuggestionPill key={prompt} onClick={() => onSelectPrompt(prompt)}>
                {prompt}
              </SuggestionPill>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};