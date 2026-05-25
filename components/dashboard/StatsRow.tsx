import { BookOpen, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsRowProps = {
  totalAttempts: number;
  avgScore: number | null;
  attemptsThisWeek: number;
};

export function StatsRow({
  totalAttempts,
  avgScore,
  attemptsThisWeek,
}: StatsRowProps) {
  const stats = [
    {
      label: "Total Attempts",
      value: totalAttempts.toString(),
      icon: BookOpen,
      footer: "All practice sessions",
    },
    {
      label: "Average Score",
      value: avgScore !== null ? `${Math.round(avgScore)}/100` : "—",
      icon: Target,
      footer: avgScore !== null ? "Across completed attempts" : "Finish feedback to unlock",
    },
    {
      label: "This Week",
      value: attemptsThisWeek.toString(),
      icon: TrendingUp,
      footer: "Attempts since Monday",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="relative overflow-hidden border-border/70 shadow-md shadow-black/[0.04] hover:shadow-lg transition-shadow"
        >
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/[0.07]" aria-hidden />
          <CardHeader className="relative flex flex-row items-start justify-between gap-4 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </CardTitle>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/10">
              <stat.icon className="h-[18px] w-[18px]" />
            </span>
          </CardHeader>
          <CardContent className="relative pb-5">
            <p className={cn("text-3xl font-bold tracking-tight tabular-nums", stat.label === "Average Score" && avgScore !== null ? "text-foreground" : "")}>
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground leading-snug">{stat.footer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
