import { getLocation } from "../chat/tools/getLocation";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const { location } = await req.json();

		if (!location) {
			return Response.json(
				{ success: false, error: "Location is required" },
				{ status: 400 },
			);
		}

		// Execute the location tool
		if (!getLocation.execute) {
			throw new Error("Location tool not properly initialized");
		}
		const result = await getLocation.execute(
			{ location },
			{ toolCallId: "location", messages: [] }
		);

		return Response.json(result);
	} catch (error) {
		console.error("Location API error:", error);
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
