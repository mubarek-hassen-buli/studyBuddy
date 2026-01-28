export const chunkText = (text: string, chunkSize: number = 500, overlap: number = 50): string[] => {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);
    chunks.push(chunk);
    
    // Move to next chunk, accounting for overlap
    startIndex += chunkSize - overlap;
    
    // Break infinite loop if overlap >= chunkSize (invalid config) or end reached
    if (startIndex >= text.length || chunkSize <= overlap) break;
  }

  return chunks;
};
