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

  generateFlashcards: async (
    collectionName?: string | null,
    topic?: string | null,
    count: number = 5,
    difficulty: "easy" | "medium" | "hard" = "medium"
  ): Promise<Array<{ question: string; answer: string; difficulty?: string }>> => {
    let contextText = "";
    if (collectionName) {
      try {
        const query = topic ? `Important concepts and definitions about ${topic}` : "Important definitions terms concepts facts";
        const context = await ragService.retrieveContext(collectionName, query, 15, 0.4);
        if (context.length > 0) {
          contextText = context.map((c) => c.content).join("\n\n");
        }
      } catch (err) {
        console.warn("Vector search failed or collection empty, falling back to topic generation:", err);
      }
    }

    const prompt = contextText
      ? `You are an academic flashcard creator. Generate exactly ${count} educational flashcards based ONLY on the provided context at a ${difficulty} difficulty level.
Format: Return ONLY a valid JSON array of objects with keys: "question" (string) and "answer" (string).

CONTEXT:
${contextText}`
      : `You are an academic flashcard creator. Generate exactly ${count} high-yield educational flashcards for the topic "${topic || "General Academic Knowledge"}" at a ${difficulty} difficulty level.
Format: Return ONLY a valid JSON array of objects with keys: "question" (string) and "answer" (string).`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    try {
      const rawText = result.response.text();
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : (parsed?.flashcards || parsed?.cards || parsed?.items || []);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.error("Failed to parse flashcards JSON", e);
      return [];
    }
  },

  generateQuiz: async (
    collectionName?: string | null,
    topic?: string | null,
    count: number = 5,
    difficulty: "easy" | "medium" | "hard" = "medium"
  ): Promise<Array<{ question: string; options: string[]; answer: string; explanation?: string }>> => {
    let contextText = "";
    if (collectionName) {
      try {
        const query = topic ? `Quiz questions about ${topic}` : "General quiz questions from material";
        const context = await ragService.retrieveContext(collectionName, query, 15, 0.4);
        if (context.length > 0) {
          contextText = context.map((c) => c.content).join("\n\n");
        }
      } catch (err) {
        console.warn("Vector search failed or collection empty, falling back to topic quiz generation:", err);
      }
    }

    const prompt = contextText
      ? `You are a university professor creating an exam quiz. Generate ${count} multiple-choice questions based ONLY on the provided context at a ${difficulty} difficulty level.
STRICT RULES:
1. Every question and answer MUST be supported by the provided context.
2. Format: Return ONLY a valid JSON array of objects. Each object must have:
   - "question": string
   - "options": array of 4 distinct strings
   - "answer": string (must exactly match one of the options)
   - "explanation": brief string explaining why the answer is correct

CONTEXT:
${contextText}`
      : `You are a university professor creating an exam quiz. Generate ${count} challenging multiple-choice questions about "${topic || "General Knowledge"}" at a ${difficulty} difficulty level.
Format: Return ONLY a valid JSON array of objects. Each object must have:
   - "question": string
   - "options": array of 4 distinct strings
   - "answer": string (must exactly match one of the options)
   - "explanation": brief string explaining why the answer is correct`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    try {
      const parsed = JSON.parse(result.response.text());
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse quiz JSON", e);
      return [];
    }
  }
};
