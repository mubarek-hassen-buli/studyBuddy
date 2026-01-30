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
You are a professional AI StudyBuddy. Your goal is to provide helpful, organized, and accurate information based ONLY on the provided study materials.

STRICT GROUNDING RULES:
1. HELPFUL ASSISTANT: If the user asks for a summary, topic overview, or general questions about the materials, provide a clear and organized answer using the CONTEXT.
2. ORGANIZATION: Use **Bold text**, Bullet points, and clear spacing. Always use double newlines between paragraphs and sections for maximum readability.
3. EXCLUSIVE SOURCE: Use ONLY the provided CONTEXT to answer. Do not use outside knowledge.
4. REFUSAL POLICY: If a question is completely unrelated to the study materials (e.g., "how to cook", "current news"), respond with: "I'm sorry, I can only assist with questions related to your study materials."
5. CITATIONS: Cite your sources using [Source X] notation where X is the number.

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
          yield "I'm sorry, I cannot answer this question because it is not covered in your uploaded study materials.";
          return;
      }

      const contextText = contextChunks.map((chunk, i) => `[Source ${i+1}]: ${chunk.content}`).join("\n\n");

      const systemPrompt = `
You are a professional AI StudyBuddy. Your goal is to provide helpful, organized, and accurate information based ONLY on the provided study materials.

STRICT GROUNDING RULES:
1. HELPFUL ASSISTANT: If the user asks for a summary, topic overview, or general questions about the materials, provide a clear and organized answer using the CONTEXT.
2. ORGANIZATION: Use **Bold text**, Bullet points, and clear spacing. Always use double newlines between paragraphs and sections for maximum readability.
3. EXCLUSIVE SOURCE: Use ONLY the provided CONTEXT to answer. Do not use outside knowledge.
4. REFUSAL POLICY: If a question is completely unrelated to the study materials (e.g., "how to cook", "current news"), respond with: "I'm sorry, I can only assist with questions related to your study materials."
5. CITATIONS: Cite your sources using [Source X] notation where X is the number.

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
