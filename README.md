# Yugioh Image Puzzle - Password Protection System

A Next.js-based password-protected landing page that uses image-based puzzles instead of traditional passwords. Users must demonstrate knowledge of a specific Yugioh card deck to gain access.

## 🎴 Current Status: READY FOR DEPLOYMENT

- ✅ **Real Fairy Deck**: 15 authentic Yugioh card images integrated
- ✅ **Working Game Logic**: 3-round challenge with timer and validation  
- ✅ **Mobile Responsive**: Optimized for all devices
- ✅ **Basic Tests**: Core utility functions tested (13 tests passing)
- ✅ **Clean Build**: 43.3 kB optimized bundle, no errors

## 🎯 Features

- **Image-based Authentication**: 3-round card selection challenge
- **Deck-Agnostic Architecture**: Easily configurable for different card decks
- **Mobile-Responsive Design**: Optimized layouts for all devices
- **Real-time Timer**: 60-second countdown per round with visual feedback
- **Security Features**: Automatic lockout and card shuffling on failure
- **Analytics Tracking**: Optional Supabase integration for user behavior analysis
- **Success Animations**: Kawaii-themed celebration screen
- **Monokai Theme**: Dark, magical aesthetic with custom color palette

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS with custom Monokai theme
- **Animations**: Framer Motion
- **Analytics**: Supabase (optional)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Optional: Supabase account for analytics

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-password
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_DEFAULT_DECK` | Default deck to use ('fairy') | Yes |
| `FAIRY_SUCCESS_URL` | Redirect URL on successful completion | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | No |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | Enable/disable analytics | No |

### Adding New Decks

1. **Update deck configuration** (`src/config/deck-configs.ts`):
   ```typescript
   export const DRAGON_DECK_CONFIG: DeckConfig = {
     id: 'dragon',
     name: 'Dragon Deck Challenge',
     referenceCards: ['dragon-1', 'dragon-2', ...], // 15 cards
     theme: {
       primary: '#ff6b35',
       secondary: '#f7931e', 
       accent: '#ffbe0b',
       backgroundGradient: ['#2c1810', '#4a2c17']
     },
     successMessage: 'Dragon Master! 🐉',
     redirectUrl: 'DRAGON_SUCCESS_URL'
   }
   ```

2. **Add cards to data file** (`data/cards.json`):
   ```json
   {
     "id": "dragon-1",
     "name": "Blue-Eyes White Dragon",
     "image": "/images/cards/dragon/dragon-1.jpg",
     "score": 0,
     "tags": ["dragon", "reference"]
   }
   ```

3. **Set environment variable**:
   ```
   DRAGON_SUCCESS_URL=https://your-secret-page.com
   ```

### Card Requirements

- **Reference Deck**: Exactly 15 cards (score: 0)
- **Correct Answers**: Minimum 3 cards (score: 1) 
- **Distractors**: Minimum 9 cards (score: -1)
- **Total**: At least 27 cards for basic functionality

## 🎮 Game Flow

1. **Round 1-3**: User selects 1 card from 4 choices
2. **Timer**: 60 seconds per round
3. **Success**: All 3 rounds correct → redirect to secret URL
4. **Failure**: Wrong choice or timeout → locked screen with restart

## 🎨 Customization

### Themes

Modify `tailwind.config.js` for custom color schemes:

```javascript
colors: {
  monokai: {
    bg: '#your-bg-color',
    green: '#your-accent-color',
    // ... other colors
  }
}
```

### Animations

Adjust animation durations in `src/config/game-constants.ts`:

```typescript
export const ANIMATION_DURATIONS = {
  CARD_HOVER: 200,
  CARD_SELECTION: 300,
  SUCCESS_CELEBRATION: 800,
}
```

## 📊 Analytics

When Supabase is configured, the system tracks:

- Session starts and completions
- Round-by-round card selections
- Selection times and timeout events  
- User agent and screen resolution
- Success/failure rates per deck

### Database Schema

```sql
-- Sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  deck_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  success BOOLEAN,
  total_duration INTEGER
);

-- Round attempts table
CREATE TABLE round_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES game_sessions(session_id),
  round_number INTEGER NOT NULL,
  cards_shown TEXT[],
  correct_card_id TEXT NOT NULL,
  selected_card_id TEXT,
  selection_time INTEGER,
  was_timeout BOOLEAN DEFAULT FALSE
);
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** automatically on git push

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

### Project Structure

```
src/
├── app/                 # Next.js 14 app directory
├── components/          # React components
│   ├── game/           # Game-specific components  
│   ├── deck/           # Card display components
│   ├── ui/             # Reusable UI components
│   └── providers/      # Context providers
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── config/             # Configuration files
├── types/              # TypeScript type definitions
└── styles/             # Additional styles

data/
└── cards.json          # Card data

public/
└── images/             # Static assets
```

## 🔒 Security Features

- **Server-side verification** of game completion
- **Card shuffling** on failure to prevent answer lookup
- **Session isolation** - no cross-session data persistence
- **Environment variable masking** for sensitive URLs
- **Rate limiting** through automatic lockouts

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Ensure environment variables are properly configured
3. Verify card data meets minimum requirements
4. Check browser console for JavaScript errors

## 🌟 Acknowledgments

- Inspired by Yugioh Trading Card Game
- Built with modern React and Next.js best practices
- Designed for security-conscious applications