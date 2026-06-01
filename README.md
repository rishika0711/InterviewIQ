# InterviewIQ

# Notes
- For transcription features, please use Google Chrome.
- Transcription support is recommended in Chrome.
  
**InterviewIQ** is an AI-powered interview prep platform for developers. Practice real technical and behavioral questions, submit written answers, and get instant structured feedback — scores, strengths, gaps, suggestions, and model answers — so you can improve faster without waiting for a mock interviewer.

Built as a full-stack Next.js application with authentication, progress tracking, and Gemini-powered evaluation.

---

## What You Get

| For you | What InterviewIQ does |
|---|---|
| **Practice on demand** | Browse 41 curated questions across 8 domains — no scheduling, no partner required |
| **Honest feedback** | AI evaluates your answer like a senior engineer: score out of 100, specific strengths and weaknesses |
| **Learn from gaps** | Actionable suggestions plus an expandable model answer for every attempt |
| **Track improvement** | Dashboard stats, score trend chart, and full attempt history |
| **Flexible input** | Type or **dictate** your answer with browser speech recognition (Chrome / Edge) |
| **Your pace** | Filter by domain and difficulty, retry questions, and revisit past feedback anytime |

---

## Features

### Practice & AI feedback
- **Question bank** — 41 seeded questions across JavaScript, React, Node.js, TypeScript, System Design, Behavioral, Data Structures, and Databases
- **Smart filters** — Filter by domain and difficulty (Easy / Medium / Hard) with paginated browsing
- **Answer submission** — Write up to 3,000 characters; your submitted text stays visible while feedback loads
- **Voice dictation** — Web Speech API integration for hands-free answering (Chromium browsers)
- **Structured AI review** — Powered by **Google Gemini 2.5 Flash** via Vercel AI SDK:
  - Score (0–100) with performance band
  - Strengths and areas to improve
  - Personalized suggestions
  - Expandable model answer (150–250 words)

### Progress & history
- **Dashboard** — Total attempts, average score, attempts this week, and a score progress chart (last 15 completed attempts with hover tooltips)
- **Recent attempts** — Quick links back to questions you have already practiced
- **History** — Full activity log with scores, status badges, answer previews, inline delete confirmation, and one-click reopen

### Account & UX
- **Authentication** — Email/password registration and **Google OAuth** (NextAuth v5)
- **Protected routes** — Unauthorized users are redirected to login instead of seeing broken pages
- **Profile** — Update display name
- **Theme toggle** — Light and dark mode across the app
- **Loading states** — Skeletons and spinners on practice filters, login/register, and feedback generation

### Developer experience
- **Server Actions** — Answer submission, AI feedback, profile updates, and attempt deletion
- **REST API** — Questions and attempts endpoints for programmatic access
- **Validation** — Zod schemas on all user input
- **CI** — GitHub Actions runs lint, typecheck, and production build on every push/PR

---

## Why This Project?

**For job seekers and students**
- Simulate interview pressure by writing full answers, not just reading flashcards
- Get immediate, repeatable feedback — practice the same question multiple times and compare scores
- Cover technical *and* behavioral rounds in one tool
- See whether you are improving week over week

**For developers learning the stack**
- Production-style patterns: App Router, Server Actions, Prisma + MongoDB, NextAuth, AI SDK structured output
- Real auth flows (credentials + OAuth), protected layouts, and optimistic UI patterns
- Deployable to Vercel with Atlas MongoDB and Gemini API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | MongoDB Atlas + Prisma 6 |
| Auth | NextAuth.js v5 (credentials + Google) |
| AI | Vercel AI SDK + Google Gemini 2.5 Flash |
| UI | Tailwind CSS 4, shadcn/ui, Recharts, Lucide icons |
| Themes | next-themes (light / dark) |
| Validation | Zod 4 |
| CI | GitHub Actions |

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo>
cd interviewiq
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string (`mongodb+srv://...`) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_AI_API_KEY` | Gemini API key from AI Studio |

For `DATABASE_URL`, use the Atlas **Drivers** URI verbatim. If you edit it by hand and the DB password contains `@`, `:`, `/`, `?`, `#`, or `]`, those characters **must be percent-encoded** or the connector will mis-parse the URI and TLS can fail in confusing ways.

### 3. Database setup

```bash
npm run db:push
npm run db:seed
```

This seeds **41 interview questions** across all 8 domains.

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo credentials (testing)

A demo account is available so reviewers can skip registration:

| Email | Password |
|---|---|
| `demo@gmail.com` | `demo1234` |

Sign in at `/login` with these credentials. Replace or remove this account on production deployments — it is intended for local testing only.

### Google sign-in setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Add **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`
4. Copy **Client ID** and **Client secret** into `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
5. Restart `npm run dev`. The **Continue with Google** button appears when both values are set.
6. Open the app at **`http://localhost:3000`** (not the network IP) so OAuth cookies match.
7. Click **Continue with Google** once — wait for the redirect (don't double-click).

---

## Project Structure

```
app/
├── (auth)/login, register       # Auth pages + forms
├── (dashboard)/                 # Protected app shell
│   ├── dashboard/               # Stats, chart, recent attempts
│   ├── practice/                # Question list + filters
│   ├── practice/[id]/           # Question detail + answer form
│   ├── history/                 # Full attempt history
│   └── profile/                 # Profile settings
├── actions/                     # Server actions (auth, attempts, profile)
└── api/                         # REST routes (questions, attempts, AI)
components/
├── ui/                          # shadcn/ui primitives
├── questions/                   # QuestionCard, QuestionFilters
├── attempts/                    # AnswerForm, FeedbackPanel
├── dashboard/                   # StatsRow, ScoreChart
├── history/                     # HistoryAttemptCard
└── layout/                      # Sidebar, Footer, ThemeToggle
hooks/
└── useSpeechRecognition.ts      # Browser dictation hook
lib/                             # prisma, auth, ai, validations
prisma/                          # schema + seed (41 questions)
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy — `postinstall` runs `prisma generate` automatically
5. Run `npm run db:push && npm run db:seed` against production DB

---

## CI

GitHub Actions runs on push/PR to `main`:

- `npm ci`
- `prisma generate`
- `eslint`
- `tsc --noEmit`
- `next build`

Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and `GOOGLE_AI_API_KEY` as GitHub secrets.

---

## Troubleshooting: MongoDB / Prisma Atlas errors

If you see **server selection timeout** with **`received fatal alert: InternalError`** on every shard host, the client is failing **during TLS** before MongoDB responds normally. Typical causes:

1. **Incorrect connection string / password encoding** — The most common fix is replacing the plaintext password with a **URL-encoded** version in `DATABASE_URL`. Re-copy the string from Atlas **Database → Connect → Drivers**, or encode special characters manually.
2. **VPN, corporate firewall, or “security” proxies** — They often intercept TLS and break Atlas handshakes. Try **disconnecting the VPN**, another network, or split tunnel so `*.mongodb.net:27017` is not inspected.
3. **Atlas cluster paused** — **Free-tier** clusters pause after inactivity. In Atlas, **Resume** the cluster and wait until it is green.
4. **Network Access** — In Atlas **Security → Network Access**, allow your machine’s IP (or `0.0.0.0/0` only for temporary local debugging).

Run a TLS + DNS check (never prints passwords):

```bash
npm run atlas:check
```

After changing `.env.local`, restart `npm run dev` and verify Prisma with:

```bash
npx dotenv -e .env.local -- npx prisma db push --skip-generate
```

If that command succeeds, Prisma queries (e.g. `attempt.findMany`) should work too.

---

## License

MIT
