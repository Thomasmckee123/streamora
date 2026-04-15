# SvelteTube

A YouTube-like video browsing application built with SvelteKit. This is a portfolio/demo project showcasing a Svelte front-end implementation of a video browsing experience.

## Features

- **Home Page** — Responsive grid of video thumbnails with titles, channel names, and metadata
- **Watch Page** — HTML5 video player with video details
- File-based routing with SvelteKit
- TypeScript throughout
- Dark theme inspired by YouTube

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) — Full-stack Svelte framework with file-based routing
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [Vite](https://vitejs.dev/) — Fast build tool and dev server

## Project Structure

```
src/
├── lib/data/videos.ts          # Mock video data (hardcoded)
├── routes/
│   ├── +layout.svelte          # App shell with nav bar
│   ├── +page.svelte            # Home page — video grid
│   └── watch/[id]/
│       ├── +page.ts            # Load function (find video by id)
│       └── +page.svelte        # Watch page — video player
├── app.html                    # HTML template
└── app.css                     # Global styles
```
