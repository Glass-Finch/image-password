# 🎯 Generic Image Knowledge Authentication Platform

A Next.js-based password-protected landing page that uses image-based puzzles instead of traditional passwords. Users must demonstrate comprehensive knowledge of a specific image collection to gain access. **Completely theme-agnostic with Yu-Gi-Oh Fairy Deck as the current theme example.**

## 🎴 Current Status: PRODUCTION READY

- ✅ **Theme-Agnostic Platform**: Generic system with Yu-Gi-Oh as configurable theme
- ✅ **Complete Text Extraction**: All content configurable via JSON files
- ✅ **130 Image Database**: Reference collection + correct/distractor images
- ✅ **Category-Based Rounds**: Configurable round types and progression  
- ✅ **Mobile Features**: Tap-to-zoom modal, responsive design
- ✅ **URL Obfuscation**: Iframe-based success page hides destination
- ✅ **Analytics Ready**: Supabase integration with category tracking

## 🚀 **Key Features**

### 🎮 **Three-Round Challenge System**
- **Configurable rounds**: Any number of image categories
- **60-second timer**: Visual countdown with progressive warnings
- **Punishment system**: Wrong choice shows lock screen + study button
- **Success flow**: Celebration animation → iframe redirect

### 🎨 **Complete Theme System**
- **JSON-driven content**: All text/labels in `public/config/text/en.json`
- **No hardcoded strings**: Codebase is completely theme-neutral
- **Easy theme switching**: Change JSON file + images = new theme
- **Multi-language ready**: Add new language JSON files

### 📱 **Enhanced Mobile Experience**
- **Tap-to-zoom modal**: Double-tap any image for full-screen detail
- **1.75x hover zoom**: Desktop card inspection with proper layering
- **Responsive layout**: Optimized for all screen sizes
- **Study integration**: "Go Study Up" button opens learning materials

### 🔒 **Advanced Security & UX**
- **URL obfuscation**: Success content in iframe (secret URL hidden)
- **Image preloading**: All 130+ images loaded before gameplay
- **Session isolation**: Each attempt gets unique tracking ID
- **Analytics tracking**: Comprehensive Supabase data collection

## 🛠 **Tech Stack**

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS with Monokai theme
- **Animations**: Framer Motion
- **Analytics**: Supabase (optional)
- **Text System**: JSON-based configuration
- **Deployment**: Vercel-ready

## 📁 **Theme-Agnostic Architecture**

### File Structure
```
src/
├── app/                          # Next.js routes
├── components/
│   ├── collection/              # Generic image display (was deck/)
│   │   ├── ItemImage.tsx        # Generic image component (was CardImage)
│   │   └── ReferenceCollection.tsx  # Generic collection display (was ReferenceDeck)
│   ├── game/                    # Core game logic
│   ├── providers/               # Context providers
│   └── ui/                      # UI components
├── config/
│   ├── collection-configs.ts    # Generic collection config (was deck-configs)
│   └── game-constants.ts        # Game mechanics
├── hooks/
│   ├── useText.ts              # Text/theme loading
│   └── useAnalytics.ts         # Data tracking
└── utils/                      # Generic utilities

public/
├── images/cards/               # Theme images
│   ├── reference/             # Reference collection (was fairy/)
│   ├── correct/               # Matching images  
│   └── distractors/          # Non-matching images
├── cards.json                 # Image metadata
└── config/text/
    └── en.json               # All theme-specific text
```

## 🎯 **Current Theme: Yu-Gi-Oh Fairy Deck**

### Game Flow
1. **Loading**: Progress bar preloads all 130 images
2. **Round 1**: 🎭 Monster Cards - Choose 1 correct fairy monster from 6 options
3. **Round 2**: 📜 Spell Cards - Choose 1 correct fairy spell from 6 options  
4. **Round 3**: 🪤 Trap Cards - Choose 1 correct fairy trap from 6 options
5. **Success**: "✨ Fairy Deck Master" → iframe with hidden URL
6. **Failure**: Lock screen → "Try Again 🎮" or "Go Study Up 📚"

### Content
- **Title**: "✨ Yu-Gi-Oh! Trials of the Fairies ✨"
- **Challenge**: Prove fairy deck building mastery
- **Categories**: Monster/Spell/Trap card knowledge
- **Study materials**: Yu-Gi-Oh wiki integration

## 🔄 **Creating New Themes**

### 1. Update Text Configuration
```json
// public/config/text/pokemon-en.json
{
  "game": {
    "title": "✨ Pokémon Grass Challenge ✨",
    "subtitle": "🌱 Prove your grass-type mastery! 🌱"
  },
  "rounds": {
    "types": ["basic", "stage1", "stage2"],
    "labels": {
      "basic": "🌱 Basic Pokémon",
      "stage1": "🌿 Stage 1",
      "stage2": "🌳 Stage 2"
    }
  }
}
```

### 2. Replace Images
```
public/images/cards/
├── reference/     # 15 grass-type Pokémon
├── correct/       # Grass support cards
└── distractors/   # Fire/water/other types
```

### 3. Update Cards Data
```json
// public/cards.json
{
  "card_type": "basic",  // or "stage1", "stage2"
  "tags": ["grass", "reference"]
}
```

**No code changes needed!** The same generic system works for any theme.

## 🚀 **Quick Start**

```bash
git clone <repository-url>
cd image-password
npm install
cp .env.example .env.local
# Edit .env.local with your URLs
npm run dev
```

## ⚙️ **Configuration**

### Environment Variables
```env
# Required
DEFAULT_SUCCESS_URL=https://your-secret-destination.com
NEXT_PUBLIC_SUCCESS_URL=https://your-secret-destination.com
NEXT_PUBLIC_LOSS_REDIRECT_URL=https://your-study-materials.com

# Optional Analytics
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### Theme Configuration
- **Text/Content**: Edit `public/config/text/en.json`
- **Images**: Replace files in `public/images/cards/`
- **Metadata**: Update `public/cards.json`

## 📊 **Analytics Features**

When Supabase is configured:
- Session tracking with device info
- Round-by-round performance by category
- Success/failure rates and timing
- Study button usage tracking

**Setup**: Run `supabase-schema.sql` in your Supabase dashboard

## 🎨 **Advanced Features**

- **Mobile tap-to-zoom**: Double-tap for full-screen image detail
- **URL obfuscation**: Success content in iframe (destination hidden)
- **Image preloading**: Instant round transitions
- **Comprehensive testing**: 17 test cases covering core logic
- **TypeScript**: Full type safety throughout

## 🌟 **Benefits**

- **Generic platform**: Works for any image-based knowledge challenge
- **Easy theming**: JSON + images = new theme (no coding required)
- **Multi-language ready**: Add translation JSON files
- **Production ready**: Clean, tested, optimized codebase
- **Security-first**: Session isolation, URL hiding, anti-cheating measures

## 📝 **License**

ISC License - see LICENSE file for details.

---

*A completely generic image-based knowledge authentication platform. Current theme: Yu-Gi-Oh Fairy Deck mastery challenge.*