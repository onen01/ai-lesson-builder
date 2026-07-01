import { PDFParse } from "pdf-parse";

export async function parsePDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  try {
    const data = await parser.getText();
    return data.text.trim();
  } finally {
    await parser.destroy();
  }
}
