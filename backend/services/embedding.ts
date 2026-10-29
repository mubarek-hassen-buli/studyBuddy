import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

export const embeddingService = {
  // Generate embedding for a single text
  embedText: async (text: string): Promise<number[]> => {
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.embedContent(text);
        return result.embedding.values;
      } catch (error: any) {
        if (attempt < maxRetries) {
          console.warn(`[Embedding] Retry ${attempt + 1}/${maxRetries} for single text embedding...`);
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        console.error("Error generating embedding:", error);
        throw error;
      }
    }
    throw new Error("Failed to generate embedding after retries");
  },

  // Generate embeddings for a batch of texts using Gemini's native batchEmbedContents API in chunks of up to 30
  embedBatch: async (texts: string[]): Promise<number[][]> => {
    if (texts.length === 0) return [];

    const CHUNK_SIZE = 30; // Safe batch size avoiding payload limits & socket exhaustion
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
      const slice = texts.slice(i, i + CHUNK_SIZE);
      const batchRequests = slice.map((text) => ({
        content: { role: "user", parts: [{ text }] },
      }));

      const maxRetries = 2;
      let success = false;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const res = await model.batchEmbedContents({
            requests: batchRequests,
          });

          if (res?.embeddings && res.embeddings.length === slice.length) {
            for (const item of res.embeddings) {
              allEmbeddings.push(item.values);
            }
            success = true;
            break;
          } else {
            throw new Error(`Batch returned ${res?.embeddings?.length || 0} embeddings for ${slice.length} requests`);
          }
        } catch (err: any) {
          if (attempt < maxRetries) {
            console.warn(`[Embedding Batch] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${(attempt + 1) * 1.5}s...`, err?.message || err);
            await new Promise((r) => setTimeout(r, (attempt + 1) * 1500));
          } else {
            console.error(`[Embedding Batch] Chunk ${i}-${i + slice.length} failed after ${maxRetries + 1} attempts. Falling back to sequential embedding...`, err?.message || err);
            // Fallback: embed slice one-by-one with delays
            for (const t of slice) {
              const single = await embeddingService.embedText(t);
              allEmbeddings.push(single);
              await new Promise((r) => setTimeout(r, 200));
            }
            success = true;
          }
        }
      }
    }

    return allEmbeddings;
  },
};
