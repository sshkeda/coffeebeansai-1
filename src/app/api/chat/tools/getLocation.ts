import { tool } from "ai";
import { z } from "zod";

/**
 * Tool to convert a location string to coordinates using Google Geocoding API
 */
export const getLocation = tool({
	name: "getLocation",
	description:
		"Convert a location name or address to latitude/longitude coordinates. Use this when a user provides a location for finding coffee shops.",
	inputSchema: z.object({
		location: z
			.string()
			.describe("Location name, address, or city (e.g., 'San Francisco, CA')"),
	}),
	execute: async ({ location }) => {
		const apiKey = process.env.GOOGLE_PLACES_API_KEY;

		if (!apiKey) {
			throw new Error(
				"GOOGLE_PLACES_API_KEY is not set in environment variables",
			);
		}

		try {
			// Use Google Geocoding API to convert location to coordinates
			const url = new URL(
				"https://maps.googleapis.com/maps/api/geocode/json",
			);
			url.searchParams.append("address", location);
			url.searchParams.append("key", apiKey);

			const response = await fetch(url.toString());
			const data = await response.json();

			if (data.status !== "OK" || !data.results || data.results.length === 0) {
				return {
					success: false,
					error: `Could not find location: ${location}. Please try a different location or be more specific.`,
				};
			}

			const result = data.results[0];
			const { lat, lng } = result.geometry.location;

			return {
				success: true,
				lat,
				lng,
				formattedAddress: result.formatted_address,
				location: location,
			};
		} catch (error) {
			console.error("Error geocoding location:", error);
			return {
				success: false,
				error: `Failed to geocode location: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	},
});
