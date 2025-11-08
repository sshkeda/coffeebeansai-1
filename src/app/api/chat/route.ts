import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { webSearch } from "./tools/webSeach";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
    tools: {
      webSearch,
    },
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
