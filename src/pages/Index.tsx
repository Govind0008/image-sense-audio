
import React, { useState } from 'react';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';
import SceneResult from '@/components/SceneResult';
import AudioPlayer from '@/components/AudioPlayer';
import LoadingState from '@/components/LoadingState';
import { analyzeImage } from '@/api/imageService';
import { Textarea } from '@/components/ui/textarea';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sceneText, setSceneText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [userText, setUserText] = useState('');

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setSceneText('');
      setAudioUrl(null);
      setUserText('');
      
      // Simulate a small delay to show loading state animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await analyzeImage(file);
      
      setSceneText(result.description);
      setUserText(result.description);
      setAudioUrl(result.audioUrl);
      
      toast.success('Image analysis complete!', {
        description: 'Scene recognized and audio generated successfully.',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Analysis failed', {
        description: 'There was an error processing your image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 md:py-20">
      <header className="w-full max-w-4xl mb-12 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gradient">
            Image Sense Audio
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Upload an image and our AI will analyze the scene, describe what it sees,
            and generate audio narration for you.
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl glass-card rounded-3xl p-6 md:p-8 shadow-xl animated-border">
        <div className="container mx-auto space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <SceneResult sceneText={sceneText} isLoading={isLoading} />
              
              {sceneText && (
                <div className="w-full animate-fade-in">
                  <div className="glass-card rounded-2xl p-6 relative">
                    <h3 className="text-lg font-medium mb-3 text-gradient">Edit Description</h3>
                    <Textarea 
                      value={userText} 
                      onChange={handleTextChange}
                      placeholder="You can edit the AI-generated description here..."
                      className="min-h-[120px] bg-white/50 backdrop-blur-sm border border-primary/20 focus:border-primary/50 transition-all duration-300"
                    />
                  </div>
                </div>
              )}
              
              <AudioPlayer audioUrl={audioUrl} isLoading={isLoading} />
            </>
          )}
        </div>
      </main>
      
      <footer className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
        <p>Final Year Project — Image Scene Recognition with Audio Generation</p>
      </footer>
    </div>
  );
};

export default Index;
