import React, { useCallback, useState } from 'react';
import { IconUpload } from './icons/IconUpload';
import { IconPlus } from './icons/IconPlus';
import { IconArrowRight } from './icons/IconArrowRight';
import { IconTrash } from './icons/IconTrash';

interface UploadSlotProps {
  onImageUpload: (file: File) => void;
  onImageDelete: () => void;
  slotNumber: number;
  imageUrl: string | null;
}

const UploadSlot = ({ onImageUpload, onImageDelete, slotNumber, imageUrl }: UploadSlotProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onImageUpload(e.dataTransfer.files[0]);
      }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };
  
  const inputId = `image-upload-${slotNumber}`;

  return (
    <label
        htmlFor={inputId}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative block w-full max-w-sm aspect-square rounded-2xl border-2 border-dashed text-center transition-all duration-300 ease-in-out cursor-pointer group
        ${isDragging ? 'border-primary scale-105 bg-surface' : 'border-muted hover:border-primary/70 bg-surface/50'}
        ${imageUrl ? 'p-0 overflow-hidden border-solid border-primary/50' : 'p-12 flex items-center justify-center'}`}
      >
        {imageUrl ? (
            <div className="relative w-full h-full group">
                <img src={imageUrl} alt={`Source ${slotNumber} for AI image merging`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IconUpload className="w-10 h-10 text-text" />
                    <span className="text-text font-semibold">Change Image</span>
                </div>
                 <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onImageDelete();
                    }}
                    className="absolute top-3 right-3 p-2 bg-background/70 backdrop-blur-sm rounded-full text-subtle hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 z-10"
                    aria-label="Remove image"
                >
                    <IconTrash className="w-5 h-5" />
                </button>
            </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
              <IconUpload className="mx-auto h-12 w-12 text-muted group-hover:text-primary transition-colors duration-300" />
              <div className="text-text">
                  <span className="font-semibold">Upload Image {slotNumber}</span>
                  <p className="text-xs text-subtle mt-1">or drag and drop</p>
              </div>
          </div>
        )}
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
        />
      </label>
  );
};


interface DualImageUploaderProps {
  onImageUpload: (file: File, slot: 1 | 2) => void;
  onImageDelete: (slot: 1 | 2) => void;
  imageUrl1: string | null;
  imageUrl2: string | null;
  onComplete: () => void;
}

export const DualImageUploader = ({ onImageUpload, onImageDelete, imageUrl1, imageUrl2, onComplete }: DualImageUploaderProps) => {
  const bothImagesUploaded = imageUrl1 && imageUrl2;

  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center p-4 sm:p-8 mx-auto">
       <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Free Online AI Image Merger</h2>
            <p className="text-subtle mt-3 max-w-lg mx-auto">Combine two images into one with our free AI tool. Upload your photos, describe how you want to blend them, and our AI will generate a unique, seamless creation for you online in seconds.</p>
        </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
        <UploadSlot onImageUpload={(file) => onImageUpload(file, 1)} onImageDelete={() => onImageDelete(1)} slotNumber={1} imageUrl={imageUrl1} />
        <IconPlus className="w-10 h-10 text-muted flex-shrink-0" />
        <UploadSlot onImageUpload={(file) => onImageUpload(file, 2)} onImageDelete={() => onImageDelete(2)} slotNumber={2} imageUrl={imageUrl2} />
      </div>

      {bothImagesUploaded && (
          <button 
            onClick={onComplete}
            className="mt-12 flex items-center gap-3 text-white font-semibold rounded-lg text-lg px-8 py-4 text-center transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-secondary hover:shadow-glow-primary animate-fade-in bg-[length:200%_100%] hover:bg-[position:100%_0]"
          >
              <span>Let's Get Creative</span>
              <IconArrowRight className="w-6 h-6" />
          </button>
      )}
    </div>
  );
};