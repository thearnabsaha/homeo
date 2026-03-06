# RepertoryAI

AI-Powered Homeopathic Repertory based on Kent's Repertory. Intelligent symptom analysis and remedy suggestions.

## Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Express.js, Node.js, REST API
- **AI**: Grok API (xAI) for symptom analysis and remedy suggestions
- **Speech**: Web Speech API (speech-to-text & text-to-speech)
- **Languages**: English and Bengali

## Quick Start

### Backend

```bash
cd backend
npm install
# Edit .env and add your Grok API key
node server.js
```

The backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Data Scraper (Optional)

To fetch the full Kent Repertory dataset:

```bash
cd backend
node scripts/scraper.js
```

## Features

- Hierarchical symptom explorer (22 chapters from Kent's Repertory)
- Remedy listing with strength ratings
- AI-powered multi-symptom analysis via Grok API
- Floating AI chat assistant
- Voice input (speech-to-text)
- Audio reading (text-to-speech)
- Global search with autocomplete
- English/Bengali language switching
- Symptom bookmarking
- Recent search history
- Minimalist black & white medical interface
- Fully responsive design

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/symptoms` | GET | List all chapters |
| `/api/symptoms/:id` | GET | Symptom detail + remedies |
| `/api/symptoms/search?q=` | GET | Search symptoms |
| `/api/remedies` | GET | List all remedies |
| `/api/remedies/:id` | GET | Remedy detail |
| `/api/remedies/search?q=` | GET | Search remedies |
| `/api/analyze-symptoms` | POST | AI symptom analysis |
| `/api/chat` | POST | AI chat |

## Environment Variables

Create `backend/.env`:

```
GROK_API_KEY=your_grok_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Get a Grok API key from [console.x.ai](https://console.x.ai/).
The app works without an API key using a built-in fallback repertorization engine.
