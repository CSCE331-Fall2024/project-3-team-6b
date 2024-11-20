from flask import Flask, request, jsonify
from langchain.document_loaders import PyMuPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

def load_documents():
    docs = []
    directory = os.path.join(os.path.dirname(__file__), 'documents')

    if not os.path.exists(directory):
        print("Directory does not exist:", directory)
        return docs

    for filename in os.listdir(directory):
        if filename.endswith('.pdf'):
            file_path = os.path.join(directory, filename)
            try:
                loader = PyMuPDFLoader(file_path)
                documents = loader.load()
                docs.extend(documents)
                print(f"Loaded {filename}")
            except Exception as e:
                print(f"Error loading {filename}: {e}")

    if not docs:
        print("No PDF documents found or failed to load!")
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = text_splitter.split_documents(docs)
    print(f"Loaded {len(split_docs)} document chunks.")
    return split_docs

def create_vector_store(docs):
    if not docs:
        raise ValueError("No documents to embed!")
    embeddings = OpenAIEmbeddings(openai_api_key=api_key)
    texts = [doc.page_content for doc in docs]
    if not texts:
        raise ValueError("No text found in documents!")
    vector_store = FAISS.from_texts(texts, embeddings)
    return vector_store

docs = load_documents()
vector_store = create_vector_store(docs)

llm = OpenAI(api_key=api_key)
retriever = vector_store.as_retriever()

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    chain_type="stuff"
)

@app.route('/generate', methods=['POST'])
def generate_response():
    data = request.get_json()
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        result = qa_chain({"query": prompt})
        response = result['result']
        if not response.strip():
            return jsonify({"response": "I don't know"}), 200
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error: {e}")  
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
