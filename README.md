# InterviewIQ

AI-powered interview prep platform for developers. Browse questions by domain, write answers, and get instant AI feedback with scores, strengths, weaknesses, and model answers.

## Features

- **Auth** — Email/password registration + Google OAuth (NextAuth v5)
- **Practice** — 32 seeded questions across 8 domains with difficulty filters
- **AI Feedback** — Gemini 2.5 Flash evaluation via Vercel AI SDK
- **Dashboard** — Stats, progress chart (Recharts), recent attempts
- **History** — Full attempt history with scores
- **Server Actions** — Answer submission and AI feedback via server actions

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- MongoDB (Atlas) + Prisma 6
- NextAuth.js v5
- Vercel AI SDK + Google Gemini 2.5 Flash
- Tailwind CSS + shadcn/ui
- GitHub Actions CI

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

## Project Structure

```
app/
├── (auth)/login, register
├── (dashboard)/dashboard, practice, history
├── actions/          # Server actions (auth, attempts)
└── api/              # REST API routes
components/
├── ui/               # shadcn/ui components
├── questions/        # QuestionCard, QuestionFilters
├── attempts/         # AnswerForm, FeedbackPanel
└── dashboard/        # StatsRow, ScoreChart
lib/                  # prisma, auth, ai, validations
prisma/               # schema + seed (32 questions)
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Deploy — `postinstall` runs `prisma generate` automatically
5. Run `npm run db:push && npm run db:seed` against production DB

## CI

GitHub Actions runs on push/PR to `main`:

- `npm ci`
- `prisma generate`
- `eslint`
- `tsc --noEmit`
- `next build`

Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and `GOOGLE_AI_API_KEY` as GitHub secrets.

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

## License

MIT
