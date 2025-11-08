import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	BattleResult,
	BracketSlot,
	CoffeeShop,
	TournamentState,
} from "./types";

interface TournamentStore extends TournamentState {
	// Actions
	setLocation: (location: string) => void;
	setCoordinates: (lat: number, lng: number) => void;
	setCoffeeShops: (shops: CoffeeShop[]) => void;
	initializeBracket: (shops: CoffeeShop[]) => void;
	selectShop: (shop: CoffeeShop) => void;
	clearSelection: () => void;
	recordBattle: (battle: BattleResult) => void;
	advanceWinner: (winner: CoffeeShop, fromRound: string) => void;
	setChampion: (champion: CoffeeShop) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

const initialState: TournamentState = {
	location: "",
	coordinates: null,
	coffeeShops: [],
	bracket: [],
	selectedShops: [null, null],
	battles: [],
	champion: null,
	isLoading: false,
	error: null,
	currentRound: "quarterfinal",
};

export const useTournamentStore = create<TournamentStore>()(
	persist(
		(set, get) => ({
			...initialState,

			setLocation: (location: string) => set({ location }),

			setCoordinates: (lat: number, lng: number) =>
				set({ coordinates: { lat, lng } }),

			setCoffeeShops: (shops: CoffeeShop[]) => set({ coffeeShops: shops }),

			initializeBracket: (shops: CoffeeShop[]) => {
				// Initialize bracket with 8 shops in quarterfinal positions
				const bracket: BracketSlot[] = shops.slice(0, 8).map((shop, index) => ({
					position: index,
					shop,
					round: "quarterfinal" as const,
				}));

				// Add empty semifinal slots (positions 8-11)
				for (let i = 8; i < 12; i++) {
					bracket.push({
						position: i,
						shop: null,
						round: "semifinal" as const,
					});
				}

				// Add empty final slots (positions 12-13)
				for (let i = 12; i < 14; i++) {
					bracket.push({
						position: i,
						shop: null,
						round: "final" as const,
					});
				}

				// Add champion slot (position 14)
				bracket.push({
					position: 14,
					shop: null,
					round: "champion" as const,
				});

				set({ bracket, coffeeShops: shops, currentRound: "quarterfinal" });
			},

			selectShop: (shop: CoffeeShop) => {
				const { selectedShops } = get();

				// If shop is already selected, deselect it
				if (
					selectedShops[0]?.id === shop.id ||
					selectedShops[1]?.id === shop.id
				) {
					set({
						selectedShops: [
							selectedShops[0]?.id === shop.id ? null : selectedShops[0],
							selectedShops[1]?.id === shop.id ? null : selectedShops[1],
						],
					});
					return;
				}

				// Add to first empty slot
				if (selectedShops[0] === null) {
					set({ selectedShops: [shop, selectedShops[1]] });
				} else if (selectedShops[1] === null) {
					set({ selectedShops: [selectedShops[0], shop] });
				} else {
					// Replace first selection if both are filled
					set({ selectedShops: [shop, selectedShops[1]] });
				}
			},

			clearSelection: () => set({ selectedShops: [null, null] }),

			recordBattle: (battle: BattleResult) => {
				const { battles } = get();
				set({ battles: [...battles, battle] });
			},

			advanceWinner: (winner: CoffeeShop, fromRound: string) => {
				const { bracket } = get();
				const newBracket = [...bracket];

				if (fromRound === "quarterfinal") {
					// Find next available semifinal slot
					const semifinalSlot = newBracket.find(
						(slot) => slot.round === "semifinal" && slot.shop === null,
					);
					if (semifinalSlot) {
						semifinalSlot.shop = winner;
					}

					// Check if all semifinal slots are filled
					const semifinalsFilled = newBracket
						.filter((slot) => slot.round === "semifinal")
						.every((slot) => slot.shop !== null);

					set({
						bracket: newBracket,
						currentRound: semifinalsFilled ? "semifinal" : "quarterfinal",
					});
				} else if (fromRound === "semifinal") {
					// Find next available final slot
					const finalSlot = newBracket.find(
						(slot) => slot.round === "final" && slot.shop === null,
					);
					if (finalSlot) {
						finalSlot.shop = winner;
					}

					// Check if both final slots are filled
					const finalsFilled = newBracket
						.filter((slot) => slot.round === "final")
						.every((slot) => slot.shop !== null);

					set({
						bracket: newBracket,
						currentRound: finalsFilled ? "final" : "semifinal",
					});
				} else if (fromRound === "final") {
					// Set champion
					const championSlot = newBracket.find(
						(slot) => slot.round === "champion",
					);
					if (championSlot) {
						championSlot.shop = winner;
					}
					set({ bracket: newBracket, champion: winner, currentRound: "champion" });
				}
			},

			setChampion: (champion: CoffeeShop) => set({ champion }),

			setLoading: (isLoading: boolean) => set({ isLoading }),

			setError: (error: string | null) => set({ error }),

			reset: () => set(initialState),
		}),
		{
			name: "tournament-storage",
		},
	),
);
