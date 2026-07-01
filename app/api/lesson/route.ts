import { NextRequest, NextResponse } from "next/server";
import { lessonGraph } from "@/lib/agent/graph";
import { Command } from "@langchain/langgraph";
import { summaryNode } from "@/lib/agent/nodes/summaryNode";
import { LessonState } from "@/lib/agent/state";

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
      if (data?.nextQuestion) {
        const snapshot = await lessonGraph.getState(config);
        const state = snapshot.values as LessonState;

        if (state.phase === "summarizing") {
          const update = await summaryNode(state);
          await lessonGraph.updateState(config, update, "answer");
          return NextResponse.json({
            ...state,
            ...update,
            threadId,
          });
        }

        const result = await lessonGraph.invoke(
          new Command({ goto: "mcq" }),
          config
        );
        return NextResponse.json({ ...result, threadId });
      }

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
  } catch (error: unknown) {
    console.error("Lesson API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
