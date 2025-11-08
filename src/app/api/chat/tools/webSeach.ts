import { xai } from "@ai-sdk/xai";
import { generateText, tool } from "ai";
import { z } from "zod";

type Input = z.infer<typeof inputSchema>;
const inputSchema = z.object({
  query: z.string().describe("The query to search the web for"),
});

export const webSearch = tool<Input, string>({
  name: "webSearch",
  description: "Search the web for information",
  inputSchema,
  execute: async ({ query }) => {
    try {
      const result = await generateText({
        model: xai("grok-4-fast-non-reasoning"),
        prompt: query,
        providerOptions: {
          xai: {
            searchParameters: {
              mode: "on",
              maxSearchResults: 3,
            },
          },
        },
      });

      return result.text;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
