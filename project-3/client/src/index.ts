// // server/src/index.ts

// import express, { Request, Response, NextFunction, Express } from 'express';
// import cors from 'cors';
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
// import { loadQAStuffChain } from "langchain/chains";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { Document } from "@langchain/core/documents";
// import path from 'path';
// import "dotenv/config";



// const app: Express = express();

// // Debug: Log startup
// console.log('Starting server...');
// console.log('Current directory:', __dirname);

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());

// const PORT: number = parseInt(process.env.PORT || '3001', 10);

// async function loadDocument(filePath: string) {
//   console.log(`Attempting to load document: ${filePath}`);
//   try {
//     const fileExtension = path.extname(filePath).toLowerCase();
//     console.log(`File extension: ${fileExtension}`);
    
//     let loader;
//     switch (fileExtension) {
//       case '.txt':
//         loader = new TextLoader(filePath);
//         break;
//       case '.pdf':
//         loader = new PDFLoader(filePath, { splitPages: false });
//         break;
//       default:
//         throw new Error('Unsupported file type');
//     }

//     const docs = await loader.load();
//     console.log(`Successfully loaded document with ${docs.length} pages/sections`);
//     return docs;
//   } catch (error) {
//     console.error(`Error loading document ${filePath}:`, error);
//     return [];
//   }
// }

// async function processQuery(question: string): Promise<string> {
//   console.log('Processing query:', question);
//   try {
//     const nutritionPdfPath = path.join(__dirname, '../../client/src/utils/panda_express_nutrition.pdf');
//     const nutritionTextPath = path.join(__dirname, '../../client/src/utils/panda_express_nutrition.txt');
    
//     console.log('Attempting to load documents from:');
//     console.log('PDF Path:', nutritionPdfPath);
//     console.log('Text Path:', nutritionTextPath);

//     const [pdfDocs, textDocs] = await Promise.all([
//       loadDocument(nutritionPdfPath),
//       loadDocument(nutritionTextPath)
//     ]);

//     if (!pdfDocs.length && !textDocs.length) {
//       console.error('No documents were loaded successfully');
//       return "I'm having trouble accessing the menu information. Please try again later.";
//     }

//     if (!process.env.OPENAI_API_KEY) {
//       console.error('OpenAI API key is missing');
//       throw new Error('OpenAI API key is not configured');
//     }

//     const allDocs = [...pdfDocs, ...textDocs];
    
//     const vectorStore = await MemoryVectorStore.fromDocuments(
//       allDocs,
//       new OpenAIEmbeddings({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//       })
//     );

//     const searchResponse = await vectorStore.similaritySearch(question, 3);
//     const contextText = searchResponse
//       .map(item => item.pageContent)
//       .join('\n\n');

//     const llm = new OpenAI({ 
//       modelName: "gpt-4",
//       openAIApiKey: process.env.OPENAI_API_KEY,
//       temperature: 0.7,
//     });

//     const chain = loadQAStuffChain(llm);
//     const result = await chain.invoke({
//       input_documents: [new Document({ pageContent: contextText })],
//       question: `You are a helpful Panda Express assistant. Using the provided context, answer the following question: ${question}. If the answer isn't in the context, say "I don't have information about that, but I'd be happy to help you with our menu items, nutrition information, or ingredients."`,
//     });

//     return result.text;
//   } catch (error) {
//     console.error('Error in processQuery:', error);
//     throw error;
//   }
// }

// // Health check endpoint
// app.get('/health', (_req: Request, res: Response) => {
//   console.log('Health check endpoint hit');
//   res.json({ 
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     documentPaths: {
//       pdf: path.join(__dirname, '../../client/src/utils/panda_express_nutrition.pdf'),
//       text: path.join(__dirname, '../../client/src/utils/panda_express_nutrition.txt')
//     }
//   });
// });

// // Chat endpoint
// app.post('/generate', async (req: Request, res: Response) => {
//   console.log('Generate endpoint hit with body:', req.body);
//   try {
//     const { prompt } = req.body;
//     if (!prompt) {
//       return res.status(400).json({ error: 'Prompt is required' });
//     }
//     const response = await processQuery(prompt);
//     return res.json({ response });
//   } catch (error) {
//     console.error('Error in generate endpoint:', error);
//     return res.status(500).json({ 
//       error: 'Internal server error',
//       message: error instanceof Error ? error.message : 'An unexpected error occurred'
//     });
//   }
// });

// // Error handling middleware
// app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//   console.error('Error handler caught:', err);
//   res.status(500).json({ 
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
//   });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
//   console.log('Debug endpoints:');
//   console.log(`- Health check: http://localhost:${PORT}/health`);
//   console.log(`- Chat endpoint: http://localhost:${PORT}/generate`);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
// });

// export default app;