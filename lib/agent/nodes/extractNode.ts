import { LessonState } from "../state";

export async function extractNode(): Promise<Partial<LessonState>> {
  return { phase: "planning" };
}
