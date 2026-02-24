# Site Cloner

Clone any website completely—HTML, CSS, images, fonts, content—and package it for WordPress.

## Quick Start

```bash
npm install
npm start
```

Opens at **http://localhost:3000**

**Puppeteer is default** (hero images, carousels). For HTTP-only (faster, no Chrome):
```bash
npm run start:http
```

## Deploy to Render (free tier)

1. Push to GitHub
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your repo (`pumpmaster69` or `lganmann-cyber/pumpmaster69`)
4. Set **Environment** to **Docker** (uses the included Dockerfile)
5. Choose **Free** plan
6. Click **Create Web Service**

Puppeteer runs fully. Free tier spins down after ~15 min idle; first request may take 30–60s to wake.

## Deploy to Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
3. Select your repo; Railway auto-detects Node.js and uses `npm start`
4. Add a **domain** in Settings → Networking
5. **Optional:** Add Upstash Redis env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) for job persistence across restarts

Puppeteer runs fully on Railway—hero images and carousels work.

## Deploy to Vercel

1. Push to GitHub, then [import the repo](https://vercel.com/new) in Vercel
2. Add **Upstash Redis** (Vercel Dashboard → Storage → Create Database) so job state persists across serverless instances
3. Deploy (no build command needed)
4. **Limitations:** Puppeteer disabled (HTTP-only). Clone output is ephemeral (/tmp)—downloads may fail on cold starts. For full support, run locally or use Railway.

## Usage

1. Enter any website URL
2. Select what to extract (CSS, Images, Fonts, Content)
3. Click **Clone Entire Website**
4. Watch real-time progress
5. Download **WordPress Theme** or **All Files**

## WordPress Installation

1. Download the WordPress Theme ZIP
2. In WordPress: **Appearance → Themes → Add New → Upload Theme**
3. Upload the ZIP and activate

## API

- `POST /api/clone` — Start clone job (returns `jobId`)
- `GET /api/status/:jobId` — Poll progress
- `GET /api/download/:jobId/wordpress` — Download WP theme ZIP
- `GET /api/download/:jobId/all` — Download full clone ZIP

## Project Structure

```
site-cloner/
├── index.html          # Frontend dashboard
├── server.js           # Express API server
├── package.json
└── src/
    ├── cloner.js       # Main orchestration
    ├── crawler.js      # Multi-page crawling (Puppeteer)
    ├── fetcher.js      # HTTP with retry
    ├── extractors/     # HTML, CSS, images, fonts, content
    ├── rewriter.js     # URL path rewriting
    ├── wordpress.js    # WP theme generation
    └── utils/          # Logger, ZIP
```
