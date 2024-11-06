from flask import Flask, request, jsonify
# from langchain.llms import OpenAI
# from dotenv import load_dotenv
# import os

# load_dotenv()

app = Flask(__name__)

# llm = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # response = llm(prompt)
    return jsonify({"response" : "hello generate"})

    # return jsonify({"response": response})

@app.route('/hi', methods=['GET'])
def hello_world():
    response = "hello world"
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
