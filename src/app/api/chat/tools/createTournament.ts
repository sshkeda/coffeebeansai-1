import { tool } from "ai";
import { z } from "zod";

type Input = z.infer<typeof inputSchema>;
const inputSchema = z.object({
  shops: z
    .array(
      z.object({
        name: z.string().describe("The name of the coffee shop"),
        address: z.string().describe("The address of the coffee shop"),
        description: z.string().describe("The description of the coffee shop"),
        websiteUrl: z.string().describe("The website URL of the coffee shop"),
        imageUrl: z.string().describe("The image URL of the coffee shop"),
      })
    )
    .describe("The coffee shops to create a tournament for"),
});

export const createTournament = tool<Input, any>({
  name: "createTournament",
  description: "Create a new tournament",
  inputSchema,
  execute: async ({ shops }) => {
    return `Created tournament for ${shops
      .map((shop) => shop.name)
      .join(", ")}`;
  },
});
