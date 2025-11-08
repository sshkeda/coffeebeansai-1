import { tool } from "ai";
import { z } from "zod";

/**
 * Tool to find top 8 coffee shops near a location using Google Places API
 */
export const findCoffeeShops = tool({
	name: "findCoffeeShops",
	description:
		"Find the top 8 coffee shops near a given location. Returns coffee shop details including name, address, rating, and photos.",
	inputSchema: z.object({
		lat: z.number().describe("Latitude of the location"),
		lng: z.number().describe("Longitude of the location"),
		radius: z
			.number()
			.optional()
			.default(5000)
			.describe("Search radius in meters (default: 5000m = 5km)"),
	}),
	execute: async ({ lat, lng, radius = 5000 }) => {
		const apiKey = process.env.GOOGLE_PLACES_API_KEY;

		if (!apiKey) {
			throw new Error(
				"GOOGLE_PLACES_API_KEY is not set in environment variables",
			);
		}

		try {
			// Use Google Places API Nearby Search
			const url = new URL(
				"https://maps.googleapis.com/maps/api/place/nearbysearch/json",
			);
			url.searchParams.append("location", `${lat},${lng}`);
			url.searchParams.append("radius", radius.toString());
			url.searchParams.append("type", "cafe");
			url.searchParams.append("keyword", "coffee");
			url.searchParams.append("key", apiKey);

			const response = await fetch(url.toString());
			const data = await response.json();

			if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
				return {
					success: false,
					error: `Google Places API error: ${data.status} - ${data.error_message || "Unknown error"}`,
				};
			}

			if (!data.results || data.results.length === 0) {
				return {
					success: false,
					error:
						"No coffee shops found in this area. Try a different location or increase the search radius.",
				};
			}

			// Sort by rating (descending) and take top 8
			const sortedShops = data.results
				.filter(
					(place: any) =>
						place.rating && place.user_ratings_total && place.user_ratings_total > 10,
				) // Filter places with ratings and at least 10 reviews
				.sort((a: any, b: any) => {
					// Sort by rating first, then by number of reviews
					if (b.rating !== a.rating) {
						return b.rating - a.rating;
					}
					return b.user_ratings_total - a.user_ratings_total;
				})
				.slice(0, 8);

			if (sortedShops.length < 8) {
				return {
					success: false,
					error: `Only found ${sortedShops.length} highly-rated coffee shops. Try a different location with more options.`,
				};
			}

			// Format the coffee shops
			const coffeeShops = sortedShops.map((place: any) => {
				// Get photo URL if available
				let photoUrl = undefined;
				if (place.photos && place.photos[0]) {
					const photoReference = place.photos[0].photo_reference;
					photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
				}

				return {
					id: place.place_id,
					placeId: place.place_id,
					name: place.name,
					address: place.vicinity || place.formatted_address || "Address unknown",
					rating: place.rating,
					userRatingsTotal: place.user_ratings_total,
					lat: place.geometry.location.lat,
					lng: place.geometry.location.lng,
					photoUrl,
					priceLevel: place.price_level,
					openNow: place.opening_hours?.open_now,
				};
			});

			return {
				success: true,
				coffeeShops,
				count: coffeeShops.length,
				searchLocation: { lat, lng },
			};
		} catch (error) {
			console.error("Error fetching coffee shops:", error);
			return {
				success: false,
				error: `Failed to fetch coffee shops: ${error instanceof Error ? error.message : "Unknown error"}`,
			};
		}
	},
});
