# PROMPTS.md — AI Lesson Builder
### All 12 prompts in order. Copy each one fully into Codex. Do not skip steps.
### Every prompt references the docs folder for full project context.
### Tick off PROGRESS_TRACKER.md after each prompt completes successfully.

---

## HOW TO USE THIS FILE

1. You have a `/docs` folder in your project with all the reference files
2. Before running ANY prompt, make sure Codex can see your full project folder
3. Copy the ENTIRE prompt block (everything between the triple backtick lines)
4. Paste into Codex and let it finish completely before moving to the next
5. If it errors, paste the error back to Claude for a fix before continuing
6. After each prompt succeeds, open PROGRESS_TRACKER.md and tick off the items listed at the bottom of that prompt

---

## PROMPT 01 — Project Scaffold & Dependencies

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/SETUP.md
- /docs/STEP_01_SCAFFOLD.md

You are building "AI Lesson Builder" — a Next.js 14 app that transforms any PDF into an interactive AI-powered lesson. The full architecture is described in the docs files above. Read them first, then proceed.

The Next.js 14 project already exists with TypeScript and Tailwind CSS. Your job in this step is ONLY to install packages and create the folder structure with placeholder files. No logic yet.

TASK 1 — Install all required packages by running these two commands exactly:
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @langchain/core @langchain/langgraph @langchain/google-genai pdf-parse zod uuid
npm install -D @types/pdf-parse @types/uuid

TASK 2 — Create this exact folder and file structure. Every file is a placeholder export only — no logic:

app/api/copilotkit/route.ts
  → export async function POST(req: Request) { return new Response("ok") }

app/api/lesson/route.ts
  → export async function POST(req: Request) { return new Response("ok") }

app/api/upload/route.ts
  → export async function POST(req: Request) { return new Response("ok") }

app/lesson/page.tsx
  → "use client"; export default function LessonPage() { return <div>Lesson</div> }

components/ui/Button.tsx
  → export function Button({ children, onClick, disabled, className }: any) { return <button onClick={onClick} disabled={disabled} className={className}>{children}</button> }

components/ui/Card.tsx
  → export function Card({ children, className }: any) { return <div className={className}>{children}</div> }

components/ui/Badge.tsx
  → export function Badge({ children, className }: any) { return <span className={className}>{children}</span> }

components/lesson/MCQWidget.tsx
  → "use client"; export function MCQWidget() { return <div>MCQ Widget</div> }

components/lesson/PlanDisplay.tsx
  → "use client"; export function PlanDisplay() { return <div>Plan Display</div> }

components/lesson/ProgressBar.tsx
  → "use client"; export function ProgressBar() { return <div>Progress</div> }

components/lesson/FeedbackDisplay.tsx
  → "use client"; export function FeedbackDisplay() { return <div>Feedback</div> }

components/lesson/SummaryDisplay.tsx
  → "use client"; export function SummaryDisplay() { return <div>Summary</div> }

components/LandingPage.tsx
  → "use client"; export function LandingPage() { return <div>Landing Page</div> }

components/LessonLayout.tsx
  → "use client"; export function LessonLayout({ children }: { children: React.ReactNode }) { return <div>{children}</div> }

lib/agent/graph.ts
  → export const lessonGraph = {} as any

lib/agent/state.ts
  → export type LessonState = any

lib/agent/nodes/extractNode.ts
  → import { LessonState } from "../state"; export async function extractNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/agent/nodes/planNode.ts
  → import { LessonState } from "../state"; export async function planNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/agent/nodes/hitlNode.ts
  → import { LessonState } from "../state"; export async function hitlNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/agent/nodes/mcqNode.ts
  → import { LessonState } from "../state"; export async function mcqNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/agent/nodes/answerNode.ts
  → import { LessonState } from "../state"; export async function answerNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/agent/nodes/summaryNode.ts
  → import { LessonState } from "../state"; export async function summaryNode(state: LessonState): Promise<Partial<LessonState>> { return {} }

lib/utils/pdfParser.ts
  → export async function parsePDF(buffer: Buffer): Promise<string> { return "" }

TASK 3 — Replace next.config.ts with exactly this content (needed for pdf-parse to work in Next.js):
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
export default nextConfig;

TASK 4 — Create .env.example in the project root:
GOOGLE_GENERATIVE_AI_API_KEY=your_key_from_aistudio.google.com

TASK 5 — Make sure .env.local is in .gitignore. Check the .gitignore file and add it if missing.

CONSTRAINTS:
- Do NOT implement any logic in any file
- Do NOT install any packages other than what is listed above
- Do NOT add any database, auth, or ORM packages
- Do NOT modify tsconfig.json
- Do NOT create any test files

After completing all tasks, run: npm run dev
It must compile and run with zero TypeScript errors.

