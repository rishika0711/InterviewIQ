import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function QuestionLoading() {
  return (
    <div className="max-w-3xl space-y-8">
      <Skeleton className="h-10 w-40 rounded-xl" />
      <Card className="overflow-hidden border-border/70">
        <div className="space-y-4 border-b border-border/60 bg-muted/15 p-6">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
        <div className="p-8 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
          <Skeleton className="h-11 w-full max-w-xs rounded-xl" />
        </div>
      </Card>
    </div>
  );
}
