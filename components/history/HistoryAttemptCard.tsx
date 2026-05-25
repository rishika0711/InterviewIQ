"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAttemptAction } from "@/app/actions/attempts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDifficulty, formatDomain } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, Loader2, Trash2, X } from "lucide-react";

function statusLabel(raw: string) {
  return raw.toLowerCase().replace(/_/g, " ");
}

export function HistoryAttemptCard({
  attemptId,
  questionId,
  title,
  domain,
  difficulty,
  submittedAtIso,
  contentPreview,
  aiScore,
  feedbackStatus,
}: {
  attemptId: string;
  questionId: string;
  title: string;
  domain: string;
  difficulty: string;
  submittedAtIso: string;
  contentPreview: string;
  aiScore: number | null;
  feedbackStatus: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setErrorMessage(null);
    try {
      const result = await deleteAttemptAction(attemptId);
      if ("error" in result) {
        setErrorMessage(result.error ?? "Could not delete attempt.");
        setDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setErrorMessage("Could not delete attempt. Please try again.");
      setDeleting(false);
    }
  }

  const href = `/practice/${questionId}`;
  const submittedAt = new Date(submittedAtIso);

  return (
    <Card className="overflow-hidden border-border/70 shadow-md shadow-black/[0.04] transition-all duration-200 hover:border-primary/25 hover:bg-accent/40 hover:shadow-xl hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <Link href={href} className="min-w-0 flex-1 space-y-1 group/link">
          <CardTitle className="text-[15px] font-semibold leading-snug transition-colors group-hover/link:text-primary lg:text-base">
            {title}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed font-medium">
            {formatDomain(domain)} · {formatDifficulty(difficulty)} ·{" "}
            {format(submittedAt, "MMM d, yyyy")}
          </CardDescription>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {!confirming ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              disabled={deleting}
              aria-label="Delete this attempt"
              onClick={(e) => {
                e.preventDefault();
                setConfirming(true);
              }}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 p-1 shadow-sm">
              <span className="px-2 text-xs font-semibold text-destructive">
                Delete?
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="h-7 rounded-lg px-2.5 text-xs"
                disabled={deleting}
                onClick={(e) => {
                  e.preventDefault();
                  void handleDelete();
                }}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" aria-hidden />
                    Deleting
                  </>
                ) : (
                  "Yes"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground"
                disabled={deleting}
                aria-label="Cancel delete"
                onClick={(e) => {
                  e.preventDefault();
                  setConfirming(false);
                  setErrorMessage(null);
                }}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          )}
          {aiScore !== null ? (
            <Badge
              className="font-bold tabular-nums"
              variant={
                aiScore >= 75 ? "easy" : aiScore >= 50 ? "medium" : "hard"
              }
            >
              {aiScore}/100
            </Badge>
          ) : (
            <Badge variant="outline" className="capitalize text-[11px]">
              {statusLabel(feedbackStatus)}
            </Badge>
          )}
        </div>
      </CardHeader>

      {errorMessage && (
        <div className="mx-6 mb-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
          {errorMessage}
        </div>
      )}

      <Link href={href} className="group/block block">
        <CardContent className="flex items-end justify-between gap-4 pb-6 pt-0">
          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {contentPreview}
          </p>
          <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover/block:translate-x-0.5 sm:inline-flex">
            Open
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