PROGRESS: When done successfully, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 01 — Project Scaffold".
```

---

## PROMPT 02 — Tailwind Config & Global Styles

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/UI_DESIGN.md
- /docs/STEP_02_STYLING.md

You are working on "AI Lesson Builder". The project structure and packages are already set up from the previous step. This step configures the visual design system: a warm cream color palette inspired by AdaptIQ, serif headings using Lora font, and clean sans-serif body text using Inter font.

Read /docs/UI_DESIGN.md carefully — it has the exact color hex values, font names, and component class patterns to follow.

TASK 1 — Replace tailwind.config.ts with exactly this:

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF7F0",
        surface: "#F0EBE1",
        elevated: "#E8DFD2",
        border: "#DDD5C5",
        "border-subtle": "#EAE3D8",
        primary: "#1C1410",
        secondary: "#7A6A58",
        muted: "#A8957A",
        accent: {
          DEFAULT: "#C85C2E",
          hover: "#B04D25",
        },
        success: {
          DEFAULT: "#3D8C5E",
        },
        error: {
          DEFAULT: "#C43835",
        },
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;

TASK 2 — Replace app/globals.css with exactly this:

@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-primary font-sans;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4 {
    @apply font-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-accent hover:bg-accent-hover text-white font-sans font-medium text-[15px] px-8 py-3.5 rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer;
  }
  .btn-secondary {
    @apply border border-border bg-surface hover:bg-elevated text-primary font-sans font-medium text-[15px] px-8 py-3.5 rounded-full transition-colors duration-150 cursor-pointer;
  }
  .card {
    @apply bg-surface border border-border rounded-2xl p-6;
  }
  .label-tag {
    @apply font-sans font-semibold text-xs tracking-[0.15em] uppercase text-accent;
  }
}

TASK 3 — Replace app/layout.tsx with exactly this:

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Lesson Builder",
  description: "Transform any PDF into an interactive AI-powered lesson",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">{children}</body>
    </html>
  );
}

TASK 4 — Update app/page.tsx temporarily so we can verify the styles:

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <p className="label-tag mb-4">AI-POWERED LEARNING</p>
        <h1 className="font-serif text-5xl text-primary mb-4">AI Lesson Builder</h1>
        <p className="font-sans text-secondary mb-8">Transform any PDF into an interactive lesson.</p>
        <button className="btn-primary">Get Started →</button>
      </div>
    </div>
  );
}

CONSTRAINTS:
- Use exactly the hex color values specified above — do not substitute or approximate
- Font names must be exactly "Lora" and "Inter" — these are Google Fonts
- Do not add any other fonts or UI libraries
- Do not modify any other files

After completing all tasks, run: npm run dev
Open localhost:3000 — the background must be warm cream (#FAF7F0), NOT white. The heading must use a serif font. The button must be terracotta orange.

PROGRESS: When visually verified, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 02 — Tailwind & Fonts".
```

---

## PROMPT 03 — CopilotKit Runtime & Provider Setup

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/STEP_03_COPILOTKIT.md

You are working on "AI Lesson Builder". Tailwind and fonts are configured. Now you are setting up CopilotKit — the chat sidebar that acts as the AI tutor during the quiz. 

Key facts from the project docs:
- We use CopilotKit in SELF-HOSTED mode (runtimeUrl="/api/copilotkit")
- NO publicApiKey is needed — that is for CopilotKit Cloud which we are not using
- The LLM for the chat sidebar is Google Gemini 2.5 Flash
- The chat sidebar is the tutor that helps during the quiz but NEVER reveals answers
- CopilotKit handles ONLY the chat sidebar — the agent workflow is handled separately by LangGraph

TASK 1 — Create app/providers.tsx:

"use client";
import { CopilotKit } from "@copilotkit/react-core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKit>
  );
}

TASK 2 — Update app/layout.tsx to use Providers:

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AI Lesson Builder",
  description: "Transform any PDF into an interactive AI-powered lesson",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

TASK 3 — Replace app/api/copilotkit/route.ts with the full runtime implementation:

import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.5-flash",
});

const copilotRuntime = new CopilotRuntime();

export async function POST(req: NextRequest) {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    req,
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });
  return handleRequest(req);
}

TASK 4 — Update app/lesson/page.tsx to test the sidebar renders:

"use client";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function LessonPage() {
  return (
    <div className="flex min-h-screen bg-bg">
      <main className="flex-1 p-8">
        <h1 className="font-serif text-3xl text-primary">Lesson Page</h1>
        <p className="font-sans text-secondary mt-2">CopilotKit sidebar test.</p>
      </main>
      <CopilotSidebar
        defaultOpen={true}
        instructions="You are a helpful learning tutor. Be concise. Never reveal answers to quiz questions."
        labels={{
          title: "Learning Tutor",
          initial: "Hi! I am your tutor for this lesson. Ask me anything!",
        }}
      />
    </div>
  );
}

CONSTRAINTS:
- Do NOT add publicApiKey anywhere — we are not using CopilotKit Cloud
- Do NOT import CopilotKit styles in layout.tsx — only in the page that uses CopilotSidebar
- Do NOT change the model name — use exactly "gemini-2.5-flash"
- The GOOGLE_GENERATIVE_AI_API_KEY environment variable is already in .env.local

After completing all tasks, run: npm run dev
Go to localhost:3000/lesson — a chat sidebar must appear on the right side. Type "hello" and it must respond. If it responds, CopilotKit is working.

