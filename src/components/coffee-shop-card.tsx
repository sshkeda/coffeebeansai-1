"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { CoffeeShop, BattleResult } from "@/lib/types";
import { Star, MapPin, Users, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface CoffeeShopCardProps {
	shop: CoffeeShop;
	isSelected?: boolean;
	isWinner?: boolean;
	battleResult?: BattleResult;
	onSelect?: (shop: CoffeeShop) => void;
	disabled?: boolean;
}

export function CoffeeShopCard({
	shop,
	isSelected = false,
	isWinner = false,
	battleResult,
	onSelect,
	disabled = false,
}: CoffeeShopCardProps) {
	const handleClick = () => {
		if (!disabled && onSelect) {
			onSelect(shop);
		}
	};

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<motion.div
					whileHover={!disabled ? { scale: 1.02 } : {}}
					whileTap={!disabled ? { scale: 0.98 } : {}}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<Card
						className={`
              cursor-pointer transition-all duration-200 overflow-hidden
              ${isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}
              ${isWinner ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
						onClick={handleClick}
					>
						{/* Image Section */}
						<div className="relative h-40 bg-muted overflow-hidden">
							{shop.photoUrl ? (
								<img
									src={shop.photoUrl}
									alt={shop.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900">
									<span className="text-4xl">☕</span>
								</div>
							)}
							{isWinner && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 200 }}
									className="absolute top-2 right-2"
								>
									<Badge className="bg-yellow-500 text-yellow-950 flex items-center gap-1">
										<Trophy className="w-3 h-3" />
										Winner
									</Badge>
								</motion.div>
							)}
							{isSelected && (
								<div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
									<Badge className="bg-primary text-primary-foreground">
										Selected
									</Badge>
								</div>
							)}
						</div>

						{/* Content Section */}
						<div className="p-4 space-y-2">
							<h3 className="font-semibold text-lg line-clamp-1">{shop.name}</h3>

							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<MapPin className="w-4 h-4" />
								<span className="line-clamp-1">{shop.address}</span>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1">
									<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
									<span className="font-medium">{shop.rating.toFixed(1)}</span>
								</div>
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Users className="w-4 h-4" />
									<span>{shop.userRatingsTotal.toLocaleString()}</span>
								</div>
							</div>

							{shop.openNow !== undefined && (
								<Badge variant={shop.openNow ? "default" : "secondary"} className="text-xs">
									{shop.openNow ? "Open Now" : "Closed"}
								</Badge>
							)}
						</div>
					</Card>
				</motion.div>
			</HoverCardTrigger>

			{/* Hover Card with Battle Details */}
			{battleResult && (
				<HoverCardContent className="w-96 p-4">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Trophy className="w-5 h-5 text-yellow-500" />
							<h4 className="font-semibold">Battle Results</h4>
						</div>

						{/* Scores */}
						<div className="space-y-2">
							<div className="text-sm font-medium">Scores:</div>
							<div className="grid grid-cols-2 gap-2 text-xs">
								{battleResult.winner.id === shop.id ? (
									<>
										<div className="space-y-1">
											<div className="flex justify-between">
												<span>Quality:</span>
												<span className="font-medium">
													{battleResult.scores.shop1.quality}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Ambiance:</span>
												<span className="font-medium">
													{battleResult.scores.shop1.ambiance}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Service:</span>
												<span className="font-medium">
													{battleResult.scores.shop1.service}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Uniqueness:</span>
												<span className="font-medium">
													{battleResult.scores.shop1.uniqueness}/10
												</span>
											</div>
										</div>
									</>
								) : (
									<>
										<div className="space-y-1">
											<div className="flex justify-between">
												<span>Quality:</span>
												<span className="font-medium">
													{battleResult.scores.shop2.quality}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Ambiance:</span>
												<span className="font-medium">
													{battleResult.scores.shop2.ambiance}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Service:</span>
												<span className="font-medium">
													{battleResult.scores.shop2.service}/10
												</span>
											</div>
											<div className="flex justify-between">
												<span>Uniqueness:</span>
												<span className="font-medium">
													{battleResult.scores.shop2.uniqueness}/10
												</span>
											</div>
										</div>
									</>
								)}
							</div>
						</div>

						{/* Reasoning */}
						<div className="space-y-1">
							<div className="text-sm font-medium">Why this shop won:</div>
							<p className="text-xs text-muted-foreground leading-relaxed">
								{battleResult.reasoning}
							</p>
						</div>
					</div>
				</HoverCardContent>
			)}
		</HoverCard>
	);
}
