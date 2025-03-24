
# Image Sense Audio - Final Year Project

This project uses AI to analyze images, describe what it sees in text format, and generate audio narration based on that description.

## Features

- Image upload with drag-and-drop support
- AI scene recognition
- Editable text description
- Audio narration of the scene
- Beautiful UI with animations

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Python Flask
- **AI**: Basic image analysis using PIL (Python Imaging Library)

## How to Run

### Backend (Python Flask)

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```
   python app.py
   ```

The backend will run on http://localhost:5000

### Frontend (React)

1. In a new terminal, navigate to the project root

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

The frontend will run on http://localhost:5173

## Note on Audio Generation

The current implementation provides a simulated audio experience. In a production environment, you would integrate with a Text-to-Speech service such as:

- Google Cloud Text-to-Speech
- Amazon Polly
- Microsoft Azure Speech Service

## Future Improvements

- Integrate a production-ready Text-to-Speech API
- Improve image analysis with a proper AI model (e.g., Hugging Face transformers)
- Add user accounts and history
- Implement more advanced scene recognition
