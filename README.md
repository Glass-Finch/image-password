# Image Password Authentication Platform

A Next.js application that uses image-based knowledge challenges for user verification. Features theme-agnostic architecture with comprehensive analytics.

## Core Features

- **Study Phase**: Pre-challenge image examination with progressive loading
- **Multi-Round Challenge**: Configurable difficulty progression (default: 3 rounds)
- **Mobile Optimized**: Double-tap zoom, responsive design
- **Theme System**: JSON-based content configuration
- **Analytics**: User behavior, geographic, and device tracking
- **Error Recovery**: Error boundaries with user-friendly fallbacks

## Tech Stack

- Next.js 14 + React 18 + TypeScript 5.9
- TailwindCSS + Framer Motion
- Supabase (PostgreSQL analytics)
- Jest + Testing Library

## Quick Start

```bash
git clone <repository>
cd image-password
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## Environment Configuration

```bash
# Required
DEFAULT_SUCCESS_URL=https://your-destination.com
NEXT_PUBLIC_SUCCESS_URL=https://your-destination.com
NEXT_PUBLIC_LOSS_REDIRECT_URL=https://your-study-url.com

# Optional Analytics
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

## Project Structure

```
src/
├── app/
│   ├── api/analytics/          # Analytics endpoints
│   ├── page.tsx               # Main game interface
│   └── success/page.tsx       # Success redirect
├── components/
│   ├── game/                  # Game mechanics
│   ├── collection/            # Image display
│   ├── providers/             # React context
│   └── ui/                    # Reusable components
├── hooks/
│   ├── useAnalytics.ts       # Analytics tracking
│   ├── useGameState.ts       # Game state management
│   └── useText.ts            # Theme configuration
├── utils/
│   ├── gameErrors.ts         # Error constants and validation
│   ├── analyticsUtils.ts     # Analytics helpers
│   └── gameLogic.ts          # Round generation
└── types/game.ts             # TypeScript definitions

public/
├── images/items/             # Theme assets
│   ├── reference/           # Study collection (15 items)
│   ├── correct/             # Valid answers (45+ items)
│   └── distractors/         # Wrong answers (70+ items)
├── items.json               # Image metadata
└── config/text/en.json      # Theme text configuration
```

## Analytics System

### Database Setup (Supabase)

Run the provided SQL schema in your Supabase dashboard:

```sql
-- See supabase-schema.sql for complete schema
-- Creates tables: game_sessions, round_attempts
-- Includes indexes and analytics views
```

### Tracked Data

**Session Level**
- Geographic data (IP-based location)
- Device information (browser, OS, screen size)
- Traffic attribution (referrer, UTM parameters)
- User behavior (new vs returning visitors)

**Round Level**
- Round performance and timing
- Selection accuracy by category
- User interaction patterns

### Sample Queries

```sql
-- Geographic performance
SELECT country, COUNT(*) as sessions, 
       ROUND(AVG(total_duration)/1000) as avg_seconds
FROM game_sessions 
WHERE country IS NOT NULL
GROUP BY country;

-- Device performance
SELECT device_type, browser_type, COUNT(*) as sessions
FROM game_sessions 
GROUP BY device_type, browser_type;
```

## Theme Configuration

### Text Configuration (`public/config/text/en.json`)

```json
{
  "game": {
    "title": "Your Challenge Title",
    "subtitle": "Prove your expertise"
  },
  "rounds": {
    "types": ["category1", "category2", "category3"],
    "labels": {
      "category1": "Category 1",
      "category2": "Category 2",
      "category3": "Category 3"
    }
  }
}
```

### Image Structure

```
public/images/items/
├── reference/      # Study materials (exactly 15 items)
├── correct/        # Valid choices (15+ per category)
└── distractors/    # Wrong choices (70+ items)
```

### Item Metadata (`public/items.json`)

```json
[
  {
    "id": "item-001",
    "image": "/images/items/reference/item-001.jpg",
    "item_type": "reference",
    "tags": ["reference"]
  }
]
```

## Development Workflow

```bash
# Development
npm run dev                 # Start server
npm run build              # Production build
npm run start              # Production server

# Quality Assurance
npm run lint               # Code quality
npm run type-check         # TypeScript validation
npm test                   # Test suite (43 tests)
```

## Error Handling

The application includes comprehensive error boundaries:

- **Game-level errors**: User-friendly recovery UI
- **Analytics errors**: Non-blocking, logged warnings
- **Image loading errors**: Graceful fallbacks
- **Network errors**: Retry mechanisms

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Add environment variables in dashboard
3. Deploy automatically on push to main

### Database Setup

1. Create Supabase project
2. Run `supabase-schema.sql` in SQL editor
3. Add connection details to environment

## Testing

The application includes 43 tests covering:

- Game logic and round generation
- Analytics tracking
- Error boundary behavior
- Utility functions

Run tests with `npm test` or `npm test -- --watch` for development.

## Architecture Notes

### Theme System
- All text content is externalized to JSON files
- Images follow a specific folder structure
- No hardcoded theme-specific content in code

### Analytics
- Non-blocking design - failures don't affect gameplay
- Comprehensive tracking of user behavior and technical metrics
- Privacy-compliant with IP anonymization options

### Error Boundaries
- Multi-level error catching
- User-friendly recovery options
- Development debugging tools

## Current Theme: Yu-Gi-Oh Fairy Deck

The platform demonstrates a Yu-Gi-Oh card knowledge verification system with three challenge rounds (Monster, Spell, Trap cards) using a fairy deck theme.

To create a new theme, replace the JSON configuration, image assets, and metadata without modifying any code.

## License

MIT License