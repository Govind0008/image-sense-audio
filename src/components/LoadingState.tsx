
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Processing your image..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card rounded-xl animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin-slow"></div>
      </div>
      <p className="text-center text-lg font-medium text-foreground/80 animate-pulse-subtle">
        {message}
      </p>
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
    </div>
  );
};

export default LoadingState;
