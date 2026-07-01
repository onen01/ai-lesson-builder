"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { MCQWidget } from "@/components/lesson/MCQWidget";
import { PlanDisplay } from "@/components/lesson/PlanDisplay";
import { FeedbackDisplay } from "@/components/lesson/FeedbackDisplay";
import { SummaryDisplay } from "@/components/lesson/SummaryDisplay";
import { ProgressBar } from "@/components/lesson/ProgressBar";
import type {
  AnswerRecord,
  LearningObjective,
  MCQuestion,
  SummaryReport,
  LessonPhase,
} from "@/lib/agent/state";

interface LessonUIState {
  phase: LessonPhase;
  plan: LearningObjective[];
  currentMCQ: MCQuestion | null;
  currentMCQs: MCQuestion[];
  pendingMCQ: MCQuestion | null;
  pendingObjectiveIndex: number;
  pendingMCQIndex: number;
  objectiveIndex: number;
  mcqIndex: number;
  totalObjectives: number;
  totalMCQs: number;
  retryKey: number;
  isCorrect: boolean | null;
  explanation: string | null;
  hint: string | null;
  summary: SummaryReport | null;
  error: string | null;
}

interface InterruptValue {
  type?: string;
  plan?: LearningObjective[];
  mcq?: MCQuestion;
  objectiveIndex?: number;
  mcqIndex?: number;
  totalObjectives?: number;
  totalMCQs?: number;
}

interface LessonAPIResult {
  threadId?: string;
  phase?: LessonPhase;
  lessonPlan?: LearningObjective[];
  currentObjectiveIndex?: number;
  currentMCQIndex?: number;
  currentMCQs?: MCQuestion[];
  answers?: AnswerRecord[];
  summary?: SummaryReport | null;
  __interrupt__?: Array<{ value?: InterruptValue } & InterruptValue>;
}

const initialState: LessonUIState = {
  phase: "idle",
  plan: [],
  currentMCQ: null,
  currentMCQs: [],
  pendingMCQ: null,
  pendingObjectiveIndex: 0,
  pendingMCQIndex: 0,
  objectiveIndex: 0,
  mcqIndex: 0,
  totalObjectives: 0,
  totalMCQs: 3,
  retryKey: 0,
  isCorrect: null,
  explanation: null,
  hint: null,
  summary: null,
  error: null,
};

function getInterruptValue(result: LessonAPIResult): InterruptValue | null {
  const interrupt = result.__interrupt__?.[0];
  if (!interrupt) return null;
  return interrupt.value ?? interrupt;
}

function getInterruptedQuestion(result: LessonAPIResult) {
  const interrupt = getInterruptValue(result);
  if (interrupt?.type !== "mcq_answer" || !interrupt.mcq) return null;

  return {
    mcq: interrupt.mcq,
    objectiveIndex: interrupt.objectiveIndex ?? 0,
    mcqIndex: interrupt.mcqIndex ?? 0,
    totalObjectives: interrupt.totalObjectives ?? 0,
    totalMCQs: interrupt.totalMCQs ?? 3,
  };
}

function findAnsweredQuestion(
  questions: MCQuestion[],
  currentQuestion: MCQuestion | null,
  questionId?: string
) {
  if (!questionId) return currentQuestion;
  return (
    questions.find((question) => question.id === questionId) ??
    (currentQuestion?.id === questionId ? currentQuestion : null)
  );
}

function getQuestionIndex(
  question: MCQuestion | null,
  questions: MCQuestion[],
  fallback: number
) {
  if (!question) return fallback;

  const arrayIndex = questions.findIndex((q) => q.id === question.id);
  if (arrayIndex >= 0) return arrayIndex;

  const idIndex = question.id.match(/_q(\d+)$/)?.[1];
  return idIndex ? Number(idIndex) : fallback;
}

function getSafeTotalMCQs(...values: Array<number | null | undefined>) {
  return values.find((value) => typeof value === "number" && value > 0) ?? 3;
}

