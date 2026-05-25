import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDifficulty, formatDomain } from "@/lib/utils";
import { startOfWeek } from "date-fns";
import { ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const attempts = await prisma.attempt.findMany({
    where: { userId },
    include: {
      question: { select: { title: true, domain: true, difficulty: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  const completedAttempts = attempts.filter((a) => a.aiScore !== null);
  const avgScore =
    completedAttempts.length > 0
      ? completedAttempts.reduce((sum, a) => sum + (a.aiScore ?? 0), 0) /
        completedAttempts.length
      : null;

  const weekStart = startOfWeek(new Date());
  const attemptsThisWeek = attempts.filter(
    (a) => new Date(a.submittedAt) >= weekStart
  ).length;

  const recentAttempts = attempts.slice(0, 5);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Welcome back
            {session?.user?.name
              ? `, ${session.user.name.split(" ")[0]}`
              : ""}
          </h1>
          <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
            Track interview prep momentum, scores, and your latest practice attempts.
          </p>
        </div>
        <Link
          href="/practice"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
        >
          Start practicing
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <StatsRow
        totalAttempts={attempts.length}
        avgScore={avgScore}
        attemptsThisWeek={attemptsThisWeek}
      />

      <Card className="overflow-hidden border-border/70 shadow-md shadow-black/[0.04]">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
          <CardTitle className="text-lg">Score progress</CardTitle>
          <CardDescription className="text-[13px]">
            Trend from your last 15 completed attempts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          <ScoreChart
            data={attempts.map((a) => ({
              submittedAt: a.submittedAt,
              aiScore: a.aiScore,
            }))}
          />
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-md shadow-black/[0.04]">
        <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-lg">Recent attempts</CardTitle>
            <CardDescription className="text-[13px]">
              Latest practice sessions
            </CardDescription>
          </div>
          <Link
            href="/history"
            className="text-sm font-medium text-primary hover:underline shrink-0 underline-offset-4"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          {recentAttempts.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/70 px-4 py-10 text-center">
              No attempts yet.{" "}
              <Link href="/practice" className="font-medium text-primary hover:underline">
                Start practicing
              </Link>
            </p>
          ) : (
            <div className="space-y-2">
              {recentAttempts.map((attempt) => (
                <Link
                  key={attempt.id}
                  href={`/practice/${attempt.questionId}`}
                  className="flex items-start sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/80 px-4 py-3.5 hover:border-primary/25 hover:bg-accent/40 hover:shadow-sm transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[15px] leading-snug text-foreground group-hover:text-primary transition-colors truncate sm:truncate-none">
                      {attempt.question.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDomain(attempt.question.domain)} ·{" "}
                      {formatDifficulty(attempt.question.difficulty)}
                    </p>
                  </div>
                  {attempt.aiScore !== null ? (
                    <Badge className="shrink-0 text-xs font-semibold tabular-nums px-3 py-1 bg-primary/12 text-primary border border-primary/20 hover:bg-primary/15">
                      {attempt.aiScore}/100
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 text-xs capitalize">
                      {attempt.feedbackStatus.toLowerCase().replace("_", " ")}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
