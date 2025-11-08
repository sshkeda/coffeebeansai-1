import { battleCoffeeShops } from "../chat/tools/battleCoffeeShops";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { shop1, shop2 } = await req.json();

		if (!shop1 || !shop2) {
			return Response.json(
				{ success: false, error: "Both shops are required" },
				{ status: 400 },
			);
		}

		// Execute the battle tool
		if (!battleCoffeeShops.execute) {
			throw new Error("Battle tool not properly initialized");
		}
		const result = await battleCoffeeShops.execute(
			{ shop1, shop2 },
			{ toolCallId: "battle", messages: [] }
		);

		return Response.json(result);
	} catch (error) {
		console.error("Battle API error:", error);
		return Response.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 },
		);
	}
}
