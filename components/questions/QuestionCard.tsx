import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDifficulty, formatDomain } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type QuestionCardProps = {
  question: {
    id: string;
    title: string;
    difficulty: string;
    domain: string;
    tags: string[];
    _count?: { attempts: number };
  };
};

const difficultyVariant = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Link href={`/practice/${question.id}`} className="group block h-full outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <Card className="h-full rounded-2xl border-border/70 bg-card/80 backdrop-blur-sm shadow-md shadow-black/[0.04] overflow-hidden transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 group-hover:-translate-y-0.5">
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-[15px] font-semibold leading-snug line-clamp-2 pr-1 group-hover:text-primary transition-colors">
              {question.title}
            </CardTitle>
            <Badge
              className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 shadow-none"
              variant={
                difficultyVariant[
                  question.difficulty as keyof typeof difficultyVariant
                ] ?? "secondary"
              }
            >
              {formatDifficulty(question.difficulty)}
            </Badge>
          </div>
          <CardDescription className="text-xs font-medium text-muted-foreground pt-2">
            {formatDomain(question.domain)}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {question.tags.slice(0, 6).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] font-normal px-2 py-0 border-border/80 bg-muted/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4 border-t border-border/50 bg-muted/15 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="font-medium tabular-nums">
            {question._count?.attempts ?? 0} attempt
            {(question._count?.attempts ?? 0) !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-0.5 font-semibold text-primary opacity-90 group-hover:opacity-100">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
