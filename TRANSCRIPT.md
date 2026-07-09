# AI Tools Usage Transcript

### AI Lesson Builder — Memorang Assignment

---

## Overview

This document outlines how AI tools were used throughout the planning and
development of this project. AI was used as a structured collaborator — not to
blindly generate code, but to think through architecture, make decisions, and
produce precise implementation prompts.

---

## Tools Used

- **Claude (claude.ai)** — Pre-build planning, architecture design, research,
  prompt engineering
- **Codex (OpenAI)** — Code generation from pre-planned, structured prompts

---

## Phase 1: Research & Company Understanding (Claude)

Before writing a single line of code, Claude was used to deeply research
Memorang as a company — their product, business model, tech stack, funding
history, and the Forward Deployed Engineer role itself. This gave full context
on what the assignment was actually evaluating.

Key questions asked to Claude during this phase:

- "Completely scrape this company website, LinkedIn, Twitter. I want every
  single detail about them — when they came, what they were, how they became
  big, who's the CEO, what are they offering, what's their business model, how
  much have they raised, how many employees, where are their offices, timezone
  with respect to India."

This research phase ensured the technical decisions made later were aligned
with what Memorang actually values — agentic AI, structured workflows, and
customer-facing engineering.

---

## Phase 2: Architecture Design (Claude)

Rather than starting to code immediately, the full system architecture was
designed upfront with Claude before touching Codex. This included:

- Defining the complete LangGraph StateGraph — 6 nodes, edges, conditional
  routing, and two HITL interrupt points
- Designing all TypeScript interfaces, including `LessonState`, `MCQuestion`,
  `LearningObjective`, `SummaryReport`, and `AnswerRecord`
- Defining the three API routes and their exact request/response contracts
- Deciding the tech stack with reasoning for each choice
- Designing the UI system — color palette, fonts, and component hierarchy

Key decision-making prompts during this phase:

- "It was mentioned to use PostgreSQL for backend. But we haven't used it.
  Neither have we connected a DB. Should we integrate Supabase?"
  - Decision: MemorySaver is sufficient for a demo. No database needed. Adding
    PostgreSQL would add complexity with no user-facing benefit.

- "I thought Codex will do the coding but you wrote the code in prompts itself."
  - Reasoning: LangGraph's `interrupt`/`Command` pattern is too new for Codex to
    know reliably. The critical architectural code was pre-written to prevent
    Codex from hallucinating incorrect patterns. Everything else — components,
    styling, and API structure — Codex generated freely.

- "Which LLM should we use?"
  - Decision: Google Gemini 2.5 Flash. It has a free tier, a large context
    window, handles long PDF content, and produces solid structured JSON output.
    No credit card is required.

- "Should we make it constrained to a given PDF or usable by anyone with any
  PDF?"
  - Decision: Accept any PDF. This makes the demo universally useful and shows
    real product thinking, not a hardcoded demo.

---

## Phase 3: Prompt Engineering (Claude)

All 12 Codex prompts were written in advance by Claude before any code was
generated. Each prompt:

- Started with instructions to read the project docs for full context
- Described exactly what to build with constraints
- Included critical code snippets for patterns Codex would not reliably know,
  such as LangGraph interrupt handling, CopilotKit self-hosted runtime, and
  MemorySaver configuration
- Ended with a verification step and progress tracker instruction

The decision to pre-write all prompts rather than improvise was deliberate. It
meant every prompt was consistent with the architecture design and there was no
drift between what was planned and what was built.

See `/docs/PROMPTS.md` for all 12 prompts used with Codex.

---

## Phase 4: Code Generation (Codex)

Codex was used for all code generation, working through the 12 prompts
sequentially. One prompt was handled at a time and verified before moving to the
next.

Codex generated:

- All React components, including `LandingPage`, `MCQWidget`, `PlanDisplay`,
  `FeedbackDisplay`, `SummaryDisplay`, and `ProgressBar`
- API route implementations
- LangGraph node implementations, with pre-planned structure from prompts
- Tailwind configuration and global styles
- TypeScript interfaces and state definitions
- README and project documentation

---

## Phase 5: Testing, Debugging & Deployment (Manual)

Everything after code generation was done manually:

- End-to-end flow testing at each prompt stage
- Debugging TypeScript errors and LangGraph state issues
- Vercel deployment configuration and environment variable setup
- API key management across development and production
- Loom video recording and walkthrough preparation

---

## Key Technical Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Agent framework | LangGraph JS | Only framework with native HITL interrupt support |
| LLM | Gemini 2.5 Flash | Free tier, large context window, reliable JSON output |
| Chat UI | CopilotKit self-hosted | No cloud key, full control, free |
| State persistence | MemorySaver | Sufficient for demo, no DB complexity |
| PDF parsing | pdf-parse | Simple Node.js library, no external service |
| Frontend | Next.js 14 + TypeScript | Single project for frontend and backend, Vercel native |
| Database | None | MemorySaver handles demo needs; PostgreSQL would be next step for production |
