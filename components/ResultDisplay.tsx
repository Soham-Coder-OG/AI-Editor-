import React, { useState, useEffect } from 'react';
import { EditResult } from '../types';
import { Spinner } from './Spinner';
import { ImageCard } from './ImageCard';

interface ResultDisplayProps {
  originalImageUrl: string;
  editResult: EditResult | null;
  isLoading: boolean;
  onDeleteOriginal?: () => void;
}

const loadingMessages = [
  'Conjuring your vision...',
  'Warming up the AI\'s paintbrushes...',
  'Translating your prompt into pixels...',
  'Applying a touch of magic...',
  'This can take a few moments',
];

export const ResultDisplay = ({ originalImageUrl, editResult, isLoading, onDeleteOriginal }: ResultDisplayProps) => {
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setCurrentLoadingMessage(loadingMessages[0]); // Reset to first message on new load
      interval = window.setInterval(() => {
        setCurrentLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);
    }
    return () => window.clearInterval(interval);
  }, [isLoading]);
  
  return (
    <div className="w-full flex flex-col md:flex-row gap-8 animate-fade-in">
      <ImageCard 
        title="Original" 
        imageUrl={originalImageUrl} 
        onDelete={onDeleteOriginal}
      />
      <ImageCard 
        title="Edited" 
        imageUrl={editResult?.imageUrl || null} 
        glowClass={editResult?.imageUrl ? 'shadow-glow-primary' : ''}
        downloadUrl={editResult?.imageUrl}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-text transition-opacity duration-300">
            <Spinner />
            <span className="text-lg font-medium">{currentLoadingMessage}</span>
          </div>
        )}
        {editResult && !editResult.imageUrl && !isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-text p-4 text-center">
                <span className="text-lg font-semibold">Could not generate image.</span>
                <span className="text-sm text-subtle">{editResult.text || 'The AI may have refused the request.'}</span>
            </div>
        )}
      </ImageCard>
    </div>
  );
};