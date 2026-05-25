import Link from "next/link";
import { redirect } from "next/navigation";
import { HistoryAttemptCard } from "@/components/history/HistoryAttemptCard";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { History as HistoryIcon } from "lucide-react";

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

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
            All your past attempts and AI scores — reopen any row to revisit
            feedback, or delete an attempt from the trash icon.
          </p>
        </div>
        <p className="text-sm text-muted-foreground tabular-nums sm:text-end">
          <span className="font-semibold text-foreground">{attempts.length}</span>{" "}
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
              </Link>{" "}
              to build your history.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <HistoryAttemptCard
              key={attempt.id}
              attemptId={attempt.id}
              questionId={attempt.questionId}
              title={attempt.question.title}
              domain={attempt.question.domain}
              difficulty={attempt.question.difficulty}
              submittedAtIso={attempt.submittedAt.toISOString()}
              contentPreview={attempt.content}
              aiScore={attempt.aiScore}
              feedbackStatus={attempt.feedbackStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
