import { LessonState } from "../state";

export async function answerNode(
  state: LessonState
): Promise<Partial<LessonState>> {
  const {
    currentMCQIndex,
    currentMCQs,
    currentObjectiveIndex,
    lessonPlan,
    answers,
  } = state;

  const lastAnswer = answers[answers.length - 1];

  if (!lastAnswer?.isCorrect) {
    return { phase: "quiz" };
  }

  const nextMCQIndex = currentMCQIndex + 1;
  if (nextMCQIndex < currentMCQs.length) {
    return {
      currentMCQIndex: nextMCQIndex,
      phase: "generating_mcq",
    };
  }

  const nextObjectiveIndex = currentObjectiveIndex + 1;
  if (nextObjectiveIndex < lessonPlan.length) {
    return {
      currentObjectiveIndex: nextObjectiveIndex,
      currentMCQs: [],
      currentMCQIndex: 0,
      phase: "generating_mcq",
    };
  }

  return { phase: "summarizing" };
}
