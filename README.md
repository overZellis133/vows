# Vows - Personalized Vow Generator

A beautiful Next.js application that helps you create heartfelt vows and personal letters inspired by the wisdom of famous philosophers and thinkers throughout history. Connect your Readwise account to use your own saved highlights, or choose from a curated collection of timeless quotes.

## Features

- 🎭 **Curated Quotes**: Select from 20+ beautiful quotes from Socrates, Aristotle, Lao Tzu, and other great thinkers
- 📚 **Readwise Integration**: Connect your Readwise account to use your own saved highlights as inspiration
- 🤖 **AI-Powered Generation**: Generate personalized vows using OpenAI's GPT models
- ✨ **Beautiful UI**: Modern, elegant interface with a thoughtful user experience
- 💝 **Multiple Formats**: Create vows for spouses, partners, friends, or family members
- 🎨 **Fully Editable**: Customize and refine your generated vows with a built-in editor

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))
- Optional: A Readwise account for personal highlights

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vows
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# Readwise API Key (optional)
READWISE_API_KEY=your_readwise_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Choose a Quote Source**: Select between curated philosophers' quotes or your Readwise highlights
2. **Pick Your Seed Quote**: Browse and select a quote that resonates with you
3. **Enter Details**: Provide the name of your loved one and your relationship
4. **Generate**: Click "Generate Vows" to create personalized vows using AI
5. **Customize**: Edit the generated vows to make them perfect for your occasion
6. **Save**: Copy your vows to use for your special moment

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: Lucide React icons
- **AI**: OpenAI GPT-4o-mini
- **Type Safety**: TypeScript
- **Deployment**: Vercel-ready

## Project Structure

```
vows/
├── app/
│   ├── api/
│   │   ├── generate/     # OpenAI vow generation endpoint
│   │   └── readwise/     # Readwise highlights fetch endpoint
│   ├── page.tsx          # Main application UI
│   └── layout.tsx        # Root layout and metadata
├── lib/
│   ├── quotes.ts         # Curated philosopher quotes
│   ├── readwise.ts       # Readwise API utilities
│   └── utils.ts          # Shared utilities
└── components.json       # shadcn/ui configuration
```

## Future Enhancements

- [ ] Full Readwise OAuth integration
- [ ] Export to PDF functionality
- [ ] Save drafts locally
- [ ] Multiple vow generation styles
- [ ] Sharing and social features
- [ ] More quote sources and categories

## License

MIT License - feel free to use this for your special occasions!

## Acknowledgments

Inspired by the wisdom of great thinkers throughout history. Created with ❤️ for meaningful connections.
