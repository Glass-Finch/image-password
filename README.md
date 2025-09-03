# 🎯 Generic Image Knowledge Authentication Platform

A Next.js-based password-protected landing page that uses image-based puzzles instead of traditional passwords. Users must demonstrate comprehensive knowledge of a specific image collection to gain access. **Completely theme-agnostic with Yu-Gi-Oh Fairy Deck as the current theme example.**

## 🎴 Current Status: PRODUCTION READY

- ✅ **Theme-Agnostic Platform**: Generic system with Yu-Gi-Oh as configurable theme
- ✅ **Complete Text Extraction**: All content configurable via JSON files
- ✅ **Study Phase**: Pre-challenge study time with image preloading
- ✅ **130 Image Database**: Reference collection + correct/distractor images
- ✅ **Category-Based Rounds**: Configurable round types and progression  
- ✅ **Mobile Features**: Tap-to-zoom modal, responsive design
- ✅ **URL Obfuscation**: Iframe-based success page hides destination
- ✅ **Analytics Ready**: Supabase integration with category tracking

## 🚀 **Key Features**

### 📚 **Study Phase (New)**
- **Untimed study period**: Users can examine reference collection without pressure
- **Image preloading**: All 130+ images load during study phase with progress bar
- **Ready button**: Challenge only begins when user clicks "🚀 Begin Challenge"
- **Educational approach**: Encourages proper study before timed challenge

### 🎮 **Three-Round Challenge System**
- **Configurable rounds**: Any number of image categories
- **60-second timer**: Only starts after study phase button click
- **Punishment system**: Wrong choice shows lock screen + study button
- **Success flow**: Celebration animation → iframe redirect

### 🎨 **Complete Theme System**
- **JSON-driven content**: All text/labels in `public/config/text/en.json`
- **No hardcoded strings**: Codebase is completely theme-neutral
- **Generic file names**: No theme-specific terminology in code
- **Easy theme switching**: Change JSON file + images = new theme
- **Multi-language ready**: Add new language JSON files

### 📱 **Enhanced Mobile Experience**
- **Tap-to-zoom modal**: Double-tap any image for full-screen detail
- **1.75x hover zoom**: Desktop image inspection with proper layering
- **Responsive layout**: Optimized for all screen sizes
- **Study integration**: "Go Study Up" button opens learning materials

### 🔒 **Advanced Security & UX**
- **URL obfuscation**: Success content in iframe (secret URL hidden)
- **Image preloading**: All images loaded before challenge starts
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

### File Structure (Updated)
```
src/
├── app/                          # Next.js routes
├── components/
│   ├── collection/              # Generic image display (was deck/)
│   │   ├── ItemImage.tsx        # Generic image component (was CardImage)
│   │   └── ReferenceCollection.tsx  # Generic collection display (was ReferenceDeck)
│   ├── game/                    # Core game logic
│   │   ├── ItemChoices.tsx      # Generic item selection (was CardChoices)
│   │   ├── StudyPhase.tsx       # Pre-challenge study component (new)
│   │   └── GameTimer.tsx        # Timer component
│   ├── providers/               # Context providers
│   └── ui/                      # UI components
│       └── ItemZoomModal.tsx    # Mobile zoom modal (was CardZoomModal)
├── config/
│   ├── collection-configs.ts    # Generic collection config (was deck-configs)
│   └── game-constants.ts        # Game mechanics
├── hooks/
│   ├── useText.ts              # Text/theme loading
│   └── useAnalytics.ts         # Data tracking
└── utils/                      # Generic utilities
    ├── itemUtils.ts            # Generic utilities (was cardUtils)
    └── gameLogic.ts            # Game logic

public/
├── images/items/               # Theme images (was cards/)
│   ├── reference/             # Reference collection (was fairy/)
│   ├── correct/               # Matching images  
│   └── distractors/          # Non-matching images
├── items.json                 # Image metadata (was cards.json)
└── config/text/
    └── en.json               # All theme-specific text
```

## 🎯 **Current Theme: Yu-Gi-Oh Fairy Deck**

### Enhanced Game Flow
1. **Study Phase**: "Are you up for the challenge of completing this Yu-Gi-Oh deck?"
   - Reference deck visible for study
   - Progress bar shows image loading (0-100%)
   - Tips and instructions displayed
   - "🚀 Begin Challenge" button when ready

2. **Round 1**: 🎭 Monster Cards - Choose 1 correct fairy monster from 6 options
3. **Round 2**: 📜 Spell Cards - Choose 1 correct fairy spell from 6 options  
4. **Round 3**: 🪤 Trap Cards - Choose 1 correct fairy trap from 6 options
5. **Success**: "✨ Fairy Deck Master" → iframe with hidden URL
6. **Failure**: Lock screen → "Try Again 🎮" or "Go Study Up 📚"

### Content
- **Title**: "✨ Yu-Gi-Oh! Trials of the Fairies ✨"
- **Study Instructions**: "Are you up for the challenge of completing this Yu-Gi-Oh deck?"
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
  "studyPhase": {
    "instructions": "Ready to master grass-type Pokémon? Study the types and begin your challenge!"
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
public/images/items/
├── reference/     # 15 grass-type Pokémon
├── correct/       # Grass support cards
└── distractors/   # Fire/water/other types
```

### 3. Update Items Data
```json
// public/items.json
{
  "item_type": "basic",  // or "stage1", "stage2"
  "tags": ["grass", "reference"]
}
```

**No code changes needed!** The same generic system works for any theme.

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
- **Images**: Replace files in `public/images/items/`
- **Metadata**: Update `public/items.json`

## 🎮 **Enhanced User Experience**

### Study Phase Benefits
- **No time pressure**: Study reference collection as long as needed
- **Image preloading**: All images ready before challenge starts
- **Educational approach**: Encourages proper preparation
- **Progress feedback**: Visual loading progress during preload
- **Smooth transition**: Instant challenge start when ready

### Mobile Enhancements
- **Double-tap zoom**: Full-screen image detail modal
- **Touch-friendly**: Large touch targets and gestures
- **Responsive design**: Optimal layouts for all devices

## 📊 **Analytics Features**

When Supabase is configured:
- Session tracking with device info
- Study phase duration tracking
- Round-by-round performance by category
- Success/failure rates and timing
- Study button usage tracking

**Setup**: Run `supabase-schema.sql` in your Supabase dashboard

## 🧪 **Testing**

- **17 test cases**: Core functionality verified
- **Generic test data**: Tests use item terminology
- **Build validation**: TypeScript and ESLint validation
- **Theme system**: JSON loading and text extraction tested

```bash
npm test           # Run test suite
npm run lint       # Check code quality  
npm run type-check # Validate TypeScript
```

## 🌟 **Architecture Benefits**

- **Generic platform**: Works for any image-based knowledge challenge
- **Study-first approach**: Educational rather than punitive
- **Complete separation**: Code is 100% theme-neutral
- **Easy theming**: JSON + images = new theme (no coding required)
- **Multi-language ready**: Add translation JSON files
- **Production ready**: Clean, tested, optimized codebase
- **Security-first**: Session isolation, URL hiding, anti-cheating measures

## 📝 **License**

MIT License - see LICENSE file for details.

---

*A completely generic image-based knowledge authentication platform with study-first approach. Current theme: Yu-Gi-Oh Fairy Deck mastery challenge.*