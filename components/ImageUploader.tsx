import React, { useCallback, useState } from 'react';
import { IconUpload } from './icons/IconUpload';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
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

  return (
    <div className="w-full max-w-2xl text-center flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in">
       <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text">Online AI Photo Editor</h2>
            <p className="text-subtle mt-3 max-w-lg mx-auto">Edit photos online for free using the power of AI. Upload any image, then simply describe your desired changes in plain text. Remove objects, change backgrounds, or add new elements instantly. No account needed.</p>
        </div>
      <label
        htmlFor="image-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative block w-full rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ease-in-out cursor-pointer group
        ${isDragging ? 'border-primary scale-105 bg-surface' : 'border-muted hover:border-primary/70 bg-surface/50'}`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
            <IconUpload className="mx-auto h-12 w-12 text-muted group-hover:text-primary transition-colors duration-300" />
            <div className="text-text">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-subtle">Supports: PNG, JPG, GIF</p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="sr-only"
          accept="image/png, image/jpeg, image/gif"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};