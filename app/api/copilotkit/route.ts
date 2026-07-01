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
    endpoint: "/api/copilotkit",
    serviceAdapter,
  });
  return handleRequest(req);
}