PROGRESS: When the sidebar responds to a message, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 03 — CopilotKit Runtime".
```

---

## PROMPT 04 — LangGraph State Interfaces & Graph Skeleton

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/STEP_04_LANGGRAPH.md

You are working on "AI Lesson Builder". CopilotKit is set up. Now you are building the LangGraph agent — the core brain of the application.

Read /docs/AGENT_ARCHITECTURE.md very carefully. It explains:
- All 6 nodes and what each one does
- The full state shape with every field
- The graph edges and routing logic
- How interrupt() and Command({ resume }) work for HITL

This step defines the TypeScript types and the graph structure. Nodes are still stubs — logic comes in later prompts.

TASK 1 — Replace lib/agent/state.ts with the complete state definition:

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

TASK 2 — Replace lib/agent/graph.ts with the complete graph skeleton:

import { StateGraph, MemorySaver, START, END } from "@langchain/langgraph";
import { LessonStateAnnotation, LessonState } from "./state";
import { extractNode } from "./nodes/extractNode";
import { planNode } from "./nodes/planNode";
import { hitlNode } from "./nodes/hitlNode";
import { mcqNode } from "./nodes/mcqNode";
import { answerNode } from "./nodes/answerNode";
import { summaryNode } from "./nodes/summaryNode";

function routeAfterAnswer(state: LessonState): "mcq" | "summary" {
  const hasMoreQuestions =
    state.currentMCQIndex < state.currentMCQs.length - 1;
  const hasMoreObjectives =
    state.currentObjectiveIndex < state.lessonPlan.length - 1;
  return hasMoreQuestions || hasMoreObjectives ? "mcq" : "summary";
}

const checkpointer = new MemorySaver();

export const lessonGraph = new StateGraph(LessonStateAnnotation)
  .addNode("extract", extractNode)
  .addNode("plan", planNode)
  .addNode("hitl", hitlNode)
  .addNode("mcq", mcqNode)
  .addNode("answer", answerNode)
  .addNode("summary", summaryNode)
  .addEdge(START, "extract")
  .addEdge("extract", "plan")
  .addEdge("plan", "hitl")
  .addEdge("hitl", "mcq")
  .addEdge("mcq", END)
  .addConditionalEdges("answer", routeAfterAnswer, {
    mcq: "mcq",
    summary: "summary",
  })
  .addEdge("summary", END)
  .compile({ checkpointer });

TASK 3 — Update all 6 node files with proper TypeScript signatures (still stubs, but typed correctly):

lib/agent/nodes/extractNode.ts:
import { LessonState } from "../state";
export async function extractNode(state: LessonState): Promise<Partial<LessonState>> {
  return { phase: "planning" };
}

lib/agent/nodes/planNode.ts:
import { LessonState } from "../state";
export async function planNode(state: LessonState): Promise<Partial<LessonState>> {
  return {};
}

lib/agent/nodes/hitlNode.ts:
import { LessonState } from "../state";
export async function hitlNode(state: LessonState): Promise<Partial<LessonState>> {
  return {};
}

lib/agent/nodes/mcqNode.ts:
import { LessonState } from "../state";
export async function mcqNode(state: LessonState): Promise<Partial<LessonState>> {
  return {};
}

lib/agent/nodes/answerNode.ts:
import { LessonState } from "../state";
export async function answerNode(state: LessonState): Promise<Partial<LessonState>> {
  return {};
}

lib/agent/nodes/summaryNode.ts:
import { LessonState } from "../state";
export async function summaryNode(state: LessonState): Promise<Partial<LessonState>> {
  return {};
}

CONSTRAINTS:
- Do not implement any node logic yet — that comes in later prompts
- Do not change the state field names — they are referenced exactly in later prompts
- Do not add any extra state fields not listed above
- The graph edges must be exactly as shown — do not add or remove edges

After completing all tasks, run: npm run dev
TypeScript must compile with zero errors. No runtime test needed yet.

PROGRESS: When TypeScript compiles clean, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 04 — LangGraph State & Types".
```

---

## PROMPT 05 — PDF Upload API Route & Landing Page

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/UI_DESIGN.md
- /docs/STEP_05_PDF.md

You are working on "AI Lesson Builder". The project structure, styles, CopilotKit, and LangGraph skeleton are all set up. Now you are building the entry point: the landing page with PDF upload, and the API route that parses the PDF.

Key facts from the project docs:
- User uploads a PDF on the landing page (drag-drop or click to browse)
- The /api/upload route uses pdf-parse to extract text from the PDF
- Extracted text is stored in sessionStorage as "pdfContent"
- After upload, user is redirected to /lesson
- Max file size: 25MB. Only accept .pdf files.
- UI style: warm cream background, serif headline, terracotta orange CTA button (see /docs/UI_DESIGN.md)

TASK 1 — Replace lib/utils/pdfParser.ts:

import pdfParse from "pdf-parse";

export async function parsePDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}

TASK 2 — Replace app/api/upload/route.ts:

import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/utils/pdfParser";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const content = await parsePDF(buffer);

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF. Please use a text-based PDF, not a scanned image." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      content: content.substring(0, 50000),
      charCount: content.length,
      filename: file.name,
    });
  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF. Please try another file." },
      { status: 500 }
    );
  }
}

TASK 3 — Replace components/LandingPage.tsx with the full landing page UI. Follow the design in /docs/UI_DESIGN.md — warm cream background, serif headline, terracotta orange button, minimal layout:

