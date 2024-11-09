from flask import Flask, request, jsonify
from langchain_openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

api_key = os.getenv("OPENAI_API_KEY")
llm = OpenAI(api_key=api_key)

@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        response = llm.invoke(prompt)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
