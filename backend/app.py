
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import uuid
import base64
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create uploads folder if it doesn't exist
if not os.path.exists('uploads'):
    os.makedirs('uploads')

# Free AI model - Simple scene classifier using PIL
def analyze_scene(image_path):
    # Open image and get basic info
    try:
        img = Image.open(image_path)
        width, height = img.size
        format = img.format
        mode = img.mode
        
        # Simple analysis of image properties
        brightness = 0
        colors = {}
        
        # Sample pixels to determine basic properties
        for x in range(0, width, 10):
            for y in range(0, height, 10):
                pixel = img.getpixel((x, y))
                if isinstance(pixel, tuple):
                    # RGB or RGBA image
                    r, g, b = pixel[0:3]
                    brightness += (r + g + b) / 3
                    color_key = (r//50, g//50, b//50)
                    colors[color_key] = colors.get(color_key, 0) + 1
                else:
                    # Grayscale
                    brightness += pixel
        
        # Analyze dominant colors
        color_count = len(colors)
        max_color = max(colors.items(), key=lambda x: x[1])[0] if colors else (0, 0, 0)
        
        # Determine scene type based on simple heuristics
        scene_type = ""
        description = ""
        
        if brightness / (width * height / 100) > 150:
            scene_type = "bright"
            if max_color[2] > max_color[0] and max_color[2] > max_color[1]:
                if color_count > 20:
                    description = "A bright outdoor scene with a blue sky. There may be trees, buildings, or people visible."
                else:
                    description = "A bright blue sky with minimal other elements."
            elif max_color[1] > max_color[0] and max_color[1] > max_color[2]:
                description = "A bright natural landscape with lots of greenery, possibly a forest or garden."
            else:
                description = "A bright, warm-toned scene, possibly an indoor space or sunset."
        else:
            scene_type = "dark"
            if color_count > 20:
                description = "A low-light scene with multiple elements. It could be an indoor space, night scene, or a dark landscape."
            else:
                description = "A dark, minimalist scene with few distinguishable elements."
        
        # Add image details to description
        description += f" The image is {width}x{height} pixels, in {format} format."
        
        return description
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return "Unable to analyze this image. It appears to be a photograph, but I can't determine the specific content."

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    try:
        # Generate unique filename and save
        unique_id = str(uuid.uuid4())
        file_extension = os.path.splitext(image_file.filename)[1]
        filename = f"uploads/{unique_id}{file_extension}"
        image_file.save(filename)
        
        # Analyze the image
        description = analyze_scene(filename)
        
        # Generate static audio URL (in a real app, you'd use a TTS service)
        audio_url = f"http://localhost:5000/static/audio/{unique_id}.mp3"
        
        # For demo: Create a dummy audio file (in real app, this would be TTS)
        # Simulating audio by just returning path, as we don't have TTS here
        
        return jsonify({
            'description': description,
            'audio_url': audio_url
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Simple route to return a dummy audio file
@app.route('/static/audio/<filename>', methods=['GET'])
def get_audio(filename):
    # This is a dummy endpoint that would actually generate or 
    # serve the audio file in a real implementation
    # For a real implementation, you would use a proper TTS service
    # and either generate and save the audio or stream it
    
    # Return a 404 to indicate this is a demonstration
    return jsonify({'error': 'This is a dummy audio endpoint. In a real implementation, this would serve an audio file.'}), 404

if __name__ == '__main__':
    app.run(debug=True)
