
# Image Sense Audio - Backend

This is the Python Flask backend for the Image Sense Audio project, which provides AI-powered image scene recognition and audio generation.

## Setup Instructions

1. Make sure you have Python 3.8+ installed on your system.

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the Flask server:
   ```
   python app.py
   ```

The server will start at http://localhost:5000

## API Endpoints

### POST /analyze
Analyzes an uploaded image to recognize the scene and generate a descriptive audio.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Form data with an "image" field containing the image file

**Response:**
```json
{
  "description": "Text description of the scene",
  "scene_type": "Type of scene detected",
  "audio_url": "URL to the generated audio file"
}
```

## Folder Structure

- `uploads/` - Temporary storage for uploaded images
- `audio/` - Storage for generated audio files

## Notes for Production

In a production environment, you would want to:
1. Implement proper authentication and authorization
2. Use actual computer vision and ML models for image recognition
3. Connect to a proper TTS service for audio generation
4. Store files in a more persistent storage solution (S3, etc.)
5. Add proper error handling and logging