"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        setIsUploading(false);
        return;
      }

      sessionStorage.setItem("pdfContent", data.content);
      sessionStorage.setItem("pdfFilename", data.filename);
      router.push("/lesson");
    } catch {
      setError("Something went wrong. Please try again.");
      setIsUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="border-b border-border-subtle bg-bg px-8 py-5 flex items-center justify-between">
        <span className="font-serif text-xl font-medium text-primary">
          AI Lesson Builder
        </span>
        <span className="font-sans text-sm text-muted">by Memorang</span>
      </nav>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <p className="label-tag mb-5">AI-POWERED LEARNING</p>

        <h1 className="font-serif text-5xl md:text-6xl font-medium text-primary leading-tight mb-6">
          Turn any PDF into<br />an interactive lesson.
        </h1>

        <p className="font-sans text-secondary text-lg leading-relaxed mb-4">
          Upload a document and get a structured lesson plan, AI-generated quiz questions, real-time feedback, and a personalized performance summary.
        </p>

        <div className="flex items-center justify-center gap-6 mb-14 font-sans text-sm text-muted">
          <span>✓ Lesson plan with objectives</span>
          <span>✓ MCQ quiz from your content</span>
          <span>✓ AI tutor for hints</span>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-2xl p-14 cursor-pointer transition-all duration-200 mb-3
            ${isUploading ? "border-border bg-surface cursor-default" : ""}
            ${isDragging ? "border-accent bg-accent/5" : ""}
            ${!isUploading && !isDragging ? "border-border hover:border-accent/50 hover:bg-surface" : ""}
          `}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="text-3xl mb-3">⏳</div>
              <p className="font-sans font-medium text-primary mb-1">
                Parsing your PDF...
              </p>
              <p className="font-sans text-muted text-sm">This takes a few seconds</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-3">📄</div>
              <p className="font-sans font-medium text-primary mb-1">
                Drop your PDF here
              </p>
              <p className="font-sans text-muted text-sm">
                or click to browse — max 25MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={onFileChange}
        />

        {error && (
          <p className="font-sans text-error text-sm mt-3 animate-fadeIn">
            {error}
          </p>
        )}

        <p className="font-sans text-muted text-xs mt-6">
          Works with textbooks, lecture notes, research papers, and study guides.
          No account required.
        </p>
      </div>
    </div>
  );
}

TASK 4 — Update app/page.tsx to use LandingPage:

import { LandingPage } from "@/components/LandingPage";

export default function HomePage() {
  return <LandingPage />;
}

CONSTRAINTS:
- Do not add any authentication or login
- Do not save the PDF file anywhere — only extract text and store in sessionStorage
- The upload area must support both drag-drop AND click-to-browse
- Error messages must be displayed in text-error color (warm red from the theme)
- Follow the exact UI style from /docs/UI_DESIGN.md — cream bg, serif headline, terracotta CTA

After completing all tasks, run: npm run dev
Test: go to localhost:3000, drag a PDF onto the upload area. It should show "Parsing your PDF..." then redirect to /lesson. Check browser DevTools > Application > Session Storage — "pdfContent" must contain extracted text.

PROGRESS: When upload and redirect work correctly, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 05 — PDF Upload".
```

---

## PROMPT 06 — Plan Generator Node (Gemini Generates Lesson Plan)

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/STEP_06_PLAN.md

You are working on "AI Lesson Builder". The PDF upload works and content is stored in sessionStorage. Now you are implementing the first AI-powered node: the plan generator that calls Google Gemini 2.5 Flash to analyze the PDF content and produce a structured lesson plan with 3-5 learning objectives.

Key facts from /docs/AGENT_ARCHITECTURE.md:
- planNode calls Gemini with the PDF content
- It must return a valid JSON array of LearningObjective objects
- Each objective has: title (max 8 words), description (one sentence), difficulty ("beginner" | "intermediate" | "advanced")
- Gemini sometimes wraps JSON in markdown code blocks — the node must strip these
- After planNode runs, the graph goes to hitlNode which pauses for user approval

TASK 1 — Replace lib/agent/nodes/planNode.ts with the full implementation:

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

TASK 2 — Create the /api/lesson route with support for the 'start' action only (other actions come in PROMPT 07):

import { NextRequest, NextResponse } from "next/server";
import { lessonGraph } from "@/lib/agent/graph";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, threadId, data } = body;

    if (action === "start") {
      const newThreadId = crypto.randomUUID();
      const config = { configurable: { thread_id: newThreadId } };

      const result = await lessonGraph.invoke(
        {
          pdfContent: data.pdfContent,
          phase: "extracting",
        },
        config
      );

      return NextResponse.json({
        ...result,
        threadId: newThreadId,
      });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Lesson API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

CONSTRAINTS:
- Use exactly "gemini-2.5-flash" as the model name
- The JSON cleaning must strip markdown code blocks — Gemini sometimes adds them
- Do not add the 'resume' or 'answer' actions yet — those come in PROMPT 07
- The GOOGLE_GENERATIVE_AI_API_KEY is already in .env.local

After completing all tasks, run: npm run dev
Test in browser console (or Postman):
fetch('/api/lesson', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'start',
    data: { pdfContent: 'Introduction to machine learning. Supervised learning uses labeled data to train models. Unsupervised learning finds patterns in unlabeled data. Neural networks are inspired by the human brain and consist of layers of interconnected nodes.' }
  })
}).then(r => r.json()).then(console.log)

Expected result: a JSON object with a lessonPlan array of 3-5 objectives and a threadId string.

PROGRESS: When the API returns a valid lesson plan, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 06 — Plan Generator Node".
```

---

## PROMPT 07 — HITL Node, Plan Display UI & Resume API

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/UI_DESIGN.md
- /docs/STEP_07_HITL.md

You are working on "AI Lesson Builder". The plan generator works. Now you are implementing the most important architectural piece: the Human-in-the-Loop (HITL) interrupt.

Key facts from /docs/AGENT_ARCHITECTURE.md:
- hitlNode calls LangGraph's interrupt() function which PAUSES the graph completely
- The paused state is saved by MemorySaver under the thread_id
- The frontend shows the plan and an Approve button
- When user clicks Approve, the frontend calls /api/lesson with action: 'resume' and the same thread_id
- The API resumes the graph using: lessonGraph.invoke(new Command({ resume: { approved: true } }), config)
- This is the exact LangGraph HITL pattern — do not use any other approach

TASK 1 — Replace lib/agent/nodes/hitlNode.ts:

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

TASK 2 — Update app/api/lesson/route.ts to add 'resume' and 'answer' action handling:

import { NextRequest, NextResponse } from "next/server";
import { lessonGraph } from "@/lib/agent/graph";
import { Command } from "@langchain/langgraph";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, threadId, data } = body;

    if (action === "start") {
      const newThreadId = crypto.randomUUID();
      const config = { configurable: { thread_id: newThreadId } };
      const result = await lessonGraph.invoke(
        { pdfContent: data.pdfContent, phase: "extracting" },
        config
      );
      return NextResponse.json({ ...result, threadId: newThreadId });
    }

    if (action === "resume") {
      const config = { configurable: { thread_id: threadId } };
      const result = await lessonGraph.invoke(
        new Command({ resume: data }),
        config
      );
      return NextResponse.json({ ...result, threadId });
    }

    if (action === "answer") {
      const config = { configurable: { thread_id: threadId } };
      const result = await lessonGraph.invoke(
        new Command({ resume: data }),
        config
      );
      return NextResponse.json({ ...result, threadId });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Lesson API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

TASK 3 — Replace components/lesson/PlanDisplay.tsx with the full UI. Follow /docs/UI_DESIGN.md for colors and component patterns:

"use client";
import { LearningObjective } from "@/lib/agent/state";

interface PlanDisplayProps {
  plan: LearningObjective[];
  filename: string;
  onApprove: () => void;
  isLoading: boolean;
}

export function PlanDisplay({
  plan,
  filename,
  onApprove,
  isLoading,
}: PlanDisplayProps) {
  const difficultyStyles: Record<string, string> = {
    beginner: "bg-success/10 text-success border border-success/20",
    intermediate: "bg-accent/10 text-accent border border-accent/20",
    advanced: "bg-error/10 text-error border border-error/20",
  };

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <p className="label-tag mb-3">YOUR LESSON PLAN</p>
      <h2 className="font-serif text-4xl font-medium text-primary mb-2">
        Here's what we'll cover.
      </h2>
      <p className="font-sans text-secondary mb-1">
        Based on: <span className="text-primary font-medium">{filename}</span>
      </p>
      <p className="font-sans text-muted text-sm mb-8">
        Review your personalized learning path and click Begin when ready.
      </p>

      <div className="space-y-3 mb-8">
        {plan.map((obj, i) => (
          <div key={i} className="card flex items-start gap-4">
            <span className="font-sans text-muted font-medium text-sm w-8 flex-shrink-0 pt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-sans font-medium text-primary">
                  {obj.title}
                </h3>
                <span
                  className={`font-sans text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyStyles[obj.difficulty] || difficultyStyles.beginner}`}
                >
                  {obj.difficulty}
                </span>
              </div>
              <p className="font-sans text-secondary text-sm leading-relaxed">
                {obj.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onApprove}
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? "Starting lesson..." : `Begin Lesson — ${plan.length} objectives →`}
      </button>
    </div>
  );
}

CONSTRAINTS:
- The hitlNode must use LangGraph's interrupt() exactly as shown — not a custom solution
- The 'resume' and 'answer' actions must use new Command({ resume: data }) exactly as shown
- The same thread_id must be passed back on every resume/answer call — this is how MemorySaver tracks state
- Do not use any other state persistence mechanism

After completing all tasks, run: npm run dev
TypeScript must compile with zero errors.

PROGRESS: When done, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 07 — HITL Node & Resume API".
```

