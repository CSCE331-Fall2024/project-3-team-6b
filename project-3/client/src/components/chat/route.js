const express = require('express');
const { ChatOpenAI } = require('@langchain/openai');
const { OpenAIEmbeddings } = require('@langchain/embeddings');
const { FAISS } = require('@langchain/vectorstores');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Missing OpenAI API Key');
}

const app = express();
app.use(cors());
app.use(express.json());

const llm = new ChatOpenAI({
  openAIApiKey: apiKey,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

let vectorStore;

// Function to load and embed documents
async function loadDocumentsAndCreateStore() {
  const docs = [];
  const directory = path.join(__dirname, 'documents');

  if (!fs.existsSync(directory)) {
    console.error('Documents directory does not exist:', directory);
    return;
  }

  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (file.endsWith('.pdf')) {
      const filePath = path.join(directory, file);
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        docs.push(pdfData.text);
        console.log(`Loaded document: ${file}`);
      } catch (error) {
        console.error(`Error loading document ${file}:`, error);
      }
    }
  }

  if (docs.length === 0) {
    console.error('No documents found to embed.');
    return;
  }

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
  vectorStore = await FAISS.fromTexts(docs, embeddings);
  console.log('Vector store created successfully');
}

// Function to retrieve the most relevant document chunk
async function retrieveRelevantDocument(query) {
  if (!vectorStore) {
    console.error('Vector store is not initialized');
    return null;
  }

  const results = await vectorStore.similaritySearch(query, 3); // Get top 3 relevant chunks
  return results.map(result => result.text).join('\n');
}

// Function to get a response from OpenAI using the retrieved documents
async function getResponse(prompt) {
  const context = await retrieveRelevantDocument(prompt);
  
  if (!context) {
    return 'I don’t know';
  }

  const augmentedPrompt = `Based on the following information, answer the query:\n\n${context}\n\nQuery: ${prompt}`;
  try {
    const response = await llm.call(augmentedPrompt);
    return response.trim();
  } catch (error) {
    console.error('Error getting response from OpenAI:', error);
    return 'I don’t know';
  }
}

// Endpoint to handle user queries
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await getResponse(prompt);
    return res.json({ response });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Load documents and create vector store on startup
(async () => {
  await loadDocumentsAndCreateStore();
})();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
