import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LessonState, LearningObjective } from "../state";

export async function planNode(
  state: LessonState
): Promise<Partial<LessonState>> {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.3,
  });

  const contentSample = state.pdfContent.substring(0, 8000);

  const prompt = `You are an expert educational curriculum designer.

Analyze the following document content and create a structured lesson plan.

DOCUMENT CONTENT:
${contentSample}

Create exactly 3 to 5 learning objectives based on the main topics in this document.

IMPORTANT: Return ONLY a valid JSON array. No markdown. No code blocks. No explanation text. Just the raw JSON array starting with [ and ending with ].

Required format:
[
  {
    "title": "Concise objective title in max 8 words",
    "description": "One sentence describing what the learner will understand after this section.",
    "difficulty": "beginner"
  }
]

Rules:
- difficulty must be exactly one of: "beginner", "intermediate", "advanced"
- Each title must be unique and specific to this document's content
- Return between 3 and 5 objectives, no fewer, no more
- Objectives should progress logically from foundational to more complex
- Base objectives only on what is actually in the document`;

  const response = await model.invoke(prompt);
  const raw = (response.content as string).trim();

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let objectives: LearningObjective[];

  try {
    objectives = JSON.parse(cleaned);
    if (!Array.isArray(objectives) || objectives.length === 0) {
      throw new Error("Response is not a valid array");
    }
    if (objectives.length < 3 || objectives.length > 5) {
      throw new Error(`Expected 3-5 objectives, got ${objectives.length}`);
    }
  } catch (err) {
    throw new Error(
      `Plan generation failed to parse JSON: ${(err as Error).message}. Raw response: ${raw.substring(0, 300)}`
    );
  }

  return {
    lessonPlan: objectives,
    phase: "hitl",
  };
}
