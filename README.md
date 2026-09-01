# nikud-practice

An interactive app for practicing Hebrew niqqud (vowel points). Pick a text — either from Sefaria or pasted in freely — and practice adding niqqud to it letter by letter, with instant feedback and a score at the end of each word, plus a full summary once you're done.

## What it does

The home page gives you two ways to start:

- **Pick a source** — load a chapter from Psalms or from one of the five books of the Torah (Genesis–Deuteronomy) through the [Sefaria](https://www.sefaria.org) API, with a preview before you dive in.
- **Paste your own text** — drop in any Hebrew passage. If it's already voweled, it's used as-is; if not, it gets run through the [Dicta Nakdan](https://nakdan.dicta.org.il) vowelization service before practice starts.

Once you're in, practice goes word by word. Each word shows up "bare" (no niqqud), and you pick a letter and attach a vowel point from a marks panel — vowels, hataf vowels, dagesh/mapiq, right or left shin dot. Hit "check" and you get a score for that word (percentage of correctly voweled letters), along with a view of your mistakes against the correct niqqud. Once you've gone through every word, a results page shows your overall score with a word-by-word breakdown, and you can start a new round from there.

## Tech stack

- **Frontend:** React 19, Vite, React Router v7, CSS Modules, oxlint
- **Backend:** Node.js, Express 5, express-rate-limit, cors, dotenv, nodemon (dev)
- **External services:** Sefaria API (source texts), Dicta Nakdan API (automatic vowelization)

## Features

- Two ways to get text: a ready-made source from Sefaria (Psalms or Torah, by book and chapter), or your own pasted text
- Automatic detection of whether pasted text already has niqqud, and auto-vowelization through Dicta Nakdan when it doesn't
- Letter-by-letter interactive niqqud practice with a marks panel (mutually exclusive vowels, dagesh as its own toggle, right/left shin)
- Instant checking with a per-word score (percentage of letters voweled correctly) and a view of mistakes next to the correct niqqud
- A results page summarizing overall score with a word-by-word breakdown, plus a restart option
- Rate limiting (20 requests/minute) on the auto-vowelization calls to keep from hammering the external service
- Server-side caching (24 hours) for text chapters pulled from Sefaria
- Credit to both sources (Sefaria and Dicta) shown in the app

## Setup

The project is split into `client` (React) and `server` (Express), each with its own `package.json`.

```bash
git clone https://github.com/EyalHar/nikud-practice.git
cd nikud-practice

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment variables

The `server` folder has a `.env.example` file — copy it to `.env` and adjust as needed:

```bash
cd server
cp .env.example .env
```

```
PORT=4000
SEFARIA_BASE_URL=https://www.sefaria.org/api
DICTA_BASE_URL=https://nakdan-u1-0.loadbalancer.dicta.org.il/api
CLIENT_ORIGIN=http://localhost:5173
```

## How to run

### Development

Run the server and the client in two separate terminals:

```bash
# Terminal 1 - server (http://localhost:4000)
cd server
npm run dev
```

```bash
# Terminal 2 - client (http://localhost:5173)
cd client
npm run dev
```

Vite's dev server proxies `/api` to `http://localhost:4000`, so the client can talk to the server without any extra CORS setup in dev.

### Production build

```bash
cd client
npm run build      # builds the client into dist
npm run preview    # serves a local preview of the build

cd ../server
npm start           # runs the server (node src/index.js)
```

## Project structure

```
nikud-practice/
├── client/                     # React app (Vite)
│   └── src/
│       ├── pages/               # HomePage, PracticePage, ResultsPage
│       ├── components/          # layout (AppShell, Header) + shared UI (Button, Spinner...)
│       ├── hooks/                # useSefariaSources, useNakdanAnalyze
│       ├── context/              # PracticeSessionContext - practice state and score
│       ├── constants/             # niqqudMarks - definitions for the niqqud marks panel
│       ├── utils/                  # niqqud/letter parsing, tokenizer, scoring
│       └── api/                    # client fetch calls to the server
└── server/                     # Express API
    └── src/
        ├── routes/               # /api/sources, /api/sefaria, /api/nakdan
        ├── controllers/
        ├── services/              # Sefaria and Dicta Nakdan services
        ├── middleware/             # error handler
        ├── utils/                  # cache
        └── data/                    # source catalog (books and chapters)
```