---

## PROMPT 08 — MCQ Generator Node & Answer Node

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/STEP_08_MCQ.md

You are working on "AI Lesson Builder". The HITL plan approval is implemented. Now you are building the quiz engine: the mcqNode that generates questions from the PDF and the answerNode that checks answers and advances the lesson state.

Key facts from /docs/AGENT_ARCHITECTURE.md:
- mcqNode generates 3 MCQs per learning objective using Gemini
- Each MCQ has: id, question, 4 options, correctIndex (0-3), explanation (shown on correct), hint (shown on wrong — must NOT reveal the answer)
- mcqNode uses interrupt() to pause and wait for the user's answer
- The user's selectedIndex comes back via Command({ resume: { selectedIndex: number } })
- answerNode checks isCorrect, records the answer, and advances currentMCQIndex or currentObjectiveIndex
- If wrong answer: stay on same question (retry without penalty, do not advance)
- If correct: advance to next question or next objective or summary

TASK 1 — Replace lib/agent/nodes/mcqNode.ts with the full implementation:

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { interrupt } from "@langchain/langgraph";
import { LessonState, MCQuestion, AnswerRecord } from "../state";

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

TASK 2 — Replace lib/agent/nodes/answerNode.ts with the index advancement logic:

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

CONSTRAINTS:
- mcqNode handles both MCQ generation AND answer checking (via interrupt resume)
- answerNode only handles index advancement — it does not call Gemini
- Hints must NEVER reveal the correct answer — this is checked by the CopilotKit tutor rules
- Use exactly "gemini-2.5-flash" as the model name

After completing all tasks, run: npm run dev
TypeScript must compile with zero errors.

