# DataTrace — Personal Data Exposure Tracker

A Business Ethics class project that shows users:
1. **Which data breaches** their email has appeared in (via HaveIBeenPwned)
2. **Which data brokers** operate in the industry and how to opt out
3. **How much their data is worth** to advertisers (estimated from public earnings reports)

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) A free HaveIBeenPwned API key for live breach checking

---

### 1. Install dependencies

Open two terminals.

**Terminal 1 — Backend:**
```bash
cd server
npm install
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
```

---

### 2. Configure the API key (optional but recommended)

Edit `/server/.env`:

```
HIBP_API_KEY=your_key_here
PORT=3001
```

**Where to get a key:** https://haveibeenpwned.com/API/Key
- Keys cost ~$3.50/month (or free for personal use on the free tier)
- **Without a key:** The app runs in Demo Mode showing realistic sample breach data, clearly labeled in the UI

---

### 3. Start both servers

**Terminal 1 — Start the backend:**
```bash
cd server
npm run dev
```
Backend runs at: http://localhost:3001

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```
Frontend runs at: http://localhost:3000

Open your browser to **http://localhost:3000**

---

## Features

| Feature | Data Source | Honesty Label |
|---------|------------|---------------|
| Email Breach Checker | HaveIBeenPwned API v3 (real-time) | "Demo mode" shown when no API key |
| Data Broker List | EFF / FTC public records | "Cannot confirm your data is held" |
| Data Value Estimator | Meta, Alphabet, Snap, Microsoft earnings reports | "Estimated" labels + source citations |

---

## Architecture

```
datatrace/
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── components/
│       │   ├── HomePage.jsx          # Email input form
│       │   ├── BreachResults.jsx     # Breach list with severity badges
│       │   ├── DataBrokerList.jsx    # 40 brokers + opt-out tracker
│       │   ├── DataValueEstimator.jsx # Quiz + charts + animated counter
│       │   ├── SummaryBanner.jsx     # Fixed bottom bar + PDF download
│       │   └── SourceTooltip.jsx    # Reusable citation popup
│       └── data/
│           ├── brokers.js            # 40 real brokers with opt-out URLs
│           └── sources.js            # Citation strings for all estimates
└── server/          # Node.js + Express backend
    ├── index.js     # HIBP API proxy — keeps key server-side
    └── .env         # HIBP_API_KEY goes here
```

---

## Data Sources & Citations

All estimates are labeled in the UI with source citations accessible via hover tooltips.

| Data Point | Source |
|-----------|--------|
| Breach data | HaveIBeenPwned.com — Troy Hunt |
| Facebook/Instagram ARPU | Meta Q4 2023 Earnings Report |
| YouTube ARPU | Alphabet Q4 2023 Earnings Report |
| TikTok ARPU | Financial Times, 2023 estimate |
| LinkedIn ARPU | Microsoft FY2023 Annual Report |
| Twitter/X ARPU | Twitter SEC Form 10-K (pre-acquisition) |
| Snapchat ARPU | Snap Inc. Q4 2023 Earnings Report |
| Google ecosystem value | Alphabet Q4 2023 + Vanderbilt Univ. study |
| Shopper premium | McKinsey & Company, 2022 |
| Location premium | Vanderbilt University, 2018 |
| Age/income premiums | Nielsen 2023, Accenture 2021 |
| Data broker list | EFF Privacy Issues + FTC Data Broker Report |

---

## Privacy Commitment

- **No email storage:** Email addresses are proxied directly to HaveIBeenPwned and never saved
- **No database:** This app has no database — zero persistent storage server-side  
- **LocalStorage only:** Opt-out progress is stored in your browser only
- **No tracking:** No analytics, no cookies beyond what React/Vite require to run

---

## For the Presentation

- The app runs fully in **Demo Mode** without any API key — the demo will never fail
- Demo mode is clearly labeled in the UI with a yellow warning banner
- All estimated figures show (i) icons that open source citation tooltips on hover
- The PDF download includes all citations and an estimate disclaimer
