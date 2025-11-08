"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { TournamentBracket } from "@/components/tournament-bracket";
import { BattleArena } from "@/components/battle-arena";
import { useTournamentStore } from "@/lib/tournament-store";
import { MapPin, Loader2, Trophy, RefreshCw, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function TournamentPage() {
	const [locationInput, setLocationInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		location,
		coffeeShops,
		champion,
		setLocation,
		setCoordinates,
		setCoffeeShops,
		initializeBracket,
		reset,
	} = useTournamentStore();

	const handleFindCoffeeShops = async () => {
		if (!locationInput.trim()) {
			setError("Please enter a location");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Step 1: Get location coordinates
			const locationResponse = await fetch("/api/location", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ location: locationInput }),
			});

			const locationData = await locationResponse.json();

			if (!locationData.success) {
				throw new Error(locationData.error || "Failed to find location");
			}

			setLocation(locationData.formattedAddress);
			setCoordinates(locationData.lat, locationData.lng);

			// Step 2: Find coffee shops
			const shopsResponse = await fetch("/api/coffee-shops", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					lat: locationData.lat,
					lng: locationData.lng,
					radius: 5000,
				}),
			});

			const shopsData = await shopsResponse.json();

			if (!shopsData.success) {
				throw new Error(shopsData.error || "Failed to find coffee shops");
			}

			// Initialize tournament with 8 coffee shops
			setCoffeeShops(shopsData.coffeeShops);
			initializeBracket(shopsData.coffeeShops);
		} catch (err) {
			console.error("Error:", err);
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	const handleReset = () => {
		reset();
		setLocationInput("");
		setError(null);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleFindCoffeeShops();
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Back Button */}
				<div className="mb-4">
					<Link href="/">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Chat
						</Button>
					</Link>
				</div>

				{/* Header */}
				<div className="text-center mb-8">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
							☕ Coffee Shop Tournament
						</h1>
						<p className="text-muted-foreground">
							Find the best coffee shop in your area through AI-powered battles
						</p>
					</motion.div>
				</div>

				{/* Location Input Section */}
				{coffeeShops.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Card className="max-w-2xl mx-auto p-8">
							<div className="space-y-6">
								<div className="text-center space-y-2">
									<div className="text-6xl mb-4">🏆</div>
									<h2 className="text-2xl font-semibold">
										Start Your Coffee Tournament
									</h2>
									<p className="text-muted-foreground">
										Enter a location to find the top 8 coffee shops and watch
										them compete!
									</p>
								</div>

								<div className="space-y-4">
									<div className="flex gap-2">
										<div className="relative flex-1">
											<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
											<Input
												placeholder="Enter location (e.g., San Francisco, CA)"
												value={locationInput}
												onChange={(e) => setLocationInput(e.target.value)}
												onKeyPress={handleKeyPress}
												disabled={isLoading}
												className="pl-10"
											/>
										</div>
										<Button
											onClick={handleFindCoffeeShops}
											disabled={isLoading || !locationInput.trim()}
											size="lg"
										>
											{isLoading ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													Searching...
												</>
											) : (
												<>
													<Trophy className="w-4 h-4 mr-2" />
													Find Shops
												</>
											)}
										</Button>
									</div>

									{error && (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm"
										>
											{error}
										</motion.div>
									)}
								</div>

								<div className="pt-4 border-t">
									<h3 className="font-semibold mb-2 text-sm">How it works:</h3>
									<ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
										<li>Enter your location to find the top 8 coffee shops</li>
										<li>Select any 2 coffee shops to battle</li>
										<li>
											AI analyzes quality, ambiance, service, and uniqueness
										</li>
										<li>Winner advances to the next round</li>
										<li>Continue until you find the champion!</li>
									</ol>
								</div>
							</div>
						</Card>
					</motion.div>
				) : (
					<>
						{/* Tournament Active Section */}
						<div className="space-y-6">
							{/* Location Info Bar */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted rounded-lg"
							>
								<div className="flex items-center gap-2">
									<MapPin className="w-5 h-5 text-primary" />
									<div>
										<p className="text-sm text-muted-foreground">Location</p>
										<p className="font-medium">{location}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Trophy className="w-5 h-5 text-primary" />
									<div>
										<p className="text-sm text-muted-foreground">Competitors</p>
										<p className="font-medium">{coffeeShops.length} Coffee Shops</p>
									</div>
								</div>
								<Button onClick={handleReset} variant="outline" size="sm">
									<RefreshCw className="w-4 h-4 mr-2" />
									New Tournament
								</Button>
							</motion.div>

							{/* Champion Banner */}
							{champion && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ type: "spring", stiffness: 200 }}
									className="p-6 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-center text-white"
								>
									<Trophy className="w-12 h-12 mx-auto mb-2" />
									<h2 className="text-2xl font-bold mb-1">
										Tournament Champion!
									</h2>
									<p className="text-3xl font-bold">{champion.name}</p>
									<p className="text-sm opacity-90 mt-2">
										{champion.address}
									</p>
								</motion.div>
							)}

							{/* Tournament Bracket */}
							<TournamentBracket />
						</div>
					</>
				)}
			</div>

			{/* Battle Arena (appears when 2 shops selected) */}
			<BattleArena />
		</div>
	);
}
