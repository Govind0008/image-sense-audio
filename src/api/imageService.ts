
// API service for connecting to the Python backend

export interface SceneRecognitionResponse {
  description: string;
  audioUrl: string;
}

export async function analyzeImage(imageFile: File): Promise<SceneRecognitionResponse> {
  try {
    // Create form data to send the image file
    const formData = new FormData();
    formData.append('image', imageFile);

    // Make request to backend API
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      description: data.description,
      audioUrl: data.audio_url,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
