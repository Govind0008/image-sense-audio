
import React, { useState } from 'react';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';
import SceneResult from '@/components/SceneResult';
import AudioPlayer from '@/components/AudioPlayer';
import LoadingState from '@/components/LoadingState';
import { analyzeImage } from '@/api/imageService';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sceneText, setSceneText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [userText, setUserText] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setSceneText('');
      setAudioUrl(null);
      setUserText('');
      setUsingMockData(false);
      
      // Simulate a small delay to show loading state animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await analyzeImage(file);
      
      // Check if we're using mock data (this is set inside the analyzeImage function)
      const isMockData = result.audioUrl.includes('soundhelix');
      setUsingMockData(isMockData);
      
      setSceneText(result.description);
      setUserText(result.description);
      setAudioUrl(result.audioUrl);
      
      if (isMockData) {
        toast.info('Using demo mode', {
          description: 'Connection to backend failed. Using demo data instead.',
        });
      } else {
        toast.success('Image analysis complete!', {
          description: 'Scene recognized and audio generated successfully.',
        });
      }
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
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 md:py-20 bg-gradient-to-br from-purple-100 to-background">
      <header className="w-full max-w-4xl mb-12 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
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
          {usingMockData && (
            <Alert variant="default" className="bg-amber-50 border-amber-200 mb-6">
              <InfoIcon className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Demo Mode Active</AlertTitle>
              <AlertDescription className="text-amber-600">
                The backend server connection failed. Using simulated data for demonstration purposes.
              </AlertDescription>
            </Alert>
          )}
          
          <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <SceneResult sceneText={sceneText} isLoading={isLoading} />
              
              {sceneText && (
                <div className="w-full animate-fade-in">
                  <div className="glass-card rounded-2xl p-6 relative bg-purple-100/50">
                    <h3 className="text-lg font-medium mb-3 bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">Edit Description</h3>
                    <Textarea 
                      value={userText} 
                      onChange={handleTextChange}
                      placeholder="You can edit the AI-generated description here..."
                      className="min-h-[120px] bg-white/50 backdrop-blur-sm border border-purple-200 focus:border-purple-400 transition-all duration-300"
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
