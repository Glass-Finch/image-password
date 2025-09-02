# ✨ Yu-Gi-Oh! Trials of the Fairies ✨

A Next.js-based password-protected landing page that uses image-based puzzles instead of traditional passwords. Users must demonstrate comprehensive knowledge of Yu-Gi-Oh! fairy deck strategy across monsters, spells, and traps to gain access.

## 🎴 Current Status: PRODUCTION READY

- ✅ **Complete Card Database**: 130 authentic Yu-Gi-Oh! cards (15 reference + 24 correct + 91 distractors)
- ✅ **Category-Based Rounds**: Monster → Spell → Trap progression  
- ✅ **Image Preloading**: All images loaded before gameplay with progress bar
- ✅ **Mobile Responsive**: Optimized for all devices with 1.75x hover zoom
- ✅ **Clean Codebase**: Linted, tested, and production-ready

## 🎯 Game Features

### 🎮 **Three-Round Challenge**
- **Round 1**: 🎭 Monster Cards - Choose 1 correct fairy monster from 6 options
- **Round 2**: 📜 Spell Cards - Choose 1 correct fairy spell from 6 options  
- **Round 3**: 🪤 Trap Cards - Choose 1 correct fairy trap from 6 options
- **Timer**: 60 seconds per round with visual countdown
- **Punishment**: Wrong choice shows lock screen, manual restart required

### 🃏 **Card Database**
- **Reference Deck**: 15 fairy cards displayed on left (5 rows × 3 cards)
- **Correct Cards**: 24 fairy support cards (11 monsters, 8 spells, 5 traps)
- **Distractor Cards**: 91 non-fairy cards (50 monsters, 17 spells, 24 traps)
- **All Real Cards**: Authentic Yu-Gi-Oh! card images with proper categorization

### 🎨 **Visual Design**
- **Purple Theme**: Monokai color palette with purple as primary accent
- **Kawaii Elements**: Magical sparkles, animated progress bars, success celebrations
- **Card Interactions**: 1.75x hover zoom with proper z-index layering
- **Responsive Layout**: Desktop (side-by-side) and mobile (stacked) optimized

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **Styling**: TailwindCSS with custom Monokai theme
- **Animations**: Framer Motion for smooth interactions
- **Analytics**: Supabase integration (optional)
- **Deployment**: Vercel-ready with environment configuration

## 🚀 Quick Start

### Installation

```bash
git clone <repository-url>
cd image-password
npm install
```

### Configuration

Copy environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Required
FAIRY_SUCCESS_URL=https://your-secret-destination.com
NEXT_PUBLIC_DEFAULT_DECK=fairy

# Optional (Supabase Analytics)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Development

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Code linting
npm run type-check   # TypeScript validation
npm test             # Run test suite
```

## 🎯 Game Flow

1. **Loading**: Progress bar loads all 130 card images
2. **Round 1**: Select correct monster from 6 fairy monsters vs 5 distractor monsters
3. **Round 2**: Select correct spell from 6 fairy spells vs 5 distractor spells
4. **Round 3**: Select correct trap from 6 fairy traps vs 5 distractor traps
5. **Success**: Kawaii celebration animation → redirect to secret URL
6. **Failure**: Lock screen with restart button (reshuffles cards)

## 📐 Layout

### Desktop
```
✨ Yu-Gi-Oh! Trials of the Fairies ✨
🧚‍♀️ Prove your fairy deck mastery! 🧚‍♀️

┌─────────────────────┬─────────────────────┐
│   🎴 Reference Deck │    ⏱️ 1:00         │
│   (5 rows × 3)      │   Round 1 of 3     │
│   [🎴][🎴][🎴]     │   🎭 Monster Cards  │
│   [🎴][🎴][🎴]     │                     │
│   [🎴][🎴][🎴]     │   ⚡ Choose the Card │
│   [🎴][🎴][🎴]     │   [🎴][🎴][🎴]    │
│   [🎴][🎴][🎴]     │   [🎴][🎴][🎴]    │
└─────────────────────┴─────────────────────┘
```

### Mobile
- Card choices on top (2 rows × 3 cards)
- Timer and progress in middle
- Reference deck at bottom (scrollable)

## 🔒 Security Features

- **Session Isolation**: Each attempt gets unique session ID
- **Card Reshuffling**: Wrong choices trigger complete card randomization
- **Server-Side Verification**: API routes validate completion before redirect
- **Environment Masking**: Success URL hidden via environment variables
- **No Persistence**: Game resets completely on browser refresh

## 🎨 Customization

### Adding New Decks

1. **Add card images** to `public/images/cards/`
2. **Update cards.json** with new card data
3. **Configure deck** in `src/config/deck-configs.ts`
4. **Set environment variables** for success URL

### Card Requirements
- **Reference deck**: Exactly 15 cards (score: 0)
- **Correct answers**: Minimum 3 each of monsters/spells/traps (score: 1)
- **Distractors**: Minimum 15 each of monsters/spells/traps (score: -1)

## 📊 Analytics (Optional)

When Supabase is configured, tracks:
- Session attempts and completions
- Round-by-round selections and timing
- Success/failure rates by card type
- User agent and device information

## 🚢 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on git push

### Environment Variables
```env
FAIRY_SUCCESS_URL=https://your-secret-blog.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## 🧪 Testing

- **Unit Tests**: Core utility functions tested
- **Build Testing**: TypeScript and ESLint validation
- **Game Logic**: Category-based round generation verified

```bash
npm test           # Run test suite
npm run lint       # Check code quality
npm run type-check # Validate TypeScript
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js 14 app directory
│   ├── api/            # API routes (analytics, redirect)
│   └── ...             # Pages and layouts
├── components/          # React components
│   ├── deck/           # Card display components
│   ├── game/           # Game logic components
│   ├── providers/      # Context providers
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── config/             # Configuration files
└── types/              # TypeScript definitions

public/
├── images/cards/       # Card images (130 total)
│   ├── fairy/         # Reference deck (15)
│   ├── correct/       # Fairy support (24)
│   └── distractors/   # Non-fairy (91)
└── cards.json         # Card metadata
```

## 🌟 Key Features

- **Deck-Agnostic Architecture**: Easily configurable for different card themes
- **Category-Based Challenge**: Tests knowledge across all card types
- **High-Quality Images**: 1.75x hover zoom with crisp detail visibility
- **Comprehensive Preloading**: All images loaded before gameplay
- **Purple Monokai Theme**: Dark magical aesthetic with kawaii elements
- **Security-First Design**: Prevents answer lookup and memorization

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 🐛 Support

For issues or questions:
1. Check existing [Issues](../../issues)
2. Verify environment configuration
3. Ensure card images are properly formatted
4. Check browser console for errors

---

*Built with modern React/Next.js practices for security-conscious applications requiring domain-specific knowledge authentication.*