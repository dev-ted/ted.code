import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PORTFOLIO_GRID_CLASS_COMPACT } from "@/lib/portfolio-grid";
import { cn } from "@/lib/utils";

export function ProjectLayoutSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className={cn(PORTFOLIO_GRID_CLASS_COMPACT)}>
          <Skeleton className="md:col-span-2 md:row-span-2 min-h-[120px]" />
          <Skeleton className="min-h-[120px]" />
          <Skeleton className="md:row-span-2 min-h-[120px]" />
          <Skeleton className="min-h-[120px]" />
          <Skeleton className="md:col-span-2 min-h-[120px]" />
        </div>
      </CardContent>
    </Card>
  );
}
