
import React, { useState, useRef, useEffect } from 'react';
import { Play, Headphones } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  isLoading: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, isLoading }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Reset player when audio URL changes
    if (audioUrl) {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    const calculatedProgress = (current / duration) * 100;
    
    setProgress(calculatedProgress);
  };
  
  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioUrl) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const newProgress = (clickPosition / progressBarWidth) * 100;
    
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };
  
  if (!audioUrl && !isLoading) return null;
  
  return (
    <div className={`w-full transition-all duration-500 ${audioUrl ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: "300ms" }}>
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-lg font-medium mb-3 text-gradient">Audio Description</h3>
        
        <div className="flex items-center space-x-4">
          <button 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              audioUrl && !isLoading
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                : 'bg-primary/30 text-white/50 cursor-not-allowed'
            }`}
            onClick={togglePlay}
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : isPlaying ? (
              <span className="w-3 h-3 bg-white ml-0.5"></span>
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <div className="flex-1 space-y-2">
            <div 
              className="h-2 bg-primary/20 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-foreground/60">
              <span>
                {audioRef.current 
                  ? formatTime(audioRef.current.currentTime) 
                  : '0:00'}
              </span>
              <span>
                {duration ? formatTime(duration) : '0:00'}
              </span>
            </div>
          </div>
        </div>
        
        <audio 
          ref={audioRef}
          src={audioUrl || undefined}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          className="hidden"
        />
        
        {!audioUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Headphones className="w-8 h-8 text-primary/60 mb-2" />
              <p className="text-sm text-foreground/60">No audio available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
