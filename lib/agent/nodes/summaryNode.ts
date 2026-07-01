import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LessonState, SummaryReport } from "../state";

export async function summaryNode(
  state: LessonState
): Promise<Partial<LessonState>> {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    temperature: 0.5,
  });

  const totalQuestions = state.answers.length;
  const correctAnswers = state.answers.filter((a) => a.isCorrect).length;
  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const objectiveBreakdown = state.lessonPlan.map((obj, i) => {
    const objAnswers = state.answers.filter((a) => {
      const questionId = a.questionId;
      return questionId.startsWith(`obj${i}_`);
    });
    return {
      title: obj.title,
      correct: objAnswers.filter((a) => a.isCorrect).length,
      total: objAnswers.length,
    };
  });

  const weakObjectives = objectiveBreakdown
    .filter((o) => o.total > 0 && o.correct / o.total < 0.7)
    .map((o) => o.title);

  const prompt = `A student just completed a lesson and got ${correctAnswers} out of ${totalQuestions} questions correct (${scorePercentage}%).

${weakObjectives.length > 0 ? `Weak areas that need more study: ${weakObjectives.join(", ")}` : "They did well across all objectives!"}

Generate a personalized lesson summary.

Return ONLY valid JSON, no markdown, no code blocks:
{
  "studyTips": [
    "Specific, actionable tip 1 related to their performance",
    "Specific, actionable tip 2",
    "Specific, actionable tip 3"
  ],
  "encouragement": "One warm, specific sentence that acknowledges their score and encourages continued learning."
}`;

  const response = await model.invoke(prompt);
  const raw = (response.content as string)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const { studyTips, encouragement } = JSON.parse(raw);

  const summary: SummaryReport = {
    totalQuestions,
    correctAnswers,
    scorePercentage,
    objectiveBreakdown,
    studyTips,
    encouragement,
  };

  return { summary, phase: "complete" };
}
