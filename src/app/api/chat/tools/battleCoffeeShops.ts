import { tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { z } from "zod";

/**
 * Tool to compare two coffee shops using LLM with web search
 * Returns winner and detailed reasoning
 */
export const battleCoffeeShops = tool({
	name: "battleCoffeeShops",
	description:
		"Compare two coffee shops and determine a winner based on quality, ambiance, service, and uniqueness. Uses AI with web search to gather real reviews and information.",
	inputSchema: z.object({
		shop1: z.object({
			name: z.string(),
			address: z.string(),
			rating: z.number(),
			userRatingsTotal: z.number(),
		}),
		shop2: z.object({
			name: z.string(),
			address: z.string(),
			rating: z.number(),
			userRatingsTotal: z.number(),
		}),
	}),
	execute: async ({ shop1, shop2 }) => {
		try {
			// Use Claude Sonnet with web search to compare the shops
			const prompt = `You are a coffee expert judging a tournament between two coffee shops. Compare these two coffee shops and determine a winner:

**Coffee Shop 1: ${shop1.name}**
- Address: ${shop1.address}
- Google Rating: ${shop1.rating}/5 (${shop1.userRatingsTotal} reviews)

**Coffee Shop 2: ${shop2.name}**
- Address: ${shop2.address}
- Google Rating: ${shop2.rating}/5 (${shop2.userRatingsTotal} reviews)

Search the web for recent reviews, information about their coffee quality, ambiance, service, and what makes each unique. Then provide:

1. A score (1-10) for each shop in these categories:
   - Quality: Coffee taste, beans, brewing methods
   - Ambiance: Atmosphere, decor, comfort
   - Service: Staff friendliness, speed, expertise
   - Uniqueness: Special offerings, character, innovation

2. Determine the winner based on these scores

3. Provide detailed reasoning (2-3 paragraphs) explaining why the winner was chosen, citing specific strengths and weaknesses

Format your response EXACTLY as JSON:
{
  "winner": "${shop1.name}" or "${shop2.name}",
  "scores": {
    "shop1": {
      "quality": <number 1-10>,
      "ambiance": <number 1-10>,
      "service": <number 1-10>,
      "uniqueness": <number 1-10>
    },
    "shop2": {
      "quality": <number 1-10>,
      "ambiance": <number 1-10>,
      "service": <number 1-10>,
      "uniqueness": <number 1-10>
    }
  },
  "reasoning": "<detailed explanation>"
}`;

			const result = await generateText({
				model: anthropic("claude-sonnet-4-5-20250929"),
				prompt,
			});

			// Parse the JSON response
			const responseText = result.text.trim();

			// Extract JSON from markdown code blocks if present
			let jsonText = responseText;
			const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
			if (jsonMatch) {
				jsonText = jsonMatch[1];
			} else {
				// Try to find JSON object in the response
				const objectMatch = responseText.match(/\{[\s\S]*\}/);
				if (objectMatch) {
					jsonText = objectMatch[0];
				}
			}

			const battleResult = JSON.parse(jsonText);

			// Validate the response structure
			if (
				!battleResult.winner ||
				!battleResult.scores ||
				!battleResult.reasoning
			) {
				throw new Error("Invalid battle result structure from AI");
			}

			return {
				success: true,
				winner: battleResult.winner,
				scores: battleResult.scores,
				reasoning: battleResult.reasoning,
				timestamp: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error in coffee shop battle:", error);

			// Fallback: simple comparison based on ratings
			const shop1Score = shop1.rating * Math.log10(shop1.userRatingsTotal + 1);
			const shop2Score = shop2.rating * Math.log10(shop2.userRatingsTotal + 1);

			const winner = shop1Score > shop2Score ? shop1.name : shop2.name;

			return {
				success: true,
				winner,
				scores: {
					shop1: {
						quality: Math.round(shop1.rating * 2),
						ambiance: Math.round(shop1.rating * 2),
						service: Math.round(shop1.rating * 2),
						uniqueness: Math.round(shop1.rating * 2),
					},
					shop2: {
						quality: Math.round(shop2.rating * 2),
						ambiance: Math.round(shop2.rating * 2),
						service: Math.round(shop2.rating * 2),
						uniqueness: Math.round(shop2.rating * 2),
					},
				},
				reasoning: `Based on ratings and review counts: ${shop1.name} (${shop1.rating}/5, ${shop1.userRatingsTotal} reviews) vs ${shop2.name} (${shop2.rating}/5, ${shop2.userRatingsTotal} reviews). ${winner} wins with ${winner === shop1.name ? "higher" : "better"} overall rating and customer feedback. Note: Detailed AI analysis unavailable - using fallback comparison.`,
				timestamp: new Date().toISOString(),
				fallback: true,
			};
		}
	},
});
