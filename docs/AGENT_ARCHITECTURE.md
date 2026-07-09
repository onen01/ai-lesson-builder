# Agent Architecture
### LangGraph Workflow — Detailed Reference

---

## Concept: How LangGraph Works for This App

LangGraph is a workflow engine. You define a **graph** with nodes (steps) and edges (transitions). State flows through the graph. The key feature we need: **`interrupt()`** — which pauses execution and waits for human input before resuming.

Each interaction with the frontend is a graph execution. Between executions, state is saved by **MemorySaver** (keyed by `thread_id`). The same thread_id resumes from where it left off.

---

## State Definition

```typescript
// lib/agent/state.ts

export interface LearningObjective {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface MCQuestion {
  id: string;
  question: string;
  options: string[];       // Always 4 options
  correctIndex: number;   // 0, 1, 2, or 3
  explanation: string;    // Shown on correct answer
  hint: string;           // Shown on wrong answer (no spoilers)
  objectiveIndex: number;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  attempts: number;
}

export interface SummaryReport {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  objectiveBreakdown: { title: string; score: string }[];
  studyTips: string[];
  encouragement: string;
}

export type LessonPhase =
  | "idle"
  | "extracting"
  | "planning"
  | "hitl"          // Waiting for plan approval
  | "generating_mcq"
  | "quiz"          // Waiting for answer
  | "feedback"
  | "summarizing"
  | "complete";

// LangGraph state (using Annotation API)
import { Annotation } from "@langchain/langgraph";

export const LessonStateAnnotation = Annotation.Root({
  pdfContent: Annotation<string>({ 
    reducer: (_, b) => b, 
    default: () => "" 
  }),
  lessonPlan: Annotation<LearningObjective[]>({ 
    reducer: (_, b) => b, 
    default: () => [] 
  }),
  currentObjectiveIndex: Annotation<number>({ 
    reducer: (_, b) => b, 
    default: () => 0 
  }),
  currentMCQs: Annotation<MCQuestion[]>({ 
    reducer: (_, b) => b, 
    default: () => [] 
  }),
  currentMCQIndex: Annotation<number>({ 
    reducer: (_, b) => b, 
    default: () => 0 
  }),
  answers: Annotation<AnswerRecord[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => []
  }),
  phase: Annotation<LessonPhase>({ 
    reducer: (_, b) => b, 
    default: () => "idle" 
  }),
  summary: Annotation<SummaryReport | null>({ 
    reducer: (_, b) => b, 
    default: () => null 
  }),
});

export type LessonState = typeof LessonStateAnnotation.State;
```

---

## Graph Definition

```typescript
// lib/agent/graph.ts
import { StateGraph, MemorySaver, START, END } from "@langchain/langgraph";
import { LessonStateAnnotation } from "./state";
import { extractNode } from "./nodes/extractNode";
import { planNode } from "./nodes/planNode";
import { hitlNode } from "./nodes/hitlNode";
import { mcqNode } from "./nodes/mcqNode";
import { answerNode } from "./nodes/answerNode";
import { summaryNode } from "./nodes/summaryNode";

function routeAfterAnswer(state: typeof LessonStateAnnotation.State) {
  const { currentMCQIndex, currentMCQs, currentObjectiveIndex, lessonPlan } = state;
  const hasMoreQuestions = currentMCQIndex < currentMCQs.length - 1;
  const hasMoreObjectives = currentObjectiveIndex < lessonPlan.length - 1;
  
  if (hasMoreQuestions || hasMoreObjectives) {
    return "mcq";
  }
  return "summary";
}

const checkpointer = new MemorySaver();

export const lessonGraph = new StateGraph(LessonStateAnnotation)
  .addNode("extract", extractNode)
  .addNode("plan", planNode)
  .addNode("hitl", hitlNode)      // ← INTERRUPT 1: plan approval
  .addNode("mcq", mcqNode)        // ← INTERRUPT 2: wait for answer
  .addNode("answer", answerNode)
  .addNode("summary", summaryNode)
  .addEdge(START, "extract")
  .addEdge("extract", "plan")
  .addEdge("plan", "hitl")
  .addEdge("hitl", "mcq")         // After approval, go generate MCQs
  .addEdge("mcq", END)            // After generating MCQ, pause (INTERRUPT)
  .addConditionalEdges("answer", routeAfterAnswer, {
    mcq: "mcq",
    summary: "summary",
  })
  .addEdge("summary", END)
  .compile({ checkpointer });
```

---

## Each Node — Signature & Purpose

### extractNode
```typescript
// lib/agent/nodes/extractNode.ts
import { LessonState } from "../state";

export async function extractNode(state: LessonState): Promise<Partial<LessonState>> {
  // pdfContent is already in state (passed from frontend)
  // Just update the phase
  return { phase: "planning" };
}
```

### planNode
```typescript
// lib/agent/nodes/planNode.ts
// Calls Gemini to generate 3-5 learning objectives from PDF content
// Must return valid JSON array
// Prompt must specify the exact JSON schema

export async function planNode(state: LessonState): Promise<Partial<LessonState>> {
  const model = new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash" });
  
  const prompt = `Analyze this educational content and create a structured lesson plan.
  
Content: ${state.pdfContent.substring(0, 8000)} // trim to 8k chars for speed
  
