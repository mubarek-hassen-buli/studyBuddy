import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export const embeddingService = {
  // Generate embedding for a single text
  embedText: async (text: string): Promise<number[]> => {
    try {
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      console.error("Error generating embedding:", error);
      throw error;
    }
  },

  // Generate embeddings for a batch of texts in parallel
  embedBatch: async (texts: string[]): Promise<number[][]> => {
    return await Promise.all(texts.map(text => embeddingService.embedText(text)));
  }
};
