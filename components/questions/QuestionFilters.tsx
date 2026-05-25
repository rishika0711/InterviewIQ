"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDifficulty, formatDomain } from "@/lib/utils";

const DOMAINS = [
  "JAVASCRIPT",
  "REACT",
  "NODEJS",
  "TYPESCRIPT",
  "SYSTEM_DESIGN",
  "BEHAVIORAL",
  "DATA_STRUCTURES",
  "DATABASES",
] as const;

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

export function QuestionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/practice?${params.toString()}`);
    });
  }

  const domainActive = searchParams.get("domain");
  const diffActive = searchParams.get("difficulty");

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
      aria-busy={isPending || undefined}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground shrink-0">
        {isPending ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
        ) : (
          <Filter className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        )}
        <span className="hidden sm:inline">
          {isPending ? "Loading…" : "Refine results"}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:flex-1 sm:justify-end">
        <Select
          value={domainActive ?? "all"}
          onValueChange={(v) => updateFilter("domain", v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[min(240px,100%)] h-11 rounded-xl border-border/80 bg-background/80 shadow-sm">
            <SelectValue placeholder="Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {DOMAINS.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {formatDomain(domain)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={diffActive ?? "all"}
          onValueChange={(v) => updateFilter("difficulty", v)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full sm:w-[min(200px,100%)] h-11 rounded-xl border-border/80 bg-background/80 shadow-sm">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            {DIFFICULTIES.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {formatDifficulty(difficulty)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
