// server/src/aiChatServer.ts
import express from 'express';
import cors from 'cors';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import path from 'path';

const AI_PORT = 3001;

export function startAIChatServer() {
  const aiApp = express();

  // CORS for AI server
  aiApp.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  aiApp.use(express.json());

  // AI Chat Functions
  async function loadDocument(filePath: string) {
    console.log(`Attempting to load document: ${filePath}`);
    try {
      const fileExtension = path.extname(filePath).toLowerCase();
      let loader;
      switch (fileExtension) {
        case '.txt':
          loader = new TextLoader(filePath);
          break;
        case '.pdf':
          loader = new PDFLoader(filePath, { splitPages: false });
          break;
        default:
          throw new Error('Unsupported file type');
      }
      const docs = await loader.load();
      console.log(`Successfully loaded document with ${docs.length} pages/sections`);
      return docs;
    } catch (error) {
      console.error(`Error loading document ${filePath}:`, error);
      return [];
    }
  }

  async function processQuery(question: string): Promise<string> {
    console.log('Processing query:', question);
    try {
      const nutritionPdfPath = path.join(__dirname, '../../client/src/utils/panda_express_nutrition.pdf');
      const nutritionTextPath = path.join(__dirname, '../../client/src/utils/panda_express_nutrition.txt');
      
      console.log('Loading documents from:', { nutritionPdfPath, nutritionTextPath });
  
      const [pdfDocs, textDocs] = await Promise.all([
        loadDocument(nutritionPdfPath),
        loadDocument(nutritionTextPath)
      ]);
  
      if (!pdfDocs.length && !textDocs.length) {
        console.error('No documents were loaded successfully');
        return "I'm having trouble accessing the menu information. Please try again later.";
      }
  
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }
  
      // Split content into smaller chunks
      const allDocs = [...pdfDocs, ...textDocs];
      const maxTokensPerChunk = 4000;
      let chunks: any[] = [];
      
      allDocs.forEach(doc => {
        const content = doc.pageContent;
        const estimatedTokens = content.length / 4;
        
        if (estimatedTokens > maxTokensPerChunk) {
          const numChunks = Math.ceil(estimatedTokens / maxTokensPerChunk);
          const chunkSize = Math.ceil(content.length / numChunks);
          
          for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = start + chunkSize;
            chunks.push({ pageContent: content.slice(start, end), metadata: doc.metadata });
          }
        } else {
          chunks.push(doc);
        }
      });
      
      const vectorStore = await MemoryVectorStore.fromDocuments(
        chunks,
        new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        })
      );
  
      const searchResponse = await vectorStore.similaritySearch(question, 2);
      const contextText = searchResponse
        .map(item => item.pageContent)
        .join('\n\n')
        .slice(0, 6000);
  
      const llm = new OpenAI({ 
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        maxTokens: 500
      });
  
      const chain = loadQAStuffChain(llm);
      const result = await chain.invoke({
        input_documents: [new Document({ pageContent: contextText })],
        question: `You are a helpful Panda Express assistant. Using the provided context, answer the following question: ${question}. If the answer isn't in the context, say "I don't have information about that, but I'd be happy to help you with our menu items, nutrition information, or ingredients."`,
      });
  
      return result.text;
    } catch (error) {
      console.error('Error in processQuery:', error);
    //   if (error.message.includes('maximum context length')) {
    //     return "I apologize, but I'm having trouble processing the menu information. Let me try to help you with a more specific question about our menu items, nutrition information, or ingredients.";
    //   }
      throw error;
    }
  }

  // AI Chat endpoint
  aiApp.post('/generate', async (req, res) => {
    console.log('Generate endpoint hit with body:', req.body);
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
      const response = await processQuery(prompt);
      return res.json({ response });
    } catch (error) {
      console.error('Error in generate endpoint:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  });

  // Health check for AI server
  aiApp.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  });

  // Start AI server
  aiApp.listen(AI_PORT, () => {
    console.log(`AI Chat server running on port ${AI_PORT}`);
    console.log('AI Chat endpoint available at http://localhost:3001/generate');
  });
}