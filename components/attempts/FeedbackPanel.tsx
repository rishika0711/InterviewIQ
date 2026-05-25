"use client";

import { Attempt } from "@/app/generated/prisma";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function FeedbackPanel({ attempt }: { attempt: Attempt }) {
  const score = attempt.aiScore ?? 0;

  if (
    attempt.feedbackStatus === "PENDING" ||
    attempt.feedbackStatus === "PROCESSING"
  ) {
    return (
      <section className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-muted/40 to-muted/25 p-8 shadow-inner">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Evaluating your answer…
            </p>
            <div className="animate-pulse max-w-xl space-y-3">
              <div className="h-3 w-3/4 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-5/6 rounded bg-muted" />
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              This usually takes a few seconds — keep this tab open.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (attempt.feedbackStatus === "FAILED") {
    return (
      <section className="flex gap-4 rounded-2xl border border-destructive/35 bg-destructive/8 p-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/15 text-destructive">
          <AlertCircle className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-destructive">AI feedback unavailable</p>
          <p className="text-sm leading-relaxed text-destructive/90">
            Please try submitting again. If quotas or network blocked the model, wait a minute and retry.
          </p>
        </div>
      </section>
    );
  }

  const scoreColor =
    score >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const scoreBandLabel =
    score >= 75
      ? "Strong performance"
      : score >= 50
        ? "Solid — room to grow"
        : "Keep practicing";

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-black/[0.06]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 bg-gradient-to-br from-muted/35 to-transparent px-6 py-5 sm:py-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">AI feedback</h3>
              <Badge
                variant="secondary"
                className="text-[10px] font-bold uppercase tracking-wide"
              >
                {scoreBandLabel}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Objective rubric-style review of your submission.
            </p>
          </div>
        </div>
        <div className={cn("text-right tabular-nums", scoreColor)}>
          <span className="text-5xl font-bold leading-none tracking-tighter">{score}</span>
          <span className="ml-1 text-xl font-semibold text-muted-foreground">/100</span>
        </div>
      </header>

      <div className="space-y-8 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-5 dark:bg-emerald-500/[0.08]">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0" /> Strengths
            </p>
            {attempt.aiStrengths.length === 0 ? (
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                No clear strengths identified for this attempt — keep practicing the core concepts.
              </p>
            ) : (
              <ul className="list-disc space-y-2 pl-4 text-sm leading-snug text-muted-foreground marker:text-emerald-600">
                {attempt.aiStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-5 dark:bg-red-500/[0.08]">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-red-800 dark:text-red-200">
              <XCircle className="h-4 w-4 shrink-0" /> Needs improvement
            </p>
            {attempt.aiWeaknesses.length === 0 ? (
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                See suggestions and model answer for guidance.
              </p>
            ) : (
              <ul className="list-disc space-y-2 pl-4 text-sm leading-snug text-muted-foreground marker:text-red-600">
                {attempt.aiWeaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-5 dark:bg-sky-500/[0.08]">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-sky-900 dark:text-sky-100">
            <Lightbulb className="h-4 w-4 shrink-0" /> Suggestions
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{attempt.aiSuggestions}</p>
        </div>

        <details className="group rounded-xl border border-purple-500/20 bg-purple-500/[0.06] dark:bg-purple-500/[0.08]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-bold text-purple-900 transition-colors hover:bg-purple-500/[0.1] dark:text-purple-100 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
              View model answer
            </span>
            <Badge variant="outline" className="shrink-0 text-[10px]">
              Expand
            </Badge>
          </summary>
          <div className="border-t border-border/50 px-4 pb-4 pt-2">
            <p className="rounded-xl border border-border/70 bg-muted/25 p-5 text-sm leading-relaxed text-muted-foreground">
              {attempt.aiModelAnswer}
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
