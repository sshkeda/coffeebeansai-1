# ☕ Coffee Shop Tournament App

An AI-powered tournament application that finds the top 8 coffee shops in any location and has them compete in bracket-style battles using advanced AI analysis.

## 🎯 Features

- **Location-based Search**: Enter any location to find the top 8 coffee shops
- **AI-Powered Battles**: Uses Claude Sonnet 3.5 to compare coffee shops based on:
  - Coffee Quality
  - Ambiance
  - Service
  - Uniqueness
- **Tournament Bracket**: Visual bracket showing quarterfinals → semifinals → finals → champion
- **Detailed Analysis**: Hover over winners to see battle reasoning and scores
- **Browser Storage**: All tournament data persists in your browser using Zustand
- **Responsive Design**: Beautiful UI that works on desktop and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Anthropic Claude Sonnet 4.5 (via Vercel AI SDK)
- **State Management**: Zustand with persist middleware
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion + canvas-confetti
- **APIs**: Google Places API, Google Geocoding API

## 📋 Prerequisites

You'll need API keys for:

1. **Anthropic API Key** - Get from: https://console.anthropic.com/
2. **Google Places API Key** - Get from: https://console.cloud.google.com/

### Setting up Google Places API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Geocoding API
4. Go to "Credentials" and create an API key
5. (Optional) Restrict the key to only these APIs for security

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd coffeebeansai
npm install
```

### 2. Create Environment Variables

Copy the example file and add your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:

```env
# Anthropic API Key (for Claude AI)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Places API Key (for finding coffee shops)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000/tournament](http://localhost:3000/tournament) in your browser.

## 🎮 How to Play

1. **Enter Location**: Type any location (e.g., "San Francisco, CA", "New York City", "Seattle")
2. **Wait for Results**: The app finds the top 8 coffee shops with best ratings
3. **Select 2 Shops**: Click on any 2 coffee shops in the same round
4. **Start Battle**: Click "Start Battle!" to run AI analysis
5. **View Winner**: See which shop won and why (hover for details)
6. **Continue**: Winner advances automatically, select 2 more shops
7. **Find Champion**: Play through semifinals and finals to crown a champion!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   ├── route.ts              # Main chat API with tools
│   │   │   └── tools/
│   │   │       ├── getLocation.ts    # Geocoding tool
│   │   │       ├── findCoffeeShops.ts # Google Places search
│   │   │       └── battleCoffeeShops.ts # AI battle logic
│   │   ├── location/route.ts         # Location API endpoint
│   │   ├── coffee-shops/route.ts     # Coffee shops API endpoint
│   │   └── battle/route.ts           # Battle API endpoint
│   ├── tournament/
│   │   └── page.tsx                  # Tournament page
│   └── page.tsx                      # Chat page
├── components/
│   ├── coffee-shop-card.tsx          # Coffee shop card component
│   ├── tournament-bracket.tsx        # Bracket visualization
│   ├── battle-arena.tsx              # Battle UI component
│   ├── ai-elements/                  # AI chat components (30+)
│   └── ui/                           # shadcn/ui components (20+)
└── lib/
    ├── types.ts                      # TypeScript types
    ├── tournament-store.ts           # Zustand state management
    └── utils.ts                      # Utility functions
```

## 🔧 API Routes

### `/api/location` (POST)
Geocodes a location string to lat/lng coordinates.

**Request:**
```json
{
  "location": "San Francisco, CA"
}
```

**Response:**
```json
{
  "success": true,
  "lat": 37.7749,
  "lng": -122.4194,
  "formattedAddress": "San Francisco, CA, USA"
}
```

### `/api/coffee-shops` (POST)
Finds top 8 coffee shops near coordinates.

**Request:**
```json
{
  "lat": 37.7749,
  "lng": -122.4194,
  "radius": 5000
}
```

**Response:**
```json
{
  "success": true,
  "coffeeShops": [
    {
      "id": "ChIJ...",
      "placeId": "ChIJ...",
      "name": "Blue Bottle Coffee",
      "address": "66 Mint St, San Francisco",
      "rating": 4.5,
      "userRatingsTotal": 1234,
      "photoUrl": "https://...",
      "lat": 37.7749,
      "lng": -122.4194
    }
  ],
  "count": 8
}
```

### `/api/battle` (POST)
Runs AI-powered battle between 2 coffee shops.

**Request:**
```json
{
  "shop1": {
    "name": "Blue Bottle Coffee",
    "address": "66 Mint St",
    "rating": 4.5,
    "userRatingsTotal": 1234
  },
  "shop2": {
    "name": "Sightglass Coffee",
    "address": "270 7th St",
    "rating": 4.4,
    "userRatingsTotal": 987
  }
}
```

**Response:**
```json
{
  "success": true,
  "winner": "Blue Bottle Coffee",
  "scores": {
    "shop1": {
      "quality": 9,
      "ambiance": 8,
      "service": 8,
      "uniqueness": 9
    },
    "shop2": {
      "quality": 8,
      "ambiance": 9,
      "service": 7,
      "uniqueness": 8
    }
  },
  "reasoning": "Blue Bottle Coffee wins with exceptional coffee quality...",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## 🎨 Components

### `CoffeeShopCard`
Displays coffee shop information with:
- Photo (or coffee emoji placeholder)
- Name, address, rating
- Selection state
- Winner badge (if applicable)
- Hover card with battle details

### `TournamentBracket`
Visual tournament bracket with:
- 4 rounds: Quarterfinals, Semifinals, Finals, Champion
- Responsive layout (stacked on mobile, side-by-side on desktop)
- Animated transitions when winners advance
- Current round highlighting

### `BattleArena`
Fixed bottom panel for battles:
- Shows 2 selected shops side-by-side
- "Start Battle" button
- Live battle progress
- Animated winner reveal with confetti
- Detailed score breakdown
- Battle reasoning display

## 💾 State Management

Uses Zustand with localStorage persistence:

```typescript
interface TournamentState {
  location: string;
  coordinates: { lat: number; lng: number } | null;
  coffeeShops: CoffeeShop[];
  bracket: BracketSlot[];
  selectedShops: [CoffeeShop | null, CoffeeShop | null];
  battles: BattleResult[];
  champion: CoffeeShop | null;
  currentRound: "quarterfinal" | "semifinal" | "final" | "champion";
}
```

## 🐛 Troubleshooting

### "No coffee shops found"
- Try a different location
- Make sure the location is specific (e.g., include city and state)
- Check that your Google Places API key is valid

### "Battle failed"
- Verify your Anthropic API key is correct
- Check the console for error messages
- Ensure you have API credits available

### "Location not found"
- Be more specific with your location (add city, state, country)
- Try a major city name

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
vercel deploy
```

Add environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY`
- `GOOGLE_PLACES_API_KEY`

## 📝 Future Enhancements

- [ ] Add user authentication
- [ ] Global leaderboard across all tournaments
- [ ] Share tournament results
- [ ] Map view of coffee shops
- [ ] Filter by price level, open now, etc.
- [ ] Custom tournament sizes (4, 16, 32 shops)
- [ ] Coffee shop details page
- [ ] Save favorite shops

## 📄 License

MIT License - feel free to use for your own projects!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

---

Enjoy finding the best coffee in your area! ☕🏆
