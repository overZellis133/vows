# Vows Application - Project Summary

## Overview
A beautiful, AI-powered web application that helps users create heartfelt vows and personal letters inspired by the wisdom of famous philosophers and thinkers. Users can choose from curated quotes or connect their Readwise account to use their own saved highlights as inspiration.

## Features Implemented

### ✅ Core Features
1. **Quote Selection System**
   - 20+ curated quotes from famous philosophers (Socrates, Aristotle, Lao Tzu, Jung, etc.)
   - Organized by categories: love, wisdom, growth, relationships, etc.
   - Visual quote browser with author information and historical context
   - Tab interface for switching between philosophers and Readwise quotes

2. **AI-Powered Vow Generation**
   - Integrated OpenAI GPT-4o-mini for generating personalized vows
   - Context-aware prompts that incorporate selected quotes
   - Support for different relationship types (spouse, partner, friend, family)
   - Warm, genuine tone optimized for meaningful personal letters

3. **User Interface**
   - Beautiful, modern design with rose/pink gradient theme
   - Responsive layout that works on all devices
   - Smooth interactions and loading states
   - Dark mode support
   - Editable text area for customizing generated vows
   - Copy to clipboard functionality

4. **Readwise Integration (Infrastructure)**
   - API endpoints ready for Readwise highlights
   - TypeScript types for Readwise data structures
   - Pagination support for large highlight collections
   - UI placeholder for future Readwise features

## Technical Implementation

### Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Icons**: Lucide React
- **AI**: OpenAI API
- **State Management**: React hooks (useState)

### Project Structure
```
vows/
├── app/
│   ├── api/
│   │   ├── generate/route.ts     # OpenAI vow generation API
│   │   └── readwise/route.ts     # Readwise highlights API
│   ├── layout.tsx                # Root layout and metadata
│   ├── page.tsx                  # Main application UI
│   └── globals.css               # Global styles and theme
├── lib/
│   ├── quotes.ts                 # Curated philosopher quotes
│   ├── readwise.ts               # Readwise API utilities
│   └── utils.ts                  # Shared utilities
├── README.md                     # Full project documentation
├── SETUP.md                      # Setup instructions
└── PROJECT_SUMMARY.md            # This file
```

### API Endpoints

1. **POST /api/generate**
   - Generates vows using OpenAI
   - Input: quote, personName, relationship
   - Output: generated vows text

2. **POST /api/readwise**
   - Fetches highlights from Readwise
   - Input: apiKey
   - Output: array of highlights

### Key Files

**app/page.tsx** (299 lines)
- Main application interface
- Two-column layout: quote selection + vow generation
- State management for quotes, vows, and user input
- Client-side rendering with React hooks

**lib/quotes.ts** (81 lines)
- 20 curated philosopher quotes
- Helper functions for filtering and searching
- Category-based organization

**app/api/generate/route.ts** (67 lines)
- OpenAI integration
- Context-rich prompt engineering
- Error handling and validation

**lib/readwise.ts** (64 lines)
- Readwise API client
- Pagination support
- Type definitions

## User Experience Flow

1. User visits the application
2. Browses quotes from famous philosophers
3. Selects a quote that resonates
4. Selects relationship type (spouse, partner, friend, family)
5. Enters the name of their loved one
6. Clicks "Generate Vows"
7. AI creates personalized vows incorporating the quote
8. User edits and customizes the vows
9. User copies vows for their special occasion

## Design Decisions

1. **Quote-Driven Approach**: Starting with a meaningful quote helps users express deeper feelings
2. **AI Assistance**: Not replacing human creativity, but helping users articulate their thoughts
3. **Multiple Relationship Types**: Acknowledging that vows aren't just for weddings
4. **Editable Output**: Always keeping the user in control of the final text
5. **Modern UI**: Clean, elegant design that doesn't distract from the meaningful content

## Future Enhancements

- [ ] Full Readwise OAuth integration
- [ ] PDF export functionality
- [ ] Local draft storage
- [ ] Multiple generation styles (formal, casual, poetic, etc.)
- [ ] Social sharing features
- [ ] More quote categories and sources
- [ ] User accounts and saved vows
- [ ] Email delivery feature

## Getting Started

1. Install dependencies: `npm install`
2. Create `.env.local` with `OPENAI_API_KEY`
3. Run: `npm run dev`
4. Visit: http://localhost:3000

See SETUP.md for detailed instructions.

## Technologies Used

- Next.js 16.0.1
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- OpenAI SDK 6.7.0
- Lucide React
- Vercel deployment ready

## License
MIT License

## Acknowledgments
Inspired by the wisdom of great thinkers throughout history. Created to help people express their deepest feelings and commitments.

