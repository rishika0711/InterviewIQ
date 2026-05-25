import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnswerForm } from "@/components/attempts/AnswerForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDifficulty, formatDomain } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) notFound();

  const latestAttempt = session?.user?.id
    ? await prisma.attempt.findFirst({
        where: { questionId: id, userId: session.user.id },
        orderBy: { submittedAt: "desc" },
      })
    : null;

  return (
    <div className="max-w-3xl space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 -ml-2 h-10 text-muted-foreground hover:text-foreground rounded-xl"
        asChild
      >
        <Link href="/practice">
          <ArrowLeft className="h-4 w-4" />
          Back to questions
        </Link>
      </Button>

      <Card className="overflow-hidden border-border/70 shadow-lg shadow-black/[0.04]">
        <CardHeader className="space-y-4 pb-4 border-b border-border/60 bg-muted/15">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-medium px-3">
              {formatDomain(question.domain)}
            </Badge>
            <Badge
              className="font-semibold px-3"
              variant={
                question.difficulty === "EASY"
                  ? "easy"
                  : question.difficulty === "MEDIUM"
                    ? "medium"
                    : "hard"
              }
            >
              {formatDifficulty(question.difficulty)}
            </Badge>
            {question.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-background/50">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance leading-tight">
              {question.title}
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {question.description}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight">Your answer</h2>
          </div>
          <Separator className="mb-8 opacity-60" />
          <AnswerForm questionId={question.id} existingAttempt={latestAttempt} />
        </CardContent>
      </Card>
    </div>
  );
}
