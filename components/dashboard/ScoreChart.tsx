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

type TooltipPayload = { value: number; payload: { date: string; attempt: number } };

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const score = typeof item.value === "number" ? Math.round(item.value) : item.value;
  const scoreColor =
    typeof score === "number"
      ? score >= 75
        ? "text-emerald-600 dark:text-emerald-400"
        : score >= 50
          ? "text-amber-600 dark:text-amber-400"
          : "text-red-600 dark:text-red-400"
      : "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Attempt {item.payload.attempt} · {item.payload.date}
      </p>
      <p className={`mt-0.5 text-base font-bold tabular-nums ${scoreColor}`}>
        {score}
        <span className="ml-0.5 text-xs text-muted-foreground">/100</span>
      </p>
    </div>
  );
}

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
        <LineChart data={chartData} margin={{ top: 12, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/70" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "currentColor", strokeOpacity: 0.18, strokeDasharray: "4 4" }}
            wrapperStyle={{ outline: "none" }}
            content={<ChartTooltip />}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="currentColor"
            className="text-primary"
            strokeWidth={2.5}
            dot={{
              r: 4,
              className: "fill-background",
              stroke: "currentColor",
              strokeWidth: 2,
            }}
            activeDot={{ r: 6, strokeWidth: 2, className: "fill-primary stroke-background" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
