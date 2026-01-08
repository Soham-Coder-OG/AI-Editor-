import React, { useState, useCallback, useEffect } from 'react';
import { DualImageUploader } from './DualImageUploader';
import { PromptControls } from './PromptControls';
import { ImageCard } from './ImageCard';
import { AdBanner } from './AdBanner';
import { mergeImages } from '../services/geminiService';
import { EditResult } from '../types';
import { Spinner } from './Spinner';
import { IconPlus } from './icons/IconPlus';
import { IconEquals } from './icons/IconEquals';
import { useToast } from '../contexts/ToastContext';
import { addWatermark } from '../lib/watermark';

type MergerStep = 'upload' | 'prompt';

const loadingMessages = [
    'Merging images...',
    'Blending pixels creatively...',
    'Fusing your photos together...',
    'This may take a little while',
];

export const ImageMerger = () => {
    const [step, setStep] = useState<MergerStep>('upload');
    const [imageFile1, setImageFile1] = useState<File | null>(null);
    const [imageFile2, setImageFile2] = useState<File | null>(null);
    const [imageUrl1, setImageUrl1] = useState<string | null>(null);
    const [imageUrl2, setImageUrl2] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [mergeResult, setMergeResult] = useState<EditResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
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

    const handleImageUpload = (file: File, slot: 1 | 2) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (slot === 1) {
                setImageFile1(file);
                setImageUrl1(result);
            } else {
                setImageFile2(file);
                setImageUrl2(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageDelete = (slot: 1 | 2) => {
        if (slot === 1) {
            setImageFile1(null);
            setImageUrl1(null);
        } else {
            setImageFile2(null);
            setImageUrl2(null);
        }
    };

    const handleMergeRequest = useCallback(async () => {
        if (!imageFile1 || !imageFile2 || !prompt) {
            setError('Please upload two images and enter a prompt.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setMergeResult(null);
        showToast('Starting AI image merge...', 'info');

        try {
            const result = await mergeImages(imageFile1, imageFile2, prompt);

            if (result.imageUrl) {
                const watermarkedUrl = await addWatermark(result.imageUrl);
                setMergeResult({ ...result, imageUrl: watermarkedUrl });
                showToast('Merge successful!', 'success');
            } else {
                setMergeResult(result);
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
    }, [imageFile1, imageFile2, prompt, showToast]);

    const handleClear = () => {
        setImageFile1(null);
        setImageFile2(null);
        setImageUrl1(null);
        setImageUrl2(null);
        setPrompt('');
        setMergeResult(null);
        setError(null);
        setIsLoading(false);
        setStep('upload');
    };

    const handleClearPrompt = () => {
        setPrompt('');
    };

    return (
        <div className="w-full animate-fade-in">
            {step === 'upload' ? (
                <DualImageUploader 
                    onImageUpload={handleImageUpload}
                    onImageDelete={handleImageDelete}
                    imageUrl1={imageUrl1}
                    imageUrl2={imageUrl2}
                    onComplete={() => setStep('prompt')}
                />
            ) : (
                <div className="w-full max-w-5xl flex flex-col gap-8 mx-auto">
                    <PromptControls
                        prompt={prompt}
                        setPrompt={setPrompt}
                        isLoading={isLoading}
                        onSubmit={handleMergeRequest}
                        onClear={handleClearPrompt}
                    />
                    
                    <AdBanner />

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg relative text-center" role="alert">
                            <strong className="font-bold">Oops! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="w-full flex flex-col items-center gap-8">
                        {/* --- Sources Row --- */}
                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                            <div className="w-full max-w-sm">
                                <ImageCard title="Source 1" imageUrl={imageUrl1} onDelete={handleClear} />
                            </div>
                            <IconPlus className="w-10 h-10 text-muted flex-shrink-0 rotate-90 md:rotate-0" />
                            <div className="w-full max-w-sm">
                                <ImageCard title="Source 2" imageUrl={imageUrl2} onDelete={handleClear} />
                            </div>
                        </div>

                        {/* --- Equals Sign --- */}
                        <div className="flex justify-center">
                            <IconEquals className="w-10 h-10 text-muted" />
                        </div>

                        {/* --- Result --- */}
                        <div className="w-full max-w-2xl">
                            <ImageCard 
                                title="Merged Result" 
                                imageUrl={mergeResult?.imageUrl || null}
                                glowClass={mergeResult?.imageUrl ? 'shadow-glow-primary' : ''}
                                downloadUrl={mergeResult?.imageUrl}
                            >
                                {isLoading && (
                                    <div role="status" className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-text transition-opacity duration-300">
                                        <Spinner />
                                        <span className="text-lg font-medium">{currentLoadingMessage}</span>
                                    </div>
                                )}
                                {mergeResult && !mergeResult.imageUrl && !isLoading && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-text p-4 text-center">
                                        <span className="text-lg font-semibold">Could not generate image.</span>
                                        <span className="text-sm text-subtle">{mergeResult.text || 'The AI may have refused the request.'}</span>
                                    </div>
                                )}
                            </ImageCard>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};