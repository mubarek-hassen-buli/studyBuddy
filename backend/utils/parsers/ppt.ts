import pptxTextParser from "pptx-text-parser";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export const parsePpt = async (buffer: Buffer): Promise<string> => {
  const tempDir = join(tmpdir(), "studybuddy");
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  
  const tempPath = join(tempDir, `${Date.now()}_temp.pptx`);
  
  try {
    // pptx-text-parser requires a file path, so we write the buffer to a temp file
    writeFileSync(tempPath, buffer);
    
    // pptx-text-parser exports a function directly, not a class
    const result = await (pptxTextParser as any)(tempPath);
    
    // Result is a string with slide content
    return result || "";
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw new Error("Failed to parse PowerPoint file");
  } finally {
    // Cleanup
    try {
      if (existsSync(tempPath)) {
        unlinkSync(tempPath);
      }
    } catch (e) {
      console.warn("Failed to delete temp PPTX file:", e);
    }
  }
};