PROGRESS: When done, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 08 — MCQ Generator Node".
```

---

## PROMPT 09 — MCQ Widget, Feedback & Progress Bar Components

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/UI_DESIGN.md
- /docs/STEP_09_MCQ_WIDGET.md

You are working on "AI Lesson Builder". The agent nodes are implemented. Now you are building the visual quiz interface — the components the user actually interacts with during the lesson.

Read /docs/UI_DESIGN.md carefully for:
- Exact color classes for correct (success green) and incorrect (error red) states
- The shake animation class for wrong answers
- Radio button styling patterns
- Card and button component patterns

TASK 1 — Replace components/lesson/MCQWidget.tsx with the complete interactive quiz widget:

"use client";
import { useState } from "react";
import { MCQuestion } from "@/lib/agent/state";

interface MCQWidgetProps {
  question: MCQuestion;
  objectiveTitle: string;
  objectiveIndex: number;
  totalObjectives: number;
  mcqIndex: number;
  totalMCQs: number;
  onAnswer: (selectedIndex: number) => void;
  isLoading: boolean;
}

export function MCQWidget({
  question,
  objectiveTitle,
  objectiveIndex,
  totalObjectives,
  mcqIndex,
  totalMCQs,
  onAnswer,
  isLoading,
}: MCQWidgetProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function handleSubmit() {
    if (selected === null || hasSubmitted || isLoading) return;
    setHasSubmitted(true);
    onAnswer(selected);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <p className="label-tag">
            OBJECTIVE {objectiveIndex + 1}/{totalObjectives}
          </p>
          <p className="font-sans text-muted text-xs">
            Question {mcqIndex + 1} of {totalMCQs}
          </p>
        </div>
        <p className="font-sans text-secondary text-sm mb-3">{objectiveTitle}</p>
        <div className="w-full h-1.5 bg-surface border border-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${
                ((objectiveIndex * totalMCQs + mcqIndex) /
                  (totalObjectives * totalMCQs)) *
                100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-serif text-2xl font-medium text-primary leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isDisabled = hasSubmitted || isLoading;

          return (
            <button
              key={i}
              onClick={() => !isDisabled && setSelected(i)}
              disabled={isDisabled}
              className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150
                ${isDisabled ? "cursor-default" : "cursor-pointer hover:bg-elevated hover:border-accent/40"}
                ${isSelected && !hasSubmitted ? "border-accent bg-accent/5" : "border-border bg-surface"}
              `}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors
                  ${isSelected && !hasSubmitted ? "border-accent bg-accent" : "border-border"}
                `}
              >
                {isSelected && !hasSubmitted && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`font-sans text-[15px] leading-relaxed
                  ${isSelected && !hasSubmitted ? "text-accent font-medium" : "text-primary"}
                `}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {!hasSubmitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null || isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? "Submitting..." : "Submit Answer"}
        </button>
      )}

      {hasSubmitted && isLoading && (
        <div className="text-center py-4">
          <p className="font-sans text-secondary text-sm">Checking your answer...</p>
        </div>
      )}
    </div>
  );
}

TASK 2 — Replace components/lesson/FeedbackDisplay.tsx:

"use client";

interface FeedbackDisplayProps {
  isCorrect: boolean;
  explanation?: string;
  hint?: string;
  onNext: () => void;
  onRetry: () => void;
  isLoading: boolean;
}

export function FeedbackDisplay({
  isCorrect,
  explanation,
  hint,
  onNext,
  onRetry,
  isLoading,
}: FeedbackDisplayProps) {
  return (
    <div
      className={`rounded-2xl border p-6 mb-6 animate-fadeIn
        ${isCorrect
          ? "border-success bg-success/5"
          : "border-error bg-error/5 animate-shake"
        }`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl flex-shrink-0">
          {isCorrect ? "✓" : "✗"}
        </span>
        <div>
          <p
            className={`font-sans font-semibold mb-2 ${
              isCorrect ? "text-success" : "text-error"
            }`}
          >
            {isCorrect ? "Correct!" : "Not quite — give it another try!"}
          </p>
          {isCorrect && explanation && (
            <p className="font-sans text-secondary text-sm leading-relaxed">
              {explanation}
            </p>
          )}
          {!isCorrect && hint && (
            <p className="font-sans text-secondary text-sm leading-relaxed">
              <span className="font-medium text-primary">Hint: </span>
              {hint}
            </p>
          )}
        </div>
      </div>

      {isCorrect ? (
        <button onClick={onNext} disabled={isLoading} className="btn-primary">
          {isLoading ? "Loading next question..." : "Next Question →"}
        </button>
      ) : (
        <button onClick={onRetry} className="btn-secondary">
          Try Again
        </button>
      )}
    </div>
  );
}

TASK 3 — Replace components/lesson/ProgressBar.tsx:

"use client";
import { LessonPhase } from "@/lib/agent/state";

interface ProgressBarProps {
  currentObjective: number;
  totalObjectives: number;
  currentMCQ: number;
  totalMCQs: number;
  phase: LessonPhase;
}

export function ProgressBar({
  currentObjective,
  totalObjectives,
  currentMCQ,
  totalMCQs,
  phase,
}: ProgressBarProps) {
  const hiddenPhases: LessonPhase[] = ["idle", "extracting", "hitl", "complete"];
  if (hiddenPhases.includes(phase)) return null;

  const totalSteps = totalObjectives * (totalMCQs || 3);
  const completedSteps = currentObjective * (totalMCQs || 3) + currentMCQ;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="px-8 py-3 border-b border-border bg-surface flex items-center gap-4">
      <span className="font-sans text-muted text-xs flex-shrink-0 w-28">
        Objective {currentObjective + 1}/{totalObjectives}
      </span>
      <div className="flex-1 h-1.5 bg-bg border border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-sans text-muted text-xs flex-shrink-0 w-10 text-right">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

CONSTRAINTS:
- The MCQ widget must reset its internal selected state when a new question is shown (this happens because the parent re-renders with a new question prop)
- Correct answer: success green border and background
- Wrong answer: error red border and background WITH the animate-shake class
- The retry button (wrong answer) must NOT advance to the next question — it just resets the widget state
- Do not show the correct answer to the user after a wrong attempt — only show the hint

After completing all tasks, run: npm run dev
TypeScript must compile with zero errors. Visual testing comes in PROMPT 12.

PROGRESS: When done, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 09 — MCQ Widget Component".
```

---

## PROMPT 10 — Summary Node & Summary Display Component

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/UI_DESIGN.md
- /docs/STEP_10_SUMMARY.md

You are working on "AI Lesson Builder". The quiz engine is built. Now you are implementing the final stage: the summary that wraps up the lesson with a performance report and personalized study tips.

Key facts from /docs/AGENT_ARCHITECTURE.md:
- summaryNode calls Gemini with the user's score and weak areas
- It returns: totalQuestions, correctAnswers, scorePercentage, objectiveBreakdown, studyTips (array), encouragement (string)
- The summary is stored in LessonState.summary as a SummaryReport object
- Score >= 80%: green progress bar. 60-79%: accent orange. Below 60%: red.

TASK 1 — Replace lib/agent/nodes/summaryNode.ts:

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

TASK 2 — Replace components/lesson/SummaryDisplay.tsx:

"use client";
import { SummaryReport } from "@/lib/agent/state";

interface SummaryDisplayProps {
  summary: SummaryReport;
  filename: string;
  onStartOver: () => void;
}

