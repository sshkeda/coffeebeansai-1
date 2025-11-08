"use client";

import { CoffeeShopCard } from "@/components/coffee-shop-card";
import { Badge } from "@/components/ui/badge";
import { useTournamentStore } from "@/lib/tournament-store";
import type { CoffeeShop } from "@/lib/types";
import { motion } from "motion/react";

export function TournamentBracket() {
	const { bracket, selectedShops, selectShop, battles, currentRound, champion } =
		useTournamentStore();

	// Get battle result for a shop if it exists
	const getBattleResult = (shop: CoffeeShop) => {
		return battles.find(
			(battle) =>
				battle.winner.id === shop.id &&
				(battle.shop1.id === shop.id || battle.shop2.id === shop.id),
		);
	};

	// Check if a shop is selected
	const isSelected = (shop: CoffeeShop) => {
		return (
			selectedShops[0]?.id === shop.id || selectedShops[1]?.id === shop.id
		);
	};

	// Get shops for each round
	const quarterfinals = bracket.filter((slot) => slot.round === "quarterfinal");
	const semifinals = bracket.filter((slot) => slot.round === "semifinal");
	const finals = bracket.filter((slot) => slot.round === "final");
	const championSlot = bracket.find((slot) => slot.round === "champion");

	return (
		<div className="w-full space-y-6">
			{/* Round Indicator */}
			<div className="flex items-center justify-center gap-4">
				<Badge
					variant={currentRound === "quarterfinal" ? "default" : "secondary"}
				>
					Quarterfinals
				</Badge>
				<Badge variant={currentRound === "semifinal" ? "default" : "secondary"}>
					Semifinals
				</Badge>
				<Badge variant={currentRound === "final" ? "default" : "secondary"}>
					Finals
				</Badge>
				{champion && (
					<Badge variant="default" className="bg-yellow-500">
						Champion!
					</Badge>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				{/* Quarterfinals - Left Side */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-center">Round 1</h3>
					<div className="space-y-3">
						{quarterfinals.slice(0, 4).map((slot) =>
							slot.shop ? (
								<CoffeeShopCard
									key={slot.shop.id}
									shop={slot.shop}
									isSelected={isSelected(slot.shop)}
									onSelect={selectShop}
									disabled={currentRound !== "quarterfinal"}
								/>
							) : (
								<div
									key={slot.position}
									className="h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground"
								>
									Empty Slot
								</div>
							),
						)}
					</div>
				</div>

				{/* Semifinals - Left Side */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-center">Semifinals</h3>
					<div className="space-y-3 pt-12">
						{semifinals.slice(0, 2).map((slot) =>
							slot.shop ? (
								<motion.div
									key={slot.shop.id}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5 }}
								>
									<CoffeeShopCard
										shop={slot.shop}
										isSelected={isSelected(slot.shop)}
										onSelect={selectShop}
										disabled={currentRound !== "semifinal"}
										battleResult={getBattleResult(slot.shop)}
										isWinner={true}
									/>
								</motion.div>
							) : (
								<div
									key={slot.position}
									className="h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground"
								>
									Winner TBD
								</div>
							),
						)}
					</div>
				</div>

				{/* Finals */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-center">Finals</h3>
					<div className="space-y-3 pt-24">
						{finals.map((slot) =>
							slot.shop ? (
								<motion.div
									key={slot.shop.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.5 }}
								>
									<CoffeeShopCard
										shop={slot.shop}
										isSelected={isSelected(slot.shop)}
										onSelect={selectShop}
										disabled={currentRound !== "final"}
										battleResult={getBattleResult(slot.shop)}
										isWinner={true}
									/>
								</motion.div>
							) : (
								<div
									key={slot.position}
									className="h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground"
								>
									Finalist TBD
								</div>
							),
						)}
					</div>
				</div>

				{/* Champion */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold text-center">Champion</h3>
					<div className="pt-36">
						{championSlot?.shop ? (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ type: "spring", stiffness: 200, damping: 10 }}
							>
								<CoffeeShopCard
									shop={championSlot.shop}
									isWinner={true}
									battleResult={getBattleResult(championSlot.shop)}
									disabled={true}
								/>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									className="text-center mt-4"
								>
									<p className="text-2xl">🏆</p>
									<p className="text-sm text-muted-foreground">
										Tournament Champion!
									</p>
								</motion.div>
							</motion.div>
						) : (
							<div className="h-48 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground">
								<div className="text-center">
									<p className="text-4xl mb-2">🏆</p>
									<p className="text-sm">Champion TBD</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile View - Stacked Layout */}
			<div className="lg:hidden space-y-8">
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Quarterfinals</h3>
					<div className="grid grid-cols-2 gap-3">
						{quarterfinals.map((slot) =>
							slot.shop ? (
								<CoffeeShopCard
									key={slot.shop.id}
									shop={slot.shop}
									isSelected={isSelected(slot.shop)}
									onSelect={selectShop}
									disabled={currentRound !== "quarterfinal"}
								/>
							) : null,
						)}
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Semifinals</h3>
					<div className="grid grid-cols-2 gap-3">
						{semifinals.map((slot) =>
							slot.shop ? (
								<CoffeeShopCard
									key={slot.shop.id}
									shop={slot.shop}
									isSelected={isSelected(slot.shop)}
									onSelect={selectShop}
									disabled={currentRound !== "semifinal"}
									battleResult={getBattleResult(slot.shop)}
									isWinner={true}
								/>
							) : null,
						)}
					</div>
				</div>

				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Finals</h3>
					<div className="grid grid-cols-2 gap-3">
						{finals.map((slot) =>
							slot.shop ? (
								<CoffeeShopCard
									key={slot.shop.id}
									shop={slot.shop}
									isSelected={isSelected(slot.shop)}
									onSelect={selectShop}
									disabled={currentRound !== "final"}
									battleResult={getBattleResult(slot.shop)}
									isWinner={true}
								/>
							) : null,
						)}
					</div>
				</div>

				{championSlot?.shop && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Champion</h3>
						<CoffeeShopCard
							shop={championSlot.shop}
							isWinner={true}
							battleResult={getBattleResult(championSlot.shop)}
							disabled={true}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
