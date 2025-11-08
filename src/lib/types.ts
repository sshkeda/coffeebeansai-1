// Types for Coffee Shop Tournament App

export interface CoffeeShop {
	id: string;
	placeId: string;
	name: string;
	address: string;
	rating: number;
	userRatingsTotal: number;
	photoUrl?: string;
	lat: number;
	lng: number;
	priceLevel?: number;
	openNow?: boolean;
}

export interface BattleResult {
	shop1: CoffeeShop;
	shop2: CoffeeShop;
	winner: CoffeeShop;
	reasoning: string;
	scores: {
		shop1: {
			quality: number;
			ambiance: number;
			service: number;
			uniqueness: number;
		};
		shop2: {
			quality: number;
			ambiance: number;
			service: number;
			uniqueness: number;
		};
	};
	timestamp: string;
}

export interface BracketSlot {
	position: number; // 0-7 for initial, 8-11 for semifinals, 12-13 for finals, 14 for champion
	shop: CoffeeShop | null;
	round: "quarterfinal" | "semifinal" | "final" | "champion";
}

export interface TournamentState {
	location: string;
	coordinates: { lat: number; lng: number } | null;
	coffeeShops: CoffeeShop[];
	bracket: BracketSlot[];
	selectedShops: [CoffeeShop | null, CoffeeShop | null];
	battles: BattleResult[];
	champion: CoffeeShop | null;
	isLoading: boolean;
	error: string | null;
	currentRound: "quarterfinal" | "semifinal" | "final" | "champion";
}

export interface LocationResult {
	lat: number;
	lng: number;
	formattedAddress: string;
}
