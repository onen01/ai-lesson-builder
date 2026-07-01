import { StateGraph, MemorySaver, START, END } from "@langchain/langgraph";
import { LessonStateAnnotation } from "./state";
import { extractNode } from "./nodes/extractNode";
import { planNode } from "./nodes/planNode";
import { hitlNode } from "./nodes/hitlNode";
import { mcqNode } from "./nodes/mcqNode";
import { answerNode } from "./nodes/answerNode";
import { LessonState } from "./state";

function routeAfterAnswer(state: LessonState): "retry" | "done" {
  const lastAnswer = state.answers[state.answers.length - 1];
  return lastAnswer?.isCorrect ? "done" : "retry";
}

const checkpointer = new MemorySaver();

export const lessonGraph = new StateGraph(LessonStateAnnotation)
  .addNode("extract", extractNode)
  .addNode("plan", planNode)
  .addNode("hitl", hitlNode)
  .addNode("mcq", mcqNode)
  .addNode("answer", answerNode)
  .addEdge(START, "extract")
  .addEdge("extract", "plan")
  .addEdge("plan", "hitl")
  .addEdge("hitl", "mcq")
  .addEdge("mcq", "answer")
  .addConditionalEdges("answer", routeAfterAnswer, {
    retry: "mcq",
    done: END,
  })
  .compile({ checkpointer });