export function SummaryDisplay({
  summary,
  filename,
  onStartOver,
}: SummaryDisplayProps) {
  const scoreEmoji =
    summary.scorePercentage >= 80
      ? "🎉"
      : summary.scorePercentage >= 60
        ? "💪"
        : "📚";

  const scoreBarColor =
    summary.scorePercentage >= 80
      ? "bg-success"
      : summary.scorePercentage >= 60
        ? "bg-accent"
        : "bg-error";

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <p className="label-tag mb-3">LESSON COMPLETE</p>
      <h2 className="font-serif text-4xl font-medium text-primary mb-2">
        {scoreEmoji} Your Results
      </h2>
      <p className="font-sans text-secondary mb-8 leading-relaxed">
        {summary.encouragement}
      </p>

      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-secondary text-sm">Final Score</span>
          <span className="font-serif text-4xl font-medium text-primary">
            {summary.scorePercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-bg border border-border rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor}`}
            style={{ width: `${summary.scorePercentage}%` }}
          />
        </div>
        <p className="font-sans text-muted text-sm">
          {summary.correctAnswers} of {summary.totalQuestions} questions correct
        </p>
      </div>

      <div className="card mb-4">
        <h3 className="font-sans font-medium text-primary mb-4">
          Objective Breakdown
        </h3>
        <div className="space-y-3">
          {summary.objectiveBreakdown.map((obj, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-sans text-secondary text-sm">{obj.title}</p>
              </div>
              <span
                className={`font-sans text-sm font-medium flex-shrink-0 ${
                  obj.total === 0
                    ? "text-muted"
                    : obj.correct / obj.total >= 0.7
                      ? "text-success"
                      : "text-error"
                }`}
              >
                {obj.correct}/{obj.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="font-sans font-medium text-primary mb-4">Study Tips</h3>
        <ul className="space-y-3">
          {summary.studyTips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-accent font-medium flex-shrink-0">→</span>
              <span className="font-sans text-secondary text-sm leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={onStartOver} className="btn-primary w-full">
        Start a New Lesson
      </button>
    </div>
  );
}

CONSTRAINTS:
- summaryNode must strip markdown code blocks from Gemini's response before parsing JSON
- Score bar color: green >= 80%, orange 60-79%, red < 60%
- The "Start a New Lesson" button clears session data and returns to landing page
- Do not show the correct answers in the breakdown — only show correct count vs total

After completing all tasks, run: npm run dev
TypeScript must compile with zero errors.

PROGRESS: When done, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 10 — Summary Node & Display".
```

---

## PROMPT 11 — Full Lesson Page: Wiring All Components Together

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/AGENT_ARCHITECTURE.md
- /docs/UI_DESIGN.md
- /docs/STEP_12_WIRING.md

You are working on "AI Lesson Builder". All components and API routes are built. This is the most important prompt — you are wiring everything together into the complete lesson page.

Read /docs/AGENT_ARCHITECTURE.md — specifically the "Session Flow" and "CopilotKit Chat System Prompt" sections. The lesson page must:
1. Read pdfContent from sessionStorage on mount
2. Call /api/lesson with action: 'start' to begin the agent
3. Show PlanDisplay when phase is 'hitl'
4. Show MCQWidget when phase is 'quiz'
5. Show FeedbackDisplay below MCQWidget when phase is 'feedback'
6. Show SummaryDisplay when phase is 'complete'
7. Keep CopilotSidebar open throughout with a system prompt that NEVER reveals answers
8. Pass lesson state to useCopilotReadable WITHOUT including correctIndex or explanation

Replace app/lesson/page.tsx with the COMPLETE implementation:

"use client";
import { useState, useEffect } from "react";
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
  LearningObjective,
  MCQuestion,
  SummaryReport,
  LessonPhase,
} from "@/lib/agent/state";

interface LessonUIState {
  phase: LessonPhase;
  plan: LearningObjective[];
  currentMCQ: MCQuestion | null;
  objectiveIndex: number;
  mcqIndex: number;
  totalObjectives: number;
  totalMCQs: number;
  isCorrect: boolean | null;
  explanation: string | null;
  hint: string | null;
  summary: SummaryReport | null;
  error: string | null;
}

