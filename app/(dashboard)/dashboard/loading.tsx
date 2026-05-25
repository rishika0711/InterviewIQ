import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-9 w-[min(420px,100%)] max-w-xl rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/70 p-0">
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-full max-w-[6rem] rounded-lg" />
            </div>
          </Card>
        ))}
      </div>
      <Card className="border-border/70 overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4 space-y-2">
          <Skeleton className="h-5 w-40 rounded-lg" />
          <Skeleton className="h-3 w-52 rounded-lg" />
        </div>
        <div className="p-6">
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </Card>
      <Card className="border-border/70 overflow-hidden">
        <div className="border-b bg-muted/20 px-6 py-4 space-y-2">
          <Skeleton className="h-5 w-44 rounded-lg" />
          <Skeleton className="h-3 w-56 rounded-lg" />
        </div>
        <div className="p-6 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
