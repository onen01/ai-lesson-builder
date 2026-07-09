# AI Lesson Builder — Project Overview
### Memorang Full-Stack AI Assignment

---

## What We're Building

A web app where a user uploads any PDF → an AI agent reads it → proposes a structured study plan → waits for user approval (HITL) → quizzes the user with MCQs generated from the PDF content → gives color-coded visual feedback on every answer → concludes with a personalized performance summary.

The key distinction from a chatbot: the agent has a **structured workflow** with real pause points, not just a chat thread.

---

## Session Flow (End to End)

```
User lands on "/"
  → Landing page (upload CTA)
  
User uploads PDF
  → /api/upload → pdf-parse → returns { content, sessionId }
  
Frontend starts agent
  → POST /api/lesson { action: 'start', pdfContent, threadId }
  → LangGraph: extract → plan → INTERRUPT (pause here)
  → Returns { phase: 'hitl', plan: [...objectives], threadId }

User reviews plan, clicks Approve
  → POST /api/lesson { action: 'resume', threadId, data: { approved: true } }
  → LangGraph resumes: → generate MCQs for objective[0] → INTERRUPT
  → Returns { phase: 'quiz', mcq: { question, options, id }, objectiveIndex: 0 }

User selects answer, clicks Submit
  → POST /api/lesson { action: 'answer', threadId, data: { answerId, selectedIndex } }
  → LangGraph resumes: → check answer → INTERRUPT
  → Returns { phase: 'feedback', isCorrect, explanation? or hint? }

Loop continues per objective until all done
  → Returns { phase: 'summary', report: { score, tips, objectiveBreakdown } }

User can ask the CopilotKit chat sidebar anything during quiz
  → Chat LLM has read-only access to current question but CANNOT give away the answer
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     NEXT.JS 14 APP                       │
│                                                         │
│  ┌───────────────────────┐  ┌─────────────────────┐    │
│  │   MAIN PANEL          │  │   CHAT SIDEBAR      │    │
│  │   /lesson/page.tsx    │  │   (CopilotKit)      │    │
│  │                       │  │                     │    │
│  │  [Phase: Upload]      │  │  Tutor AI           │    │
│  │  [Phase: Plan HITL]   │  │  - Hints            │    │
│  │  [Phase: MCQ Widget]  │  │  - Learn more       │    │
│  │  [Phase: Feedback]    │  │  - Encouragement    │    │
│  │  [Phase: Summary]     │  │  - No answer reveal │    │
│  └───────────────────────┘  └─────────────────────┘    │
│                                                         │
│  API ROUTES                                             │
│  /api/upload      → parse PDF, return text              │
│  /api/lesson      → run/resume LangGraph agent          │
│  /api/copilotkit  → CopilotKit runtime (chat sidebar)   │
│                                                         │
│  LIB                                                    │
│  /lib/agent/graph.ts     → StateGraph definition        │
│  /lib/agent/state.ts     → TypeScript interfaces         │
│  /lib/agent/nodes/*      → 6 node implementations       │
│  /lib/utils/pdfParser.ts → pdf-parse wrapper            │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | Next.js | 14.x (App Router) | Your stack, API routes, server components |
| Language | TypeScript | 5.x | Assignment requirement |
| Agent Workflow | LangGraph JS | @langchain/langgraph | HITL interrupts, stateful workflow, checkpointing |
| LLM | Google Gemini 2.5 Flash | via @langchain/google-genai | FREE, 1M context, handles long PDFs |
| Chat UI | CopilotKit | @copilotkit/react-core + ui + runtime | Assignment requirement, tutor sidebar |
| PDF Parsing | pdf-parse | 1.x | Simple Node.js PDF text extraction |
| Styling | Tailwind CSS | 3.x | Assignment-friendly utility classes |
| State | MemorySaver (LangGraph) | built-in | In-memory checkpointing, no DB needed for demo |
| Deployment | Vercel | latest | Free hobby tier, zero-config for Next.js |

**No database required.** LangGraph's MemorySaver handles all session state in-memory. Thread IDs stored in localStorage. Perfect for a demo.

---

## Color Palette (AdaptIQ-inspired)

```
Background:      #FAF7F0   Warm cream — page background
Surface:         #F0EBE1   Slightly darker cream — cards, panels  
Border:          #DDD5C5   Warm beige — all borders
Text Primary:    #1C1410   Very dark warm brown — headings, body
Text Secondary:  #7A6A58   Medium warm brown — labels, subtext
Text Muted:      #A8957A   Light brown — placeholders, disabled
Accent:          #C85C2E   Terracotta orange — CTAs, highlights
Accent Hover:    #B04D25   Darker orange — hover states
Accent Muted:    rgba(200,92,46,0.10)  — subtle accent backgrounds
Success:         #3D8C5E   Forest green — correct answer highlight
Error:           #C43835   Warm red — wrong answer highlight
```

**Fonts:**
- Headings: `Lora` (Google Fonts, serif — matches AdaptIQ editorial feel)
- Body / UI: `Inter` (Google Fonts, sans-serif — clean, readable)

---

## LangGraph: 6 Nodes

| Node | Purpose | Interrupts? |
|------|---------|------------|
| `extractNode` | Stores pdfContent in state, sets phase | No |
| `planNode` | Calls Gemini → generates 3-5 objectives as JSON | No |
| `hitlNode` | Pauses graph with `interrupt()` → waits for user plan approval | **YES** |
| `mcqNode` | Calls Gemini → generates 3 MCQs for current objective | **YES** (waits for answer) |
| `answerNode` | Checks answer, sets isCorrect, explanation/hint, advances index | No |
| `summaryNode` | Calls Gemini → generates performance report + study tips | No |

---

## API Routes

### POST /api/upload
```
Input:  FormData { file: PDF }
Output: { content: string, charCount: number }
```

### POST /api/lesson
```
Input (action: 'start'):
  { action: 'start', pdfContent: string, threadId: string }
  
