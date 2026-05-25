# Google Stitch — InterviewIQ UI prompts

Copy each block into Stitch to generate HTML/Tailwind. Export **Tailwind/HTML** when possible.

## Shared design tokens (paste into every prompt)

```
Product: InterviewIQ — AI-powered developer interview prep.
Brand: Primary accent hsl(262 83% 58%) purple; rounded corners 0.625rem (--radius-lg feel).
Typography: Geist Sans / system sans; crisp hierarchy (display → body → muted).
Framework vibe: shadcn/ui — Card, Button, Input, Label, Badge, Select; subtle borders, soft shadows.
Modes: Light default + optional dark using muted slate backgrounds (respect prefers-color-scheme patterns).
Breakpoints to preview: 375 mobile, 768 tablet, 1280 desktop.
Accessibility: AA contrast, visible focus rings, sensible tap targets (44px min).
Do not invent fake logos beyond a simple Brain/book icon placeholder.
```

---

## Prompt A — Auth (Login)

```
Design LOGIN screen only.

Layout: Full viewport centered; subtle radial gradient mesh behind card (purple/indigo tint at ~8% opacity).
Header above card: Brain icon + wordmark "InterviewIQ"; subtitle "AI-powered interview prep for developers".

Card:
- Title "Sign in"; description "Enter your credentials or continue with Google".
- Primary outline button full width: "Continue with Google" (Google G icon left).
- Divider row with "Or".
- Form: Email (email input), Password (masked), primary filled button "Sign in".
- Footer line: "Don't have an account? Register" (Register is link styled primary).

States: Show disabled/loading state on Google button as optional variant.
Empty/error: small red helper text under form for "Invalid email or password".
```

## Prompt B — Auth (Register)

```
Design REGISTER screen mirroring Login.

Card title "Register"; description "Start practicing with AI-powered feedback".
Same Google button + divider + OR flow.
Form fields: Name (text), Email, Password (min 8 hint under field).
Primary button "Create account".
Footer "Already have an account? Sign in".

Optional: chip row "Password must be 8+ characters" as helper text.
```

---

## Prompt C — App shell + Dashboard

```
Design DESKTOP layout: left fixed sidebar ~256px; main content fluid; optional thin footer.

Sidebar:
- Logo row: icon + "InterviewIQ"
- Nav: Dashboard (Layout icon), Practice (pen), History (clock) — active item with soft primary bg + primary text
- Bottom: ghost "Sign out" with logout icon

Dashboard main:
- Page heading "Welcome back, {firstName}" + muted subline "Track your interview prep progress"
- Row of 3 STAT CARDS: Total Attempts (number + book icon), Average Score (xx/100 + target icon), This Week (number + trending icon)
- Wide CARD "Score Progress" / subtitle "Your last 15 completed attempts" — empty state line "Complete at least 2 attempts to see your progress chart" OR placeholder line chart area min height 200px
- CARD "Recent Attempts" / list rows: title, line "Domain · Difficulty", trailing pill score "72/100" or status "PENDING"; empty state with CTA "Start practicing"

Use generous spacing (space-y-8), max content width ~1152px in main.
Mobile: collapse sidebar to top bar + hamburger drawer (show wireframe note only if single frame).
```

---

## Prompt D — Practice (question list + filters)

```
Practice page:

- H1 "Practice" + muted subtitle "Browse interview questions by domain and difficulty"
- Filter row: Domain select (trigger ~200px), Difficulty select (~180px); side by side on md+
- Responsive GRID of question cards (1 col mobile, 2 sm, 3 lg). Each card:
  - Title 2 lines clamp
  - Top-right difficulty pill (Easy green tint, Medium amber, Hard rose)
  - Muted domain subtitle
  - Tag chips row (outline style)

Pagination centered: "Previous" outline, "Page 2 of 5" muted, "Next" outline.

Empty state: "No questions match your filters."
```

---

## Prompt E — Question detail + AI feedback

```
Single question page max width ~768–896px.

Top: ghost back link "< Back to questions".
Hero: row of badges Domain, Difficulty (color coded), then outline tag chips.
Title H1; description body in relaxed line height.

Section "Your Answer":
- Large textarea placeholder "Write your answer here (minimum 50 characters)..."
- Primary button "Submit for AI Feedback"

Below (after submit — show as separate artboard or toggled state):

AI FEEDBACK CARD:
- Header "AI Feedback" + huge score "78/100" (color by band: green ≥75, yellow ≥50, red otherwise)
- Sections with small colored labels: Strengths (green bullet list), Needs improvement (red), Suggestions (blue paragraph)
- Collapsible "View Model Answer" disclosure with body text.

LOADING STATE artboard: soft pulse skeleton card "AI is evaluating your answer..."
FAILED STATE: destructive tinted card "AI feedback failed. Please try submitting again."

Preserved enums in copy only: feedbackStatus PENDING | PROCESSING | COMPLETED | FAILED.
```

---

## Prompt F — History

```
History list page (same shell as Dashboard).

Heading "History" + subtitle "All your past attempts and AI feedback".

If empty: single card centered text "No attempts yet. Start practicing" (link styled).

Otherwise vertical stack of tappable cards:
- Title
- subtitle line "Domain · Difficulty · Jan 15, 2026"
- trailing score badge same color logic as dashboard
- body: answer preview two lines ellipsis muted

Hover: slight shadow lift on card.
```

---

## Export checklist for dev handoff

After generating in Stitch:

1. Export **HTML + Tailwind** (or Tailwind classes in HTML).
2. Note any custom hex codes — prefer mapping to semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `text-primary`).
3. Keep component boundaries matching: `Sidebar`, `Card`, `Badge`, `Button`, `FeedbackPanel` states.