export default function LessonPage() {
  const router = useRouter();
  const [lessonState, setLessonState] = useState<LessonUIState>(initialState);
  const [threadId, setThreadId] = useState<string>("");
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [filename, setFilename] = useState("document");

  useCopilotReadable({
    description:
      "Current lesson state for the AI tutor. The tutor can see the question but must NEVER reveal the correct answer or hint at which option is correct.",
    value: {
      phase: lessonState.phase,
      currentObjectiveTitle:
        lessonState.plan[lessonState.objectiveIndex]?.title ?? null,
      currentObjectiveDescription:
        lessonState.plan[lessonState.objectiveIndex]?.description ?? null,
      currentQuestion: lessonState.currentMCQ?.question ?? null,
      objectivesCompleted: lessonState.objectiveIndex,
      totalObjectives: lessonState.totalObjectives,
      questionNumber: lessonState.mcqIndex + 1,
      totalQuestions: lessonState.totalMCQs,
    },
  });

  async function callLessonAPI(
    action: string,
    data: Record<string, unknown>,
    tid?: string
  ) {
    setIsApiLoading(true);
    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          threadId: tid ?? threadId,
          data,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "API error");
      return json as LessonAPIResult;
    } finally {
      setIsApiLoading(false);
    }
  }

  async function startLesson(pdfContent: string) {
    setLessonState((prev) => ({ ...prev, phase: "extracting", error: null }));
    try {
      const result = await callLessonAPI("start", { pdfContent });
      const nextThreadId = result.threadId ?? "";
      if (nextThreadId) {
        setThreadId(nextThreadId);
        sessionStorage.setItem("lessonThreadId", nextThreadId);
      }

      setLessonState((prev) => ({
        ...prev,
        phase: "hitl",
        plan: result.lessonPlan ?? [],
        totalObjectives: result.lessonPlan?.length ?? 0,
        error: null,
      }));
    } catch (e: unknown) {
      setLessonState((prev) => ({
        ...prev,
        phase: "idle",
        error: e instanceof Error ? e.message : "Failed to start lesson",
      }));
    }
  }

  async function handleApprove() {
    try {
      const result = await callLessonAPI("resume", { approved: true });
      const interruptedQuestion = getInterruptedQuestion(result);
      const currentMCQ =
        interruptedQuestion?.mcq ??
        result.currentMCQs?.[result.currentMCQIndex ?? 0] ??
        null;
      const currentMCQs = result.currentMCQs ?? (currentMCQ ? [currentMCQ] : []);
      const mcqIndex = getQuestionIndex(
        currentMCQ,
        currentMCQs,
        interruptedQuestion?.mcqIndex ?? result.currentMCQIndex ?? 0
      );

      setLessonState((prev) => ({
        ...prev,
        phase: currentMCQ ? "quiz" : "generating_mcq",
        currentMCQ,
        currentMCQs: result.currentMCQs ?? prev.currentMCQs,
        objectiveIndex:
          currentMCQ?.objectiveIndex ??
          interruptedQuestion?.objectiveIndex ??
          result.currentObjectiveIndex ??
          0,
        mcqIndex,
        totalObjectives:
          interruptedQuestion?.totalObjectives || prev.totalObjectives,
        totalMCQs: getSafeTotalMCQs(
          interruptedQuestion?.totalMCQs,
          result.currentMCQs?.length,
          prev.totalMCQs
        ),
        retryKey: prev.retryKey + 1,
        isCorrect: null,
        explanation: null,
        hint: null,
        error: null,
      }));
    } catch (e: unknown) {
      setLessonState((prev) => ({
        ...prev,
        error: e instanceof Error ? e.message : "Failed to start quiz",
      }));
    }
  }

  async function handleAnswer(selectedIndex: number) {
    try {
      const result = await callLessonAPI("answer", { selectedIndex });

      if (result.phase === "complete" || result.summary) {
        setLessonState((prev) => ({
          ...prev,
          phase: "complete",
          summary: result.summary ?? null,
          error: null,
        }));
        return;
      }

      const lastAnswer = result.answers?.[result.answers.length - 1];
      const isCorrect = lastAnswer?.isCorrect ?? false;
      const questions =
        result.currentMCQs && result.currentMCQs.length > 0
          ? result.currentMCQs
          : lessonState.currentMCQs;
      const answeredMCQ = findAnsweredQuestion(
        questions,
        lessonState.currentMCQ,
        lastAnswer?.questionId
      );

      setLessonState((prev) => ({
        ...prev,
        phase: "feedback",
        currentMCQ: answeredMCQ ?? prev.currentMCQ,
        currentMCQs: result.currentMCQs ?? prev.currentMCQs,
        pendingMCQ: null,
        pendingObjectiveIndex: result.currentObjectiveIndex ?? prev.objectiveIndex,
        pendingMCQIndex: result.currentMCQIndex ?? prev.mcqIndex,
        objectiveIndex: answeredMCQ?.objectiveIndex ?? prev.objectiveIndex,
        mcqIndex: getQuestionIndex(
          answeredMCQ ?? prev.currentMCQ,
          questions,
          prev.mcqIndex
        ),
        totalMCQs: getSafeTotalMCQs(
          result.currentMCQs?.length,
          prev.totalMCQs
        ),
        isCorrect,
        explanation: isCorrect ? answeredMCQ?.explanation ?? null : null,
        hint: !isCorrect ? answeredMCQ?.hint ?? null : null,
        error: null,
      }));
    } catch (e: unknown) {
      setLessonState((prev) => ({
        ...prev,
        error: e instanceof Error ? e.message : "Failed to submit answer",
      }));
    }
  }

  async function handleNextQuestion() {
    setLessonState((prev) => ({
      ...prev,
      phase: "generating_mcq",
      isCorrect: null,
      explanation: null,
      hint: null,
      error: null,
    }));

    try {
      const result = await callLessonAPI("resume", { nextQuestion: true });

      if (result.phase === "complete" || result.summary) {
        setLessonState((prev) => ({
          ...prev,
          phase: "complete",
          summary: result.summary ?? null,
          error: null,
        }));
        return;
      }

      const interruptedQuestion = getInterruptedQuestion(result);
      const currentMCQ =
        interruptedQuestion?.mcq ??
        result.currentMCQs?.[result.currentMCQIndex ?? 0] ??
        null;
      const currentMCQs =
        result.currentMCQs && result.currentMCQs.length > 0
          ? result.currentMCQs
          : currentMCQ
            ? [currentMCQ]
            : [];
      const mcqIndex = getQuestionIndex(
        currentMCQ,
        currentMCQs,
        interruptedQuestion?.mcqIndex ?? result.currentMCQIndex ?? 0
      );

      setLessonState((prev) => ({
        ...prev,
        phase: currentMCQ ? "quiz" : "generating_mcq",
        currentMCQ,
        currentMCQs: result.currentMCQs ?? prev.currentMCQs,
        objectiveIndex:
          currentMCQ?.objectiveIndex ??
          interruptedQuestion?.objectiveIndex ??
          result.currentObjectiveIndex ??
          prev.objectiveIndex,
        mcqIndex,
        totalObjectives:
          interruptedQuestion?.totalObjectives || prev.totalObjectives,
        totalMCQs: getSafeTotalMCQs(
          interruptedQuestion?.totalMCQs,
          result.currentMCQs?.length,
          prev.totalMCQs
        ),
        retryKey: prev.retryKey + 1,
        error: null,
      }));
    } catch (e: unknown) {
      setLessonState((prev) => ({
        ...prev,
        phase: "feedback",
        error:
          e instanceof Error ? e.message : "Failed to load next question",
      }));
    }
  }

  function handleRetry() {
    setLessonState((prev) => ({
      ...prev,
      phase: "quiz",
      isCorrect: null,
      hint: null,
      retryKey: prev.retryKey + 1,
      error: null,
    }));
  }

  function handleStartOver() {
    sessionStorage.removeItem("pdfContent");
    sessionStorage.removeItem("pdfFilename");
    sessionStorage.removeItem("lessonThreadId");
    router.push("/");
  }

  useEffect(() => {
    const pdfContent = sessionStorage.getItem("pdfContent");
    const pdfFilename = sessionStorage.getItem("pdfFilename");
    if (!pdfContent) {
      router.push("/");
      return;
    }
    if (pdfFilename) setFilename(pdfFilename);
    startLesson(pdfContent);
    // This effect intentionally runs once to bootstrap the lesson from sessionStorage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-bg">
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-surface flex-shrink-0">
          <span className="font-serif text-lg font-medium text-primary">
            AI Lesson Builder
          </span>
          <span className="font-sans text-muted text-sm truncate max-w-xs ml-4">
            {filename}
          </span>
        </div>

        <ProgressBar
          currentObjective={lessonState.objectiveIndex}
          totalObjectives={lessonState.totalObjectives}
          currentMCQ={lessonState.mcqIndex}
          totalMCQs={lessonState.totalMCQs}
          phase={lessonState.phase}
        />

        <div className="flex-1 overflow-y-auto px-8">
          {(lessonState.phase === "idle" ||
            lessonState.phase === "extracting" ||
            lessonState.phase === "planning") &&
            !lessonState.error && (
              <div className="flex items-center justify-center h-full py-20">
                <div className="text-center">
                  <div className="text-4xl mb-4">🧠</div>
                  <h2 className="font-serif text-2xl text-primary mb-2">
                    Analyzing your document...
                  </h2>
                  <p className="font-sans text-secondary text-sm">
                    Gemini is reading your PDF and building your lesson plan.
                  </p>
                </div>
              </div>
            )}

          {lessonState.phase === "hitl" && lessonState.plan.length > 0 && (
            <PlanDisplay
              plan={lessonState.plan}
              filename={filename}
              onApprove={handleApprove}
              isLoading={isApiLoading}
            />
          )}

          {(lessonState.phase === "quiz" ||
            lessonState.phase === "feedback" ||
            lessonState.phase === "generating_mcq") && (
            <div>
              {lessonState.currentMCQ && (
                <MCQWidget
                  key={`${lessonState.currentMCQ.id}-${lessonState.retryKey}`}
                  question={lessonState.currentMCQ}
                  objectiveTitle={
                    lessonState.plan[lessonState.objectiveIndex]?.title ?? ""
                  }
                  objectiveIndex={lessonState.objectiveIndex}
                  totalObjectives={lessonState.totalObjectives}
                  mcqIndex={lessonState.mcqIndex}
                  totalMCQs={lessonState.totalMCQs}
                  onAnswer={handleAnswer}
                  isLoading={isApiLoading}
                />
              )}

              {lessonState.phase === "feedback" &&
                lessonState.isCorrect !== null && (
                  <FeedbackDisplay
                    isCorrect={lessonState.isCorrect}
                    explanation={lessonState.explanation ?? undefined}
                    hint={lessonState.hint ?? undefined}
                    onNext={handleNextQuestion}
                    onRetry={handleRetry}
                    isLoading={isApiLoading}
                  />
                )}

              {lessonState.phase === "generating_mcq" && (
                <div className="text-center py-8">
                  <p className="font-sans text-secondary text-sm">
                    Generating next question...
                  </p>
                </div>
              )}
            </div>
          )}

          {lessonState.phase === "complete" && lessonState.summary && (
            <SummaryDisplay
              summary={lessonState.summary}
              filename={filename}
              onStartOver={handleStartOver}
            />
          )}

          {lessonState.error && (
            <div className="max-w-2xl mx-auto py-12">
              <div className="card border-error">
                <p className="font-sans text-error font-medium mb-2">
                  Something went wrong
                </p>
                <p className="font-sans text-secondary text-sm mb-4">
                  {lessonState.error}
                </p>
                <button onClick={handleStartOver} className="btn-secondary">
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <aside className="w-[380px] border-l border-border flex-shrink-0 flex flex-col">
        <CopilotSidebar
          defaultOpen={true}
          clickOutsideToClose={false}
          instructions={`You are a supportive and encouraging learning tutor helping a student complete an AI-powered lesson.

You have read-only access to the current lesson state including the student's current question.

STRICT RULES - follow these without exception:
1. NEVER reveal the correct answer to any quiz question
2. NEVER say which option letter or number is correct
3. NEVER hint at which specific option to choose
4. NEVER create your own quiz questions, answer choices, or parallel quiz flow
5. Before the main lesson quiz starts, do not start quizzing the student
6. DO provide conceptual explanations to deepen understanding when the student asks
7. DO give encouraging, non-spoiler hints about the topic
8. If asked directly for the answer, say: "I can't give that away! Try thinking about [relevant concept from the question topic]."
9. Keep all responses to 2-3 sentences maximum - be concise
10. Encourage the student to use the main quiz panel for answers
11. Be warm, friendly, and supportive - learning is hard!`}
          labels={{
            title: "Learning Tutor",
            initial:
              "Hi! I'm your AI tutor for this lesson. Ask me anything about the topics you're studying. I'll explain concepts and give non-spoiler hints, but the quiz happens in the main panel.",
          }}
        />
      </aside>
    </div>
  );
}
