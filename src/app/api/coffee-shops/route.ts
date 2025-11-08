import { findCoffeeShops } from "../chat/tools/findCoffeeShops";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { lat, lng, radius } = await req.json();

		if (lat === undefined || lng === undefined) {
			return Response.json(
				{ success: false, error: "Latitude and longitude are required" },
				{ status: 400 },
			);
		}

		// Execute the findCoffeeShops tool
		if (!findCoffeeShops.execute) {
			throw new Error("Coffee shops tool not properly initialized");
		}
		const result = await findCoffeeShops.execute(
			{ lat, lng, radius },
			{ toolCallId: "findShops", messages: [] }
		);

		return Response.json(result);
	} catch (error) {
		console.error("Coffee shops API error:", error);
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