Return ONLY a valid JSON array (no markdown, no explanation) with 3-5 learning objectives:
[
  {
    "title": "Short objective title",
    "description": "1-2 sentence description of what the learner will understand",
    "difficulty": "beginner" | "intermediate" | "advanced"
  }
]`;

  const response = await model.invoke(prompt);
  const objectives = JSON.parse(response.content as string);
  
  return { lessonPlan: objectives, phase: "hitl" };
}
```

### hitlNode (INTERRUPT 1)
```typescript
// lib/agent/nodes/hitlNode.ts
// This pauses the graph. The API route receives control.
// Frontend shows plan, user clicks Approve.
// API calls graph.invoke(new Command({ resume: { approved: true } }), config)

import { interrupt } from "@langchain/langgraph";

export async function hitlNode(state: LessonState): Promise<Partial<LessonState>> {
  const userInput = interrupt({
    type: "plan_approval",
    plan: state.lessonPlan,
  });
  
  if (!userInput.approved) {
    // User rejected — end session
    return { phase: "idle" };
  }
  
  return { phase: "generating_mcq" };
}
```

### mcqNode (INTERRUPT 2)
```typescript
// lib/agent/nodes/mcqNode.ts
// Generates MCQs for the current objective, then PAUSES

import { interrupt } from "@langchain/langgraph";

export async function mcqNode(state: LessonState): Promise<Partial<LessonState>> {
  const { currentObjectiveIndex, currentMCQIndex, currentMCQs, lessonPlan } = state;
  
  // Only generate new MCQs if we're starting a new objective
  let mcqs = currentMCQs;
  let mcqIdx = currentMCQIndex;
  
  if (currentMCQs.length === 0 || /* new objective */) {
    const model = new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash" });
    const objective = lessonPlan[currentObjectiveIndex];
    
    // Generate 3 MCQs for this objective
    // Prompt must return valid JSON
    mcqs = await generateMCQsForObjective(model, objective, state.pdfContent);
    mcqIdx = 0;
  }
  
  // PAUSE — wait for user to answer currentMCQ
  interrupt({
    type: "mcq_ready",
    mcq: mcqs[mcqIdx],
    objectiveIndex: currentObjectiveIndex,
    mcqIndex: mcqIdx,
  });
  
  return { currentMCQs: mcqs, currentMCQIndex: mcqIdx, phase: "quiz" };
}
```

### answerNode
```typescript
// lib/agent/nodes/answerNode.ts
// Receives the user's answer from Command({ resume: { selectedIndex } })
// Checks against correctIndex, updates answers array, advances indexes

export async function answerNode(state: LessonState): Promise<Partial<LessonState>> {
  // The answer comes from the interrupt resume data
  // state will have the selectedIndex from the resume command
  // ...
}
```

### summaryNode
```typescript
// lib/agent/nodes/summaryNode.ts
// Calls Gemini with performance data → personalized report

export async function summaryNode(state: LessonState): Promise<Partial<LessonState>> {
  const model = new ChatGoogleGenerativeAI({ model: "gemini-2.5-flash" });
  
  const score = state.answers.filter(a => a.isCorrect).length;
  const total = state.answers.length;
  
  // Prompt: given score, objectives, generate encouragement + study tips
  const summary = await generateSummary(model, state.answers, state.lessonPlan, score, total);
  
  return { summary, phase: "complete" };
}
```

---

## API Route Pattern

```typescript
// app/api/lesson/route.ts
import { lessonGraph } from "@/lib/agent/graph";
import { Command } from "@langchain/langgraph";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // Required for LangGraph + pdf-parse

export async function POST(req: NextRequest) {
  const { action, threadId, data } = await req.json();
  const config = { configurable: { thread_id: threadId } };

  try {
    let result;
    
    if (action === "start") {
      result = await lessonGraph.invoke(
        { pdfContent: data.pdfContent, phase: "extracting" },
        config
      );
    } else if (action === "resume" || action === "answer") {
      result = await lessonGraph.invoke(
        new Command({ resume: data }),
        config
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Agent error" }, { status: 500 });
  }
}
```

---

## Thread ID Management (Frontend)

```typescript
// In lesson/page.tsx or a custom hook
const [threadId] = useState(() => {
  // Generate once per session
  const existing = sessionStorage.getItem("lessonThreadId");
  if (existing) return existing;
  const newId = crypto.randomUUID();
  sessionStorage.setItem("lessonThreadId", newId);
  return newId;
});
```

---

## CopilotKit Chat System Prompt

```typescript
// In lesson/page.tsx
useCopilotReadable({
  description: "Current lesson state for the AI tutor",
  value: {
    currentObjectiveTitle: lessonState.plan?.[lessonState.objectiveIndex]?.title,
    currentQuestion: lessonState.currentMCQ?.question,
    // DO NOT include correctIndex or explanation here
    phase: lessonState.phase,
    objectivesRemaining: (lessonState.plan?.length ?? 0) - lessonState.objectiveIndex,
  },
});
```

System prompt for the chat:
```
You are a supportive learning tutor helping the user study this lesson.
You have access to the current lesson state including the current question.

STRICT RULES:
1. NEVER reveal the correct answer to any MCQ question
2. NEVER hint at which option is correct
3. DO provide conceptual explanations to help understanding
4. DO provide encouragement and motivation
5. If asked for the answer directly, redirect: "I can't give that away — try thinking about [concept related to the question]"
6. Always steer the user back to completing the lesson
7. Keep responses concise — 2-3 sentences max
```
