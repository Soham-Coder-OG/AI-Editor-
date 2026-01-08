import React, { useState, useCallback, useEffect } from 'react';
import { PromptControls } from './PromptControls';
import { ImageCard } from './ImageCard';
import { AdBanner } from './AdBanner';
import { generateImage, AspectRatio } from '../services/geminiService';
import { Spinner } from './Spinner';
import { IconPhoto } from './icons/IconPhoto';
import { useToast } from '../contexts/ToastContext';
import { addWatermark } from '../lib/watermark';

const aspectRatios: { label: string; value: AspectRatio }[] = [
    { label: 'Square', value: '1:1' },
    { label: 'Widescreen', value: '16:9' },
    { label: 'Portrait', value: '9:16' },
    { label: 'Landscape', value: '4:3' },
    { label: 'Tall', value: '3:4' },
];

const loadingMessages = [
    'Painting with algorithms...',
    'Generating creative sparks...',
    'Dreaming up your image...',
    'Turning words into art...',
    'Just a moment...',
];

export const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

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

    const handleGenerateRequest = useCallback(async () => {
        if (!prompt) {
            setError('Please enter a prompt to generate an image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);
        showToast('Starting AI image generation...', 'info');

        try {
            const results = await generateImage(prompt, aspectRatio);
            const watermarkedResults = await Promise.all(results.map(url => addWatermark(url)));
            setGeneratedImages(watermarkedResults);
            showToast(`Successfully generated ${results.length} images!`, 'success');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
            console.error(err);
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio, showToast]);

    const handleClearPrompt = () => {
        setPrompt('');
        setError(null);
    };

    const handleImageDelete = (indexToDelete: number) => {
        setGeneratedImages(prev => prev.filter((_, index) => index !== indexToDelete));
    };
    
    const aspectButtonClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
    const activeAspectClasses = "bg-primary/20 text-primary";
    const inactiveAspectClasses = "bg-surface hover:bg-muted/50 text-subtle";

    return (
        <div className="w-full max-w-5xl flex flex-col gap-8 mx-auto animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Free AI Image Generator from Text</h2>
                <p className="text-subtle mt-3 max-w-lg mx-auto">Turn your words into original, high-resolution art. Describe any idea, and our free text-to-image AI will generate stunning pictures for you in seconds. No sign-up required.</p>
            </div>
            
            <PromptControls
              prompt={prompt}
              setPrompt={setPrompt}
              isLoading={isLoading}
              onSubmit={handleGenerateRequest}
              onClear={handleClearPrompt}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <span id="aspect-ratio-label" className="text-sm font-semibold text-subtle">Aspect Ratio:</span>
                <div role="group" aria-labelledby="aspect-ratio-label" className="flex flex-wrap items-center justify-center gap-2 p-1 bg-background rounded-xl border border-muted/50">
                    {aspectRatios.map(({ label, value }) => (
                        <button 
                            key={value} 
                            onClick={() => setAspectRatio(value)}
                            aria-pressed={aspectRatio === value}
                            className={`${aspectButtonClasses} ${aspectRatio === value ? activeAspectClasses : inactiveAspectClasses}`}
                            disabled={isLoading}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <AdBanner />

            {error && (
               <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg relative text-center" role="alert">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {isLoading && (
                <div role="status" className="w-full flex flex-col items-center justify-center gap-4 text-text p-8">
                    <Spinner />
                    <span className="text-lg font-medium">{currentLoadingMessage}</span>
                </div>
            )}

            {!isLoading && generatedImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {generatedImages.map((imgUrl, index) => (
                        <ImageCard
                            key={index}
                            title={`Result ${index + 1}`}
                            imageUrl={imgUrl}
                            glowClass="shadow-glow-primary"
                            downloadUrl={imgUrl}
                            onDelete={() => handleImageDelete(index)}
                        />
                    ))}
                </div>
            )}

            {!isLoading && generatedImages.length === 0 && !error && (
                <div className="text-muted flex flex-col items-center justify-center gap-4 text-center bg-surface/50 border border-dashed border-muted/50 rounded-2xl p-8 sm:p-16">
                    <IconPhoto className="w-20 h-20"/>
                    <h3 className="text-lg font-semibold text-text">Your creations will appear here</h3>
                    <p className="text-sm max-w-xs">Enter a prompt above and click "Generate" to see what the AI can create for you.</p>
                </div>
            )}
        </div>
    );
};