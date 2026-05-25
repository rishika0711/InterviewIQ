import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PracticeLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-7 w-32 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-md rounded-lg" />
        <Skeleton className="h-4 w-44 rounded-lg" />
      </div>
      <Card className="border-border/70 overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4 space-y-2">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-3 w-72 rounded-lg" />
        </div>
        <div className="p-6">
          <Skeleton className="h-24 max-w-xl rounded-xl" />
        </div>
      </Card>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
