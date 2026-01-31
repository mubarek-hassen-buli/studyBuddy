import { PDFParse } from "pdf-parse";

export const parsePdf = async (buffer: Buffer): Promise<string> => {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text;
};
