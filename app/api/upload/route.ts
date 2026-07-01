import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/utils/pdfParser";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const content = await parsePDF(buffer);

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF. Please use a text-based PDF, not a scanned image." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      content: content.substring(0, 50000),
      charCount: content.length,
      filename: file.name,
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF. Please try another file." },
      { status: 500 }
    );
  }
}
