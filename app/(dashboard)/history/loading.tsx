import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HistoryLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-7 w-36 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-lg rounded-lg" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/70 overflow-hidden p-0">
            <div className="p-6 space-y-3">
              <div className="flex justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-[85%] rounded-lg" />
                  <Skeleton className="h-3 w-2/3 rounded-lg" />
                </div>
                <Skeleton className="h-6 w-14 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
