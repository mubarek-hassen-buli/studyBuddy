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

  // Generate embeddings for a batch of texts
  // Note: Gemini API might have rate limits or batch limits.
  // We'll iterate for now to be safe, or use batch methods if available in SDK.
  embedBatch: async (texts: string[]): Promise<number[][]> => {
      const embeddings: number[][] = [];
      for (const text of texts) {
          // Add small delay to avoid rate limits if necessary
          embeddings.push(await embeddingService.embedText(text));
      }
      return embeddings;
  }
};
