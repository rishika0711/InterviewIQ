import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDifficulty, formatDomain } from "@/lib/utils";
import { format } from "date-fns";
import { History as HistoryIcon, ArrowRight } from "lucide-react";

function statusLabel(raw: string) {
  return raw.toLowerCase().replace(/_/g, " ");
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const attempts = await prisma.attempt.findMany({
    where: { userId },
    include: {
      question: {
        select: { title: true, domain: true, difficulty: true },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <HistoryIcon className="h-3.5 w-3.5" aria-hidden />
            Activity log
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            History
          </h1>
          <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
            All your past attempts and AI scores — reopen any row to revisit feedback.
          </p>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums sm:text-end">
          <span className="font-semibold text-foreground">{attempts.length}</span>
          {" "}
          {attempts.length === 1 ? "attempt" : "attempts"} total
        </p>
      </header>

      {attempts.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-muted/10 shadow-none">
          <CardContent className="py-16 text-center text-muted-foreground">
            <p className="text-sm font-medium">No attempts yet.</p>
            <p className="mt-2 text-sm">
              <Link
                href="/practice"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Start practicing
              </Link>
              {" "}
              to build your history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <Link
              key={attempt.id}
              href={`/practice/${attempt.questionId}`}
              className="group block"
            >
              <Card className="overflow-hidden border-border/70 shadow-md shadow-black/[0.04] transition-all duration-200 hover:border-primary/25 hover:bg-accent/40 hover:shadow-xl hover:shadow-primary/5">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <div className="min-w-0 space-y-1">
                    <CardTitle className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-primary lg:text-base">
                      {attempt.question.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-relaxed font-medium">
                      {formatDomain(attempt.question.domain)} ·{" "}
                      {formatDifficulty(attempt.question.difficulty)} ·{" "}
                      {format(new Date(attempt.submittedAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {attempt.aiScore !== null ? (
                      <Badge
                        className="font-bold tabular-nums"
                        variant={
                          attempt.aiScore >= 75
                            ? "easy"
                            : attempt.aiScore >= 50
                              ? "medium"
                              : "hard"
                        }
                      >
                        {attempt.aiScore}/100
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="capitalize text-[11px]">
                        {statusLabel(attempt.feedbackStatus)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-4 pb-6 pt-0">
                  <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {attempt.content}
                  </p>
                  <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
