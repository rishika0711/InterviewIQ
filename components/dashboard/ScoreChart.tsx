"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

type Props = {
  data: { submittedAt: Date; aiScore: number | null }[];
};

export function ScoreChart({ data }: Props) {
  const chartData = data
    .filter((a) => a.aiScore !== null)
    .slice(-15)
    .map((a, i) => ({
      attempt: i + 1,
      score: a.aiScore,
      date: format(new Date(a.submittedAt), "MMM d"),
    }));

  if (chartData.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/15 py-14 px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground max-w-sm">
          Complete at least 2 scored attempts to see your progress curve.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-muted/10 p-2 sm:p-4 -mx-1">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/70" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--card))",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.08)",
            }}
            formatter={(val) => [`${val}/100`, "Score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{
              r: 4,
              fill: "hsl(var(--background))",
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
