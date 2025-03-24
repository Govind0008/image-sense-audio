from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import base64
import requests
from gtts import gTTS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Google API Key (Replace with your actual key)
API_KEY = "API KEY here akash"

# Create necessary directories
UPLOAD_FOLDER = 'uploads'
AUDIO_FOLDER = 'audio'
for folder in [UPLOAD_FOLDER, AUDIO_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

# Function to analyze image using Google Vision API
def analyze_scene(image_path):
    try:
        # Convert image to base64
        with open(image_path, "rb") as image_file:
            base64_image = base64.b64encode(image_file.read()).decode("utf-8")

        # API Request Payload
        url = f"https://vision.googleapis.com/v1/images:annotate?key={API_KEY}"
        request_payload = {
            "requests": [
                {
                    "image": {"content": base64_image},
                    "features": [
                        {"type": "LABEL_DETECTION"},
                        {"type": "WEB_DETECTION"},  # Fetch additional details
                        {"type": "LANDMARK_DETECTION"}  # Identify famous places
                    ]
                }
            ]
        }

        # Send request to Google Vision API
        response = requests.post(url, json=request_payload)

        if response.status_code == 200:
            data = response.json().get("responses", [])[0]

            # Extract labels
            labels = data.get("labelAnnotations", [])
            label_descriptions = [label["description"] for label in labels[:5]]

            # Extract web-based information
            web_entities = data.get("webDetection", {}).get("webEntities", [])
            web_descriptions = [web["description"] for web in web_entities if "description" in web][:3]

            # Extract landmarks (if any)
            landmarks = data.get("landmarkAnnotations", [])
            landmark_descriptions = [landmark["description"] for landmark in landmarks]

            # Generate a descriptive paragraph
            description = "The image contains "
            if label_descriptions:
                description += ", ".join(label_descriptions) + ". "
            if landmark_descriptions:
                description += f"It appears to be {', '.join(landmark_descriptions)}, which is a famous landmark. "
            if web_descriptions:
                description += f"This image is associated with {', '.join(web_descriptions)}. "
            if not (label_descriptions or landmark_descriptions or web_descriptions):
                description += "an unknown scene."

            return description
        else:
            return f"Error: {response.text}"

    except Exception as e:
        return f"Error analyzing image: {e}"

# Function to convert text to speech using gTTS
def text_to_speech(text, filename):
    try:
        tts = gTTS(text=text, lang="en")
        audio_path = os.path.join(AUDIO_FOLDER, filename)
        tts.save(audio_path)
        return audio_path
    except Exception as e:
        return None

# API Endpoint to analyze image and generate speech
@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    try:
        # Save the uploaded image
        unique_id = str(uuid.uuid4())
        file_extension = os.path.splitext(image_file.filename)[1]
        filename = f"{unique_id}{file_extension}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        image_file.save(filepath)

        # Analyze the image
        description = analyze_scene(filepath)

        # Convert text to speech
        audio_filename = f"{unique_id}.mp3"
        audio_path = text_to_speech(description, audio_filename)

        # Generate URLs for frontend
        audio_url = f"http://localhost:5000/audio/{audio_filename}" if audio_path else None

        return jsonify({
            'description': description,
            'audio_url': audio_url
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API Endpoint to serve audio files
@app.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    return send_from_directory(AUDIO_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