const initialState: LessonUIState = {
  phase: "idle",
  plan: [],
  currentMCQ: null,
  objectiveIndex: 0,
  mcqIndex: 0,
  totalObjectives: 0,
  totalMCQs: 3,
  isCorrect: null,
  explanation: null,
  hint: null,
  summary: null,
  error: null,
};

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
      currentOptions: lessonState.currentMCQ?.options ?? null,
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
      return json;
    } finally {
      setIsApiLoading(false);
    }
  }

  async function startLesson(pdfContent: string) {
    setLessonState((prev) => ({ ...prev, phase: "extracting" }));
    try {
      const result = await callLessonAPI("start", { pdfContent });
      setThreadId(result.threadId);
      setLessonState((prev) => ({
        ...prev,
        phase: "hitl",
        plan: result.lessonPlan ?? [],
        totalObjectives: result.lessonPlan?.length ?? 0,
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
      setLessonState((prev) => ({
        ...prev,
        phase: "quiz",
        currentMCQ: result.currentMCQs?.[result.currentMCQIndex ?? 0] ?? null,
        objectiveIndex: result.currentObjectiveIndex ?? 0,
        mcqIndex: result.currentMCQIndex ?? 0,
        totalMCQs: result.currentMCQs?.length ?? 3,
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
          summary: result.summary,
        }));
        return;
      }

      const lastAnswer = result.answers?.[result.answers.length - 1];
      const isCorrect = lastAnswer?.isCorrect ?? false;
      const answeredMCQ = result.currentMCQs?.[result.currentMCQIndex ?? 0];

      setLessonState((prev) => ({
        ...prev,
        phase: "feedback",
        isCorrect,
        explanation: isCorrect ? (answeredMCQ?.explanation ?? null) : null,
        hint: !isCorrect ? (answeredMCQ?.hint ?? null) : null,
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
      phase: "quiz",
      isCorrect: null,
      explanation: null,
    }));
    try {
      const result = await callLessonAPI("resume", { nextQuestion: true });

      if (result.phase === "complete" || result.summary) {
        setLessonState((prev) => ({
          ...prev,
          phase: "complete",
          summary: result.summary,
        }));
        return;
      }

      setLessonState((prev) => ({
        ...prev,
        phase: "quiz",
        currentMCQ:
          result.currentMCQs?.[result.currentMCQIndex ?? 0] ?? prev.currentMCQ,
        objectiveIndex: result.currentObjectiveIndex ?? prev.objectiveIndex,
        mcqIndex: result.currentMCQIndex ?? prev.mcqIndex,
        totalMCQs: result.currentMCQs?.length ?? prev.totalMCQs,
      }));
    } catch (e: unknown) {
      setLessonState((prev) => ({
        ...prev,
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
    }));
  }

  function handleStartOver() {
    sessionStorage.removeItem("pdfContent");
    sessionStorage.removeItem("pdfFilename");
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
            lessonState.phase === "planning") && (
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
                  key={lessonState.currentMCQ.id}
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

STRICT RULES — follow these without exception:
1. NEVER reveal the correct answer to any quiz question
2. NEVER say which option letter or number is correct
3. NEVER hint at which specific option to choose
4. DO provide conceptual explanations to deepen understanding
5. DO give encouraging, thoughtful hints about the topic
6. If asked directly for the answer, say: "I can't give that away! Try thinking about [relevant concept from the question topic]."
7. Keep all responses to 2-3 sentences maximum — be concise
8. Always end by encouraging the student to try submitting an answer
9. Be warm, friendly, and supportive — learning is hard!`}
          labels={{
            title: "Learning Tutor",
            initial:
              "Hi! I'm your AI tutor for this lesson 👋 Ask me anything about the topics you're studying. I'll give hints and explanations — but I won't spoil the answers!",
          }}
        />
      </aside>
    </div>
  );
}

CONSTRAINTS:
- The key prop on MCQWidget must be question.id — this forces React to reset internal state when a new question loads
- useCopilotReadable must NOT include correctIndex, explanation, or hint — the tutor must genuinely not know the answer
- The thread_id must be passed on EVERY API call after the initial start
- If pdfContent is missing from sessionStorage, redirect to "/"
- Do not remove the CopilotSidebar or make it optional — it is a core assignment requirement

After completing all tasks, run: npm run dev
Test the COMPLETE flow end to end:
1. Go to localhost:3000 — landing page shows
2. Upload a PDF — redirects to /lesson
3. Loading state shows while agent runs
4. Plan appears with objectives — click Begin Lesson
5. First MCQ question appears
6. Submit correct answer — green feedback with explanation
7. Submit wrong answer — red feedback with hint — retry works
8. Complete all questions — summary page shows
9. Chat sidebar responds to questions without revealing answers

PROGRESS: When full flow works end to end, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 11 — Full Lesson Page".
```

---

## PROMPT 12 — README, Final Polish & Deploy Prep

```
Before doing anything, read these files in my project:
- /docs/PROJECT_OVERVIEW.md
- /docs/STEP_14_DEPLOY.md

You are working on "AI Lesson Builder". The full application is working end to end. This final step prepares the project for submission: README, cleanup, and Vercel deployment.

TASK 1 — Create README.md in the project root:

# AI Lesson Builder

An AI-powered web application that transforms any PDF into an interactive, structured lesson with MCQ quizzes, real-time feedback, and a personalized performance summary.

Built as a skills assessment for Memorang.

## Live Demo
[Add your Vercel URL here after deployment]

## Features

- **PDF Upload** — Drag-drop or click to upload any PDF (up to 25MB)
- **AI Lesson Plan** — Gemini 2.5 Flash analyzes the document and generates 3-5 structured learning objectives
- **Human-in-the-Loop (HITL)** — User reviews and approves the lesson plan before the quiz begins
- **Interactive MCQ Quiz** — 3 AI-generated questions per objective, drawn directly from the PDF content
- **Visual Feedback** — Green highlight + explanation for correct answers, red highlight + hint for wrong answers
- **Retry Without Penalty** — Wrong answers can be retried as many times as needed
- **AI Tutor Chat** — CopilotKit-powered sidebar tutor that provides hints but never reveals answers
- **Performance Summary** — Personalized score breakdown and study tips at the end

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Agent Workflow | LangGraph JS (HITL with MemorySaver checkpointing) |
| LLM | Google Gemini 2.5 Flash (free tier) |
| Chat UI | CopilotKit (self-hosted, no cloud key required) |
| PDF Parsing | pdf-parse |
| Styling | Tailwind CSS (custom warm cream theme) |
| Deployment | Vercel |

## Architecture

The app uses a LangGraph StateGraph with 6 nodes and two HITL interrupt points:

```
PDF Upload → Extract → Plan → [INTERRUPT: Plan Approval] → MCQ → [INTERRUPT: Answer] → Summary
```

1. **Plan Interrupt** — After generating the lesson plan, the graph pauses. The user reviews objectives and clicks "Begin Lesson" to resume.
2. **MCQ Interrupt** — After each question is generated, the graph pauses for the user's answer. On resume, it checks correctness, records the result, and routes to the next question or summary.

State is preserved between requests using LangGraph's MemorySaver, keyed by a thread_id stored in sessionStorage.

## Setup

### Prerequisites
- Node.js 18+
- A Google Gemini API key (free at https://aistudio.google.com — no credit card required)

### Local Development

1. Clone the repository:
   git clone https://github.com/onen01/ai-lesson-builder.git
   cd ai-lesson-builder

2. Install dependencies:
   npm install

3. Create .env.local:
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

4. Run the development server:
   npm run dev

5. Open http://localhost:3000

### Deployment (Vercel)

1. Push to GitHub
2. Import repo on vercel.com
3. Add environment variable: GOOGLE_GENERATIVE_AI_API_KEY
4. Deploy

## Project Structure

```
app/
  api/copilotkit/   → CopilotKit runtime (chat tutor backend)
  api/lesson/       → LangGraph agent executor (HITL workflow)
  api/upload/       → PDF parser endpoint
  lesson/           → Main lesson page (quiz interface)
  page.tsx          → Landing page with PDF upload
components/
  lesson/           → MCQWidget, PlanDisplay, FeedbackDisplay, SummaryDisplay, ProgressBar
lib/
  agent/            → LangGraph graph, state types, 6 node implementations
  utils/            → PDF parser utility
docs/               → Project documentation and build prompts
```

TASK 2 — Make sure .env.example exists in the project root with:
GOOGLE_GENERATIVE_AI_API_KEY=your_key_from_aistudio.google.com

TASK 3 — Check .gitignore includes all of these (add any missing ones):
.env.local
.env*.local
.next/
node_modules/
out/

TASK 4 — Run npm run build and fix any TypeScript or build errors until it passes completely.

TASK 5 — Run git add . && git commit -m "feat: complete AI lesson builder" && git push origin main

CONSTRAINTS:
- Do not commit .env.local — it must stay in .gitignore
- The README must include the architecture diagram showing the two interrupt points
- Fix all TypeScript errors before committing — the build must pass

After completing all tasks, the GitHub repo must be clean, public, and the build must pass with zero errors.

PROGRESS: When build passes and code is pushed to GitHub, open /docs/PROGRESS_TRACKER.md and tick off all items under "PROMPT 14 — README, Deploy & Loom".
Then deploy to Vercel and record your Loom video.
```
