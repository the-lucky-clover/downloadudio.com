# Downloadudio - AI-Powered Audio Extraction

## Project info

**Live URL**: https://downloadudio.pages.dev

A modern web application that extracts audio files from any website using AI-powered scanning technology.

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Cloudflare Pages

## Local Development

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone https://github.com/the-lucky-clover/downloadudio.com.git

# Step 2: Navigate to the project directory
cd downloadudio.com

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Build for Production

```sh
npm run build
```

The build output will be in the `dist` directory.

## Deployment

This project is deployed on Cloudflare Pages. Any push to the main branch will automatically trigger a new deployment.

To deploy manually:

```sh
npm run build
wrangler pages deploy dist --project-name=downloadudio
```

## Features

- AI-powered audio detection and extraction
- Support for multiple audio formats
- Fast and secure processing
- No sign-up required
- Clean, modern UI with Tailwind CSS
- Responsive design

## License

MIT
