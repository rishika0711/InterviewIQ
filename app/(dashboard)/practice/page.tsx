import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Domain, Difficulty } from "@/app/generated/prisma";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

type SearchParams = Promise<{
  domain?: string;
  difficulty?: string;
  page?: string;
}>;

function buildPracticeSearchParams(
  domain: string | undefined,
  difficulty: string | undefined,
  pageNum: number
) {
  return new URLSearchParams({
    ...(domain && { domain }),
    ...(difficulty && { difficulty }),
    page: String(pageNum),
  }).toString();
}

export default async function PracticePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const domain = params.domain;
  const difficulty = params.difficulty;
  const page = parseInt(params.page || "1");
  const limit = 12;

  const where = {
    ...(domain && { domain: domain as Domain }),
    ...(difficulty && { difficulty: difficulty as Difficulty }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        difficulty: true,
        domain: true,
        tags: true,
        _count: { select: { attempts: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Question bank
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
            Practice
          </h1>
          <p className="text-muted-foreground text-[15px] max-w-xl leading-relaxed">
            Browse interview questions by domain and difficulty — open a card to
            submit your answer for AI feedback.
          </p>
        </div>
        <p className="text-sm text-muted-foreground sm:text-end tabular-nums">
          <span className="font-semibold text-foreground">{total}</span> question
          {total !== 1 ? "s" : ""} match your filters
        </p>
      </header>

      <Card className="border-border/70 shadow-md shadow-black/[0.04] overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/60 bg-muted/20">
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription className="text-[13px]">
            Narrow by domain or difficulty — results update on this page only.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <Suspense
            fallback={
              <Skeleton className="h-24 w-full max-w-xl rounded-xl" />
            }
          >
            <QuestionFilters />
          </Suspense>
        </CardContent>
      </Card>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/15 px-6 py-14 text-center">
          <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto">
            No questions match your filters.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Reset domain or difficulty in the filters above.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pt-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {page > 1 && (
              <Button variant="outline" className="rounded-xl h-11 px-5" asChild>
                <Link
                  href={`/practice?${buildPracticeSearchParams(domain, difficulty, page - 1)}`}
                >
                  Previous
                </Link>
              </Button>
            )}
            <span className="text-sm font-medium tabular-nums text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Button variant="outline" className="rounded-xl h-11 px-5" asChild>
                <Link
                  href={`/practice?${buildPracticeSearchParams(domain, difficulty, page + 1)}`}
                >
                  Next
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