Input (action: 'resume' — after HITL plan approval):
  { action: 'resume', threadId: string, data: { approved: boolean } }
  
Input (action: 'answer' — after MCQ answer):
  { action: 'answer', threadId: string, data: { selectedIndex: number } }

Output (any action):
  { 
    phase: 'hitl' | 'quiz' | 'feedback' | 'summary' | 'error',
    plan?: LearningObjective[],
    mcq?: MCQuestion,
    objectiveIndex?: number,
    mcqIndex?: number,
    isCorrect?: boolean,
    explanation?: string,
    hint?: string,
    summary?: SummaryReport,
    error?: string
  }
```

### POST /api/copilotkit
```
Handled entirely by CopilotKit runtime.
Powers the chat sidebar tutor AI.
Uses Gemini 2.5 Flash via GoogleGenerativeAIAdapter.
```

---

## Environment Variables

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=your_key_from_aistudio.google.com
```

That's it. One API key. Everything else is free npm packages.

---

## Folder Structure (Final)

```
/
├── app/
│   ├── api/
│   │   ├── copilotkit/route.ts
│   │   ├── lesson/route.ts
│   │   └── upload/route.ts
│   ├── lesson/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── lesson/
│   │   ├── MCQWidget.tsx
│   │   ├── PlanDisplay.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── FeedbackDisplay.tsx
│   │   └── SummaryDisplay.tsx
│   ├── LandingPage.tsx
│   └── LessonLayout.tsx
├── lib/
│   ├── agent/
│   │   ├── graph.ts
│   │   ├── state.ts
│   │   └── nodes/
│   │       ├── extractNode.ts
│   │       ├── planNode.ts
│   │       ├── hitlNode.ts
│   │       ├── mcqNode.ts
│   │       ├── answerNode.ts
│   │       └── summaryNode.ts
│   └── utils/
│       └── pdfParser.ts
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```
