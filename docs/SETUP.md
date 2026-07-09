# Setup Guide
### Before You Write a Single Line of Code

---

## Step 1: Get Your Free API Key (5 minutes)

1. Go to **https://aistudio.google.com**
2. Sign in with your Google account
3. Click **"Get API key"** → **"Create API key"**
4. Copy the key — it looks like `AIzaSy...`
5. This is your `GOOGLE_GENERATIVE_AI_API_KEY`

**Limits on free tier:**
- 1,500 requests/day (resets midnight PST)
- 15 requests/minute
- 1,000,000 token context window (enough for any PDF)
- No credit card required, ever

---

## Step 2: Create Your .env.local

In the root of your project:

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy_your_actual_key_here
```

That's the ONLY environment variable needed.

---

## Step 3: Prerequisites

Make sure you have:
- Node.js 18 or higher → check with `node --version`
- npm 9+ → check with `npm --version`
- Git installed → check with `git --version`
- A GitHub account (for the public repo)
- A Vercel account → vercel.com (free, sign in with GitHub)

---

## Step 4: GitHub Repo Setup

Create the repo BEFORE starting to build:

```bash
# After creating project
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ai-lesson-builder.git
git push -u origin main
```

Make the repo **public** — Memorang needs to see it.

---

## Step 5: Packages to Install (All Free, All Open Source)

Run this ONCE in your project root:

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @langchain/core @langchain/langgraph @langchain/google-genai pdf-parse zod
npm install -D @types/pdf-parse
```

**What each package is:**
| Package | What it does | Cost |
|---------|-------------|------|
| `@copilotkit/react-core` | CopilotKit hooks and provider | Free |
| `@copilotkit/react-ui` | Pre-built chat sidebar UI | Free |
| `@copilotkit/runtime` | CopilotKit Next.js backend runtime | Free |
| `@langchain/core` | LangChain core interfaces | Free |
| `@langchain/langgraph` | LangGraph workflow engine + HITL | Free |
| `@langchain/google-genai` | Google Gemini adapter for LangChain | Free |
| `pdf-parse` | PDF text extraction in Node.js | Free |
| `zod` | TypeScript schema validation | Free |

---

## Step 6: next.config.ts (Required for pdf-parse)

pdf-parse needs special webpack config in Next.js:

```typescript
// next.config.ts
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
```

---

## Cost Summary

| Item | Cost |
|------|------|
| Google Gemini 2.5 Flash API | **$0** (1,500 req/day free) |
| LangGraph JS | **$0** (open source) |
| CopilotKit packages | **$0** (open source) |
| Next.js | **$0** (open source) |
| Vercel deployment | **$0** (hobby tier) |
| GitHub | **$0** (free public repo) |
| **TOTAL** | **$0** |

---

## What NOT to Install

- ❌ Any database package (no Prisma, mongoose, pg, supabase)
- ❌ Any auth package (no next-auth, clerk, supabase auth)
- ❌ Any UI component library (no shadcn, chakra, MUI) — we style from scratch
- ❌ OpenAI package — not needed, we use Google Gemini
- ❌ CopilotKit Cloud — not needed, we self-host the runtime

---

## Vercel Deployment (At the end)

1. Push all code to GitHub
2. Go to vercel.com → New Project → Import your GitHub repo
3. Add environment variable: `GOOGLE_GENERATIVE_AI_API_KEY` = your key
4. Click Deploy
5. Done — your app is live

**Important:** Add the same `.env.local` variables to Vercel's Environment Variables settings before deploying.
