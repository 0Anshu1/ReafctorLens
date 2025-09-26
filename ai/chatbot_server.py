import os
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

from dotenv import load_dotenv
load_dotenv()
app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

PLATFORM_INFO = (
    "RefactorLens is an AI/ML-powered code refactoring analysis tool. "
    "It analyzes legacy and modern code, detects refactoring patterns, scores impact, and flags risks. "
    "It supports multiple languages and integrates Python ML for advanced analysis."
)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get('message', '')
    prompt = f"{PLATFORM_INFO}\nUser: {user_message}\nAI:"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        reply = (
            data.get('candidates', [{}])[0]
            .get('content', {})
            .get('parts', [{}])[0]
            .get('text', 'Sorry, I could not answer that.')
        )
        return jsonify({"reply": reply})
    except Exception as e:
        print("Gemini API error:", e)
        if hasattr(e, 'response') and e.response is not None:
            print("Gemini API response:", e.response.text)
        return jsonify({"reply": "Sorry, there was an error connecting to Gemini."})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
