import { ragService } from "./rag";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
// Using a json model for structured outputs if available, or just prompt engineering with text model
// For flashcards/quizzes, structured JSON is best. Gemini 2.5 Flash supports JSON mode.

export const learningModesService = {
  summarize: async (collectionName: string, type: "short" | "detailed" | "key_concepts" | "exam", contextLimit: number = 20) => {
    // 1. Retrieve broader context (limit 20 chunks?) or all?
    // Retrieving all might exceed context window. We rely on vector search to find most relevant, or just pick random/recent if "overall"?
    // "Summarize" usually means the whole document or subject.
    // For MVP, let's fetch top 20 chunks that might be relevant to "summary" or just generic overview.
    // Actually, vector search needs a query.
    // Query: "Overview main concepts summary"
    
    const context = await ragService.retrieveContext(collectionName, "Main concepts overview summary important points", contextLimit, 0.4);
    
    if (context.length === 0) return "No sufficient content found to summarize.";

    const contextText = context.map(c => c.content).join("\n\n");

    const prompts = {
        short: "Provide a concise 1-paragraph summary of the key topics.",
        detailed: "Provide a comprehensive summary covering all major sections in detail.",
        key_concepts: "List the top 10 key concepts with brief definitions.",
        exam: "Create an exam preparation summary focusing on high-value testable information."
    };

    const prompt = `
You are a StudyBuddy. Analyze the following study material context and generate a ${type} summary.
Strictly base it on the provided text.

CONTEXT:
${contextText}

INSTRUCTION:
${prompts[type] || prompts.short}
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  generateFlashcards: async (collectionName: string, count: number = 5) => {
    // Query for key terms
    const context = await ragService.retrieveContext(collectionName, "Important definitions terms concepts facts", 15, 0.5);
    if (context.length === 0) return [];

    const contextText = context.map(c => c.content).join("\n\n");
    
    const prompt = `
You are a StudyBuddy AI assistant. Your task is to generate ${count} flashcards based ONLY on the provided context.

STRICT RULES:
1. Grounding: Every flashcard MUST be directly supported by the provided context.
2. No Hallucinations: Do not invent names, thoughts, or facts not in the text.
3. No Outside Knowledge: Do not use your general training data to add external information.
4. Format: Return ONLY a valid JSON array of objects with "question" and "answer" fields.
5. Content: If the context is insufficient or contains error messages, return an empty array [].

CONTEXT:
${contextText}
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });
    
    try {
        return JSON.parse(result.response.text());
    } catch (e) {
        console.error("Failed to parse flashcards JSON", e);
        return [];
    }
  },

  generateQuiz: async (collectionName: string, topic: string | undefined, count: number = 5) => {
    const query = topic ? `Quiz questions about ${topic}` : "General quiz questions from material";
    const context = await ragService.retrieveContext(collectionName, query, 15, 0.5);
    
    if (context.length === 0) return [];
    
    const contextText = context.map(c => c.content).join("\n\n");

    const prompt = `
You are a StudyBuddy AI assistant. Your task is to generate a quiz with ${count} multiple-choice questions based ONLY on the provided context.

STRICT RULES:
1. Grounding: Every question and answer choice MUST be derived from the provided context.
2. No Hallucinations: Do not create fictitious scenarios or characters like "her thoughts" unless explicitly mentioned in the text.
3. No Outside Knowledge: Use ONLY the information in the CONTEXT.
4. Format: Return ONLY a valid JSON array of objects. Each object should have:
   - "question": string
   - "options": array of 4 strings
   - "answer": string (must be one of the options)
5. Content: If the context is missing or irrelevant, return an empty array [].

CONTEXT:
${contextText}
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    });

    try {
        return JSON.parse(result.response.text());
    } catch (e) {
        console.error("Failed to parse quiz JSON", e);
        return [];
    }
  }
};
