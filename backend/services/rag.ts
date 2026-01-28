import { GoogleGenerativeAI } from "@google/generative-ai";
import { embeddingService } from "./embedding";
import { qdrantService } from "./qdrant";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });

interface RetrievalResult {
    content: string;
    metadata: any;
    score: number;
}

export const ragService = {
  // 1. Retrieve relevant context
  retrieveContext: async (
      collectionName: string, 
      query: string, 
      limit: number = 5, 
      threshold: number = 0.5
    ): Promise<RetrievalResult[]> => {
      
    // Generate query embedding
    const queryVector = await embeddingService.embedText(query);

    // Search Qdrant
    const searchResults = await qdrantService.search(collectionName, queryVector, limit, threshold);

    return searchResults.map(res => ({
        content: res.payload?.content as string,
        metadata: res.payload,
        score: res.score,
    }));
  },

  // 2. Generate grounded response
  generateResponse: async (query: string, contextChunks: RetrievalResult[]): Promise<string> => {
      if (contextChunks.length === 0) {
          return "I cannot answer this question because it is not covered in your uploaded study materials.";
      }

      const contextText = contextChunks.map((chunk, i) => `[Source ${i+1}]: ${chunk.content}`).join("\n\n");

      const systemPrompt = `
You are a specialized AI StudyBuddy. Your goal is to help the student learn based ONLY on the provided study materials.

STRICT RULES:
1. You must answer the user's question using ONLY the provided context below.
2. If the answer is not found in the context, you must strictly say: "I cannot answer this question based on the provided materials."
3. Do not use outside knowledge or general internet information.
4. Cite your sources using [Source X] notation when referring to specific information.

CONTEXT:
${contextText}
`;

      const result = await model.generateContent({
          contents: [
              { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + query }] }
          ]
      });

      return result.response.text();
  },

  // 3. Stream grounded response
  streamResponse: async function* (query: string, contextChunks: RetrievalResult[]) {
      if (contextChunks.length === 0) {
          yield "I cannot answer this question because it is not covered in your uploaded study materials.";
          return;
      }

      const contextText = contextChunks.map((chunk, i) => `[Source ${i+1}]: ${chunk.content}`).join("\n\n");

      const systemPrompt = `
You are a specialized AI StudyBuddy. Your goal is to help the student learn based ONLY on the provided study materials.

STRICT RULES:
1. You must answer the user's question using ONLY the provided context below.
2. If the answer is not found in the context, you must strictly say: "I cannot answer this question based on the provided materials."
3. Do not use outside knowledge or general internet information.
4. Cite your sources using [Source X] notation when referring to specific information.

CONTEXT:
${contextText}
`;

      const result = await model.generateContentStream({
          contents: [
              { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + query }] }
          ]
      });

      for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          yield chunkText;
      }
  }
};
