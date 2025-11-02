# Setup Instructions

## Quick Start

1. **Install dependencies** (already done if you ran the dev server):
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

You can get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

3. **Start the development server**:
```bash
npm run dev
```

4. **Open the app**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Optional: Readwise Integration

To use Readwise quotes (currently in development):

1. Get your Readwise API key from [readwise.io/access_token](https://readwise.io/access_token)
2. Add it to `.env.local`:

```bash
READWISE_API_KEY=your_readwise_api_key_here
```

Note: The UI for Readwise integration is coming soon. The API endpoints are already implemented.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

## Troubleshooting

### OpenAI API errors
- Make sure your API key is valid and has credits
- Check that `OPENAI_API_KEY` is set in your `.env.local` file
- Restart your dev server after adding environment variables

### Build errors
- Make sure all dependencies are installed: `npm install`
- Clear Next.js cache: `rm -rf .next`
- Try rebuilding: `npm run build`

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for vow generation |
| `READWISE_API_KEY` | No | Your Readwise API key for personal highlights |

## Testing the App

1. Start the dev server: `npm run dev`
2. Select a quote from the philosophers section
3. Enter a name and select the relationship type
4. Click "Generate Vows"
5. Edit the generated vows as needed
6. Copy your vows

## Next Steps

- Add more quotes to `lib/quotes.ts`
- Customize the AI prompt in `app/api/generate/route.ts`
- Enhance the UI styling in `app/page.tsx` and `app/globals.css`
- Add features like PDF export, saving drafts, etc.

