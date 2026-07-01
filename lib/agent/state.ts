import { Annotation } from "@langchain/langgraph";

export interface LearningObjective {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
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
  objectiveBreakdown: Array<{
    title: string;
    correct: number;
    total: number;
  }>;
  studyTips: string[];
  encouragement: string;
}

export type LessonPhase =
  | "idle"
  | "extracting"
  | "planning"
  | "hitl"
  | "generating_mcq"
  | "quiz"
  | "feedback"
  | "summarizing"
  | "complete";

export const LessonStateAnnotation = Annotation.Root({
  pdfContent: Annotation<string>({
    reducer: (_, b) => b,
    default: () => "",
  }),
  lessonPlan: Annotation<LearningObjective[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  currentObjectiveIndex: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 0,
  }),
  currentMCQs: Annotation<MCQuestion[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  currentMCQIndex: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 0,
  }),
  answers: Annotation<AnswerRecord[]>({
    reducer: (a, b) => [...a, ...b],
    default: () => [],
  }),
  phase: Annotation<LessonPhase>({
    reducer: (_, b) => b,
    default: () => "idle",
  }),
  summary: Annotation<SummaryReport | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
});

export type LessonState = typeof LessonStateAnnotation.State;
