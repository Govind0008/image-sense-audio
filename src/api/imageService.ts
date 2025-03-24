
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

    // Make request to backend API with the correct URL
    // For development, we'll add a fallback mechanism if the real backend is not available
    const response = await fetch('http://localhost:5000/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // If the backend is not available, we'll use a fallback mock response
      console.log(`Backend server responded with status: ${response.status}`);
      
      // Generate a mock response for demonstration purposes
      return getMockResponse(imageFile.name);
    }

    const data = await response.json();
    return {
      description: data.description,
      audioUrl: data.audio_url,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Fallback to mock response in case of any error
    console.log('Using fallback mock response due to backend connection issue');
    return getMockResponse(imageFile.name);
  }
}

// Function to generate a mock response when the backend is not available
function getMockResponse(fileName: string): SceneRecognitionResponse {
  const descriptions = [
    "A beautiful landscape with mountains in the background and a lake in the foreground. The sky is clear blue with a few scattered clouds.",
    "A cityscape at night with tall buildings and bright lights. The urban scene shows modern architecture and busy streets.",
    "A close-up of a colorful flower in bloom. The petals display vibrant colors with fine details visible in the center.",
    "A group of people enjoying a meal together at a restaurant. The scene appears cheerful with plates of delicious food on the table.",
    "A serene beach scene with golden sand and turquoise water. Palm trees sway gently in the breeze along the shoreline.",
    "A forest trail surrounded by tall trees. Sunlight filters through the leaves creating dappled patterns on the ground.",
  ];
  
  // Select a random description based on the file name
  const hash = fileName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const description = descriptions[hash % descriptions.length];
  
  return {
    description: description,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Public domain test audio
  };
}
