import React, { memo } from 'react';
import { IconPhoto } from './icons/IconPhoto';
import { IconDownload } from './icons/IconDownload';
import { IconTrash } from './icons/IconTrash';

interface ImageCardProps { 
    title: string; 
    imageUrl: string | null; 
    children?: React.ReactNode; 
    glowClass?: string;
    downloadUrl?: string | null;
    onDelete?: () => void;
}

const getFileExtensionFromDataUrl = (dataUrl: string): string => {
    const match = dataUrl.match(/^data:image\/(\w+);base64,/);
    return match?.[1] || 'png';
};

export const ImageCard = memo(({ title, imageUrl, children, glowClass = '', downloadUrl, onDelete }: ImageCardProps) => {
    const altText = title.toLowerCase().includes('original') || title.toLowerCase().includes('source')
        ? `User-provided image: ${title}`
        : `AI-generated result: ${title}`;

    return (
        <div className={`flex-1 flex flex-col bg-surface border border-muted/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${glowClass}`}>
        <div className="bg-surface p-3 border-b border-muted/50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text">{title}</h3>
            <div className="flex items-center gap-2">
                {downloadUrl && (
                <a
                    href={downloadUrl}
                    download={`ai-editor-image.${getFileExtensionFromDataUrl(downloadUrl)}`}
                    className="p-2 bg-background/50 backdrop-blur-sm rounded-full text-subtle hover:text-text hover:bg-background/80 transition-all duration-300"
                    aria-label="Download edited image"
                >
                    <IconDownload className="w-5 h-5" />
                </a>
                )}
                {onDelete && (
                <button
                    onClick={onDelete}
                    className="p-2 bg-background/50 backdrop-blur-sm rounded-full text-subtle hover:text-red-400 hover:bg-red-500/20 transition-all duration-300"
                    aria-label="Delete"
                >
                    <IconTrash className="w-5 h-5" />
                </button>
                )}
            </div>
        </div>
        <div className="aspect-square w-full flex items-center justify-center p-4 relative group">
            {imageUrl ? (
                <img src={imageUrl} alt={altText} className="max-w-full max-h-full object-contain rounded-md" loading="lazy" decoding="async" />
            ) : (
            <div className="text-muted flex flex-col items-center gap-2">
                <IconPhoto className="w-16 h-16"/>
                <span className="text-sm">Your result will appear here</span>
            </div>
            )}
            {children}
        </div>
        </div>
    );
});