
import React, { useEffect, useState } from 'react';

interface SceneResultProps {
  sceneText: string;
  isLoading: boolean;
}

const SceneResult: React.FC<SceneResultProps> = ({ sceneText, isLoading }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Reset when scene text changes
    if (sceneText) {
      setDisplayText('');
      setCurrentIndex(0);
      setIsTyping(true);
    }
  }, [sceneText]);
  
  useEffect(() => {
    if (!isTyping || !sceneText || currentIndex >= sceneText.length) {
      if (currentIndex >= sceneText.length && isTyping) {
        setIsTyping(false);
      }
      return;
    }
    
    const typingTimer = setTimeout(() => {
      setDisplayText(prev => prev + sceneText[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, 30); // Adjust typing speed here
    
    return () => clearTimeout(typingTimer);
  }, [currentIndex, isTyping, sceneText]);
  
  if (!sceneText && !isLoading) return null;
  
  return (
    <div className={`w-full transition-all duration-500 ${sceneText ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: "100ms" }}>
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-lg font-medium mb-3 text-gradient">Scene Description</h3>
        
        <div className="relative min-h-[120px]">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-primary/10 rounded w-3/4"></div>
              <div className="h-4 bg-primary/10 rounded w-1/2"></div>
              <div className="h-4 bg-primary/10 rounded w-5/6"></div>
              <div className="h-4 bg-primary/10 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="relative">
              <p className="text-foreground/90 leading-relaxed">
                {displayText}
                {isTyping && <span className="ml-1 inline-block w-2 h-4 bg-primary animate-pulse-subtle"></span>}
              </p>
            </div>
          )}
        </div>
        
        <div className="absolute top-1 right-1">
          <div className="flex space-x-1 p-2">
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            <div className="w-2 h-2 rounded-full bg-primary/70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneResult;
