// client/src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// Initialize OpenAI
const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.2,
});

// Initialize vector store
let vectorStore: MemoryVectorStore | null = null;

async function initializeVectorStore() {
  if (vectorStore) return vectorStore;

  // Load PDF
  const loader = new PDFLoader('public/data/panda-express-menu.pdf');
  const docs = await loader.load();

  // Split documents
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  // Create vector store
  vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    })
  );

  return vectorStore;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Initialize or get vector store
    const store = await initializeVectorStore();

    // Create chain
    const chain = ConversationalRetrievalQAChain.fromLLM(
      chat,
      store.asRetriever(),
      {
        returnSourceDocuments: true,
        questionGeneratorTemplate:
          'Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question that captures all relevant context from the conversation. Keep the rephrased question simple, clear and focused on Panda Express menu items and information.',
        qaTemplate:
          'You are a helpful Panda Express assistant. Use the following pieces of context to answer the question at the end. If you don\'t know the answer, just say that you don\'t know, don\'t try to make up an answer. Keep your answers conversational and friendly.\n\nContext: {context}\n\nQuestion: {question}\n\nHelpful Answer:',
      }
    );

    // Get response
    const response = await chain.call({
      question: message,
      chat_history: [],
    });

    return NextResponse.json({ response: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}