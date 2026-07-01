import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { interrupt } from "@langchain/langgraph";
import { LessonState, MCQuestion, AnswerRecord } from "../state";

export async function mcqNode(
  state: LessonState
): Promise<Partial<LessonState>> {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.4,
  });

  const {
    currentObjectiveIndex,
    currentMCQIndex,
    currentMCQs,
    lessonPlan,
  } = state;

  let mcqs = currentMCQs;
  let mcqIdx = currentMCQIndex;

  const isNewObjective =
    mcqs.length === 0 ||
    (mcqs.length > 0 && mcqs[0].objectiveIndex !== currentObjectiveIndex);

  if (isNewObjective) {
    const objective = lessonPlan[currentObjectiveIndex];
    mcqs = await generateMCQsForObjective(
      model,
      objective,
      state.pdfContent,
      currentObjectiveIndex
    );
    mcqIdx = 0;
  }

  const currentQuestion = mcqs[mcqIdx];

  const userInput = (await interrupt({
    type: "mcq_answer",
    mcq: currentQuestion,
    objectiveIndex: currentObjectiveIndex,
    mcqIndex: mcqIdx,
    totalObjectives: lessonPlan.length,
    totalMCQs: mcqs.length,
  })) as { selectedIndex: number };

  const isCorrect = userInput.selectedIndex === currentQuestion.correctIndex;

  const answerRecord: AnswerRecord = {
    questionId: currentQuestion.id,
    selectedIndex: userInput.selectedIndex,
    isCorrect,
    attempts: 1,
  };

  return {
    currentMCQs: mcqs,
    currentMCQIndex: mcqIdx,
    answers: [answerRecord],
    phase: "feedback",
  };
}

async function generateMCQsForObjective(
  model: ChatGoogleGenerativeAI,
  objective: { title: string; description: string },
  pdfContent: string,
  objectiveIndex: number
): Promise<MCQuestion[]> {
  const prompt = `You are a skilled educator creating quiz questions to test understanding.

DOCUMENT CONTENT (excerpt):
${pdfContent.substring(0, 10000)}

LEARNING OBJECTIVE:
Title: "${objective.title}"
Description: "${objective.description}"

Create exactly 3 multiple choice questions that test understanding of this specific objective.

IMPORTANT: Return ONLY a valid JSON array. No markdown. No code blocks. Just raw JSON starting with [.

Format:
[
  {
    "id": "q0",
    "question": "Clear question text ending with ?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "2-3 sentence explanation of why the correct answer is right. Should be educational.",
    "hint": "A helpful clue that guides thinking WITHOUT saying which option is correct."
  }
]

Rules:
- Exactly 4 options per question. No more, no less.
- correctIndex must be 0, 1, 2, or 3
- Questions must be answerable from the document content provided
- Hints must NOT reveal the answer or reference option letters/numbers
- Explanations should teach, not just restate the answer
- Use sequential ids: "q0", "q1", "q2"`;

  const response = await model.invoke(prompt);
  const raw = (response.content as string).trim();
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const questions: MCQuestion[] = JSON.parse(cleaned);
  return questions.map((q, i) => ({
    ...q,
    id: `obj${objectiveIndex}_q${i}`,
    objectiveIndex,
  }));
}
