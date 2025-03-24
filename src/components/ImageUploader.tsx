
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      onImageUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full mb-8 animate-slide-down" style={{ animationDelay: "200ms" }}>
      <div 
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          isDragging 
            ? 'bg-primary/10 border-primary border-2 shadow-lg' 
            : 'glass-card border'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isLoading}
        />
        
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          {previewUrl ? (
            <div className="relative w-full h-full flex justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-[300px] rounded-lg object-contain animate-scale-in shadow-lg" 
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                {isDragging ? (
                  <Upload className="w-10 h-10 text-primary animate-bounce" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-primary/70" />
                )}
              </div>
              <h3 className="text-xl font-medium mb-2">Upload an image</h3>
              <p className="text-muted-foreground">
                Drag & drop an image here, or click to select
              </p>
              <div className="mt-4">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  JPG, PNG, WebP files supported
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
