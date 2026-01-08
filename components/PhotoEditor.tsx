import React, { useState, useCallback, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { PromptControls } from './PromptControls';
import { editImage } from '../services/geminiService';
import { EditResult } from '../types';
import { AdBanner } from './AdBanner';
import { PromptSuggestions } from './PromptSuggestions';
import { MaskableImageCard } from './MaskableImageCard';
import { ImageCard } from './ImageCard';
import { Spinner } from './Spinner';
import { useToast } from '../contexts/ToastContext';
import { IconFocus } from './icons/IconFocus';
import { IconPhotoEdit } from './icons/IconPhotoEdit';
import { addWatermark } from '../lib/watermark';

const MAX_HISTORY_LENGTH = 8;
const HISTORY_STORAGE_KEY = 'ai-photo-editor-history';

type EditMode = 'mask' | 'global';

const loadingMessages = [
  'Conjuring your vision...',
  'Warming up the AI\'s paintbrushes...',
  'Translating your prompt into pixels...',
  'Applying a touch of magic...',
  'This can take a few moments',
];

export const PhotoEditor = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [editResult, setEditResult] = useState<EditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [editMode, setEditMode] = useState<EditMode>('global');

  const { showToast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setPromptHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse prompt history from localStorage", e);
      setPromptHistory([]);
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      setCurrentLoadingMessage(loadingMessages[0]);
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

  const savePromptToHistory = (newPrompt: string) => {
    if (!newPrompt || newPrompt.trim() === '') return;
    
    setPromptHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(p => p !== newPrompt);
      const newHistory = [newPrompt, ...filteredHistory].slice(0, MAX_HISTORY_LENGTH);
      
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error("Failed to save prompt history to localStorage", e);
      }
      
      return newHistory;
    });
  };

  const clearPromptHistory = () => {
    setPromptHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear prompt history from localStorage", e);
    }
  };
  
  const handleImageUpload = (file: File) => {
    setOriginalImageFile(file);
    setEditResult(null);
    setError(null);
    setMaskDataUrl(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEditRequest = useCallback(async () => {
    if (!originalImageFile || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setEditResult(null);
    showToast('Starting AI image edit...', 'info');

    try {
      const maskToSend = editMode === 'mask' ? maskDataUrl : null;
      const result = await editImage(originalImageFile, prompt, maskToSend);
      
      if (result.imageUrl) {
        const watermarkedUrl = await addWatermark(result.imageUrl);
        setEditResult({ ...result, imageUrl: watermarkedUrl });
        savePromptToHistory(prompt);
        showToast('Edit successful!', 'success');
      } else {
        setEditResult(result);
        showToast(result.text || 'The AI could not generate an image.', 'error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      console.error(err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, prompt, maskDataUrl, editMode, showToast]);

  const handleClear = () => {
    setOriginalImageFile(null);
    setOriginalImageUrl(null);
    setMaskDataUrl(null);
    setPrompt('');
    setEditResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleClearPrompt = () => {
    setPrompt('');
  };

  const handleModeChange = (mode: EditMode) => {
    setEditMode(mode);
    if (mode === 'global') {
      setMaskDataUrl(null); // Clear mask when switching to global mode
    }
  };
  
  const modeButtonClasses = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const activeModeClasses = "bg-primary/20 text-primary";
  const inactiveModeClasses = "bg-surface hover:bg-muted/50 text-subtle";

  return (
    <>
        {!originalImageUrl ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full max-w-5xl flex flex-col gap-8">
            <PromptControls
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={isLoading}
              onSubmit={handleEditRequest}
              onClear={handleClearPrompt}
            />
            
            <PromptSuggestions
              onSelectPrompt={setPrompt}
              history={promptHistory}
              onClearHistory={clearPromptHistory}
            />

            <AdBanner />

            {error && (
               <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg relative text-center" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span className="text-sm font-semibold text-subtle">Edit Mode:</span>
                <div className="flex items-center gap-2 p-1 bg-background rounded-xl border border-muted/50">
                    <button 
                        onClick={() => handleModeChange('global')}
                        className={`${modeButtonClasses} ${editMode === 'global' ? activeModeClasses : inactiveModeClasses}`}
                        disabled={isLoading}
                    >
                        <IconPhotoEdit className="w-5 h-5" />
                        Creative Edit
                    </button>
                    <button 
                        onClick={() => handleModeChange('mask')}
                        className={`${modeButtonClasses} ${editMode === 'mask' ? activeModeClasses : inactiveModeClasses}`}
                        disabled={isLoading}
                    >
                        <IconFocus className="w-5 h-5" />
                        Precise Edit
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-8 animate-fade-in">
                <MaskableImageCard
                    title="Original"
                    imageUrl={originalImageUrl}
                    onMaskChange={setMaskDataUrl}
                    onDelete={handleClear}
                    maskingEnabled={editMode === 'mask'}
                />
                <ImageCard
                    title="Edited"
                    imageUrl={editResult?.imageUrl || null}
                    glowClass={editResult?.imageUrl ? 'shadow-glow-primary' : ''}
                    downloadUrl={editResult?.imageUrl}
                >
                    {isLoading && (
                    <div role="status" className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-text transition-opacity duration-300">
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
          </div>
        )}
    </>
  );
};