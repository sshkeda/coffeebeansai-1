"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTournamentStore } from "@/lib/tournament-store";
import type { CoffeeShop, BattleResult } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Loader2, Trophy, X } from "lucide-react";
import confetti from "canvas-confetti";

export function BattleArena() {
	const {
		selectedShops,
		recordBattle,
		advanceWinner,
		clearSelection,
		currentRound,
	} = useTournamentStore();
	const [isBattling, setIsBattling] = useState(false);
	const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

	const shop1 = selectedShops[0];
	const shop2 = selectedShops[1];

	// Check if we have 2 shops selected
	const canBattle = shop1 && shop2;

	const handleBattle = async () => {
		if (!shop1 || !shop2) return;

		setIsBattling(true);
		setBattleResult(null);

		try {
			// Call the battleCoffeeShops API
			const response = await fetch("/api/battle", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					shop1: {
						name: shop1.name,
						address: shop1.address,
						rating: shop1.rating,
						userRatingsTotal: shop1.userRatingsTotal,
					},
					shop2: {
						name: shop2.name,
						address: shop2.address,
						rating: shop2.rating,
						userRatingsTotal: shop2.userRatingsTotal,
					},
				}),
			});

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.error || "Battle failed");
			}

			// Determine which shop is the winner
			const winnerShop = data.winner === shop1.name ? shop1 : shop2;

			const result: BattleResult = {
				shop1,
				shop2,
				winner: winnerShop,
				reasoning: data.reasoning,
				scores: data.scores,
				timestamp: data.timestamp,
			};

			setBattleResult(result);
			recordBattle(result);

			// Trigger confetti
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});

			// Advance winner to next round
			advanceWinner(winnerShop, currentRound);
		} catch (error) {
			console.error("Battle error:", error);
			alert(
				`Battle failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setIsBattling(false);
		}
	};

	const handleClose = () => {
		clearSelection();
		setBattleResult(null);
	};

	if (!canBattle) {
		return null;
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 50 }}
				className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg"
			>
				<div className="max-w-6xl mx-auto">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							Battle Arena
						</h3>
						<Button variant="ghost" size="icon" onClick={handleClose}>
							<X className="w-4 h-4" />
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
						{/* Shop 1 */}
						<Card className="p-4">
							<div className="space-y-2">
								<h4 className="font-semibold text-sm line-clamp-1">
									{shop1.name}
								</h4>
								<Badge variant="secondary" className="text-xs">
									{shop1.rating.toFixed(1)} ⭐ ({shop1.userRatingsTotal})
								</Badge>
								{battleResult && (
									<div className="space-y-1 pt-2">
										<div className="flex justify-between text-xs">
											<span>Quality:</span>
											<span>{battleResult.scores.shop1.quality}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop1.quality * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Ambiance:</span>
											<span>{battleResult.scores.shop1.ambiance}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop1.ambiance * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Service:</span>
											<span>{battleResult.scores.shop1.service}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop1.service * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Uniqueness:</span>
											<span>{battleResult.scores.shop1.uniqueness}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop1.uniqueness * 10}
											className="h-1"
										/>
									</div>
								)}
							</div>
						</Card>

						{/* Battle Controls */}
						<div className="flex flex-col items-center justify-center space-y-4">
							<div className="text-4xl">⚔️</div>
							{!battleResult ? (
								<Button
									onClick={handleBattle}
									disabled={isBattling}
									size="lg"
									className="w-full"
								>
									{isBattling ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Battling...
										</>
									) : (
										<>
											<Sparkles className="w-4 h-4 mr-2" />
											Start Battle!
										</>
									)}
								</Button>
							) : (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 200 }}
									className="text-center space-y-2"
								>
									<Trophy className="w-12 h-12 mx-auto text-yellow-500" />
									<p className="font-bold text-lg">Winner:</p>
									<p className="font-semibold text-primary">
										{battleResult.winner.name}
									</p>
									<Button onClick={handleClose} variant="outline" size="sm">
										Continue Tournament
									</Button>
								</motion.div>
							)}
						</div>

						{/* Shop 2 */}
						<Card className="p-4">
							<div className="space-y-2">
								<h4 className="font-semibold text-sm line-clamp-1">
									{shop2.name}
								</h4>
								<Badge variant="secondary" className="text-xs">
									{shop2.rating.toFixed(1)} ⭐ ({shop2.userRatingsTotal})
								</Badge>
								{battleResult && (
									<div className="space-y-1 pt-2">
										<div className="flex justify-between text-xs">
											<span>Quality:</span>
											<span>{battleResult.scores.shop2.quality}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop2.quality * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Ambiance:</span>
											<span>{battleResult.scores.shop2.ambiance}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop2.ambiance * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Service:</span>
											<span>{battleResult.scores.shop2.service}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop2.service * 10}
											className="h-1"
										/>
										<div className="flex justify-between text-xs">
											<span>Uniqueness:</span>
											<span>{battleResult.scores.shop2.uniqueness}/10</span>
										</div>
										<Progress
											value={battleResult.scores.shop2.uniqueness * 10}
											className="h-1"
										/>
									</div>
								)}
							</div>
						</Card>
					</div>

					{/* Battle Reasoning */}
					{battleResult && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							transition={{ delay: 0.3 }}
							className="mt-4"
						>
							<Card className="p-4 bg-muted">
								<h4 className="font-semibold text-sm mb-2">Battle Analysis:</h4>
								<p className="text-xs text-muted-foreground leading-relaxed">
									{battleResult.reasoning}
								</p>
							</Card>
						</motion.div>
					)}
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
