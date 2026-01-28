const pdf = require("pdf-parse");

export const parsePdf = async (buffer: Buffer): Promise<string> => {
  const data = await pdf(buffer);
  return data.text;
};
