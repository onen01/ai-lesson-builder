import { interrupt } from "@langchain/langgraph";
import { LessonState } from "../state";

export async function hitlNode(
  state: LessonState
): Promise<Partial<LessonState>> {
  const userInput = (await interrupt({
    type: "plan_approval",
    plan: state.lessonPlan,
  })) as { approved: boolean };

  if (!userInput.approved) {
    return { phase: "idle" };
  }

  return { phase: "generating_mcq" };
}
