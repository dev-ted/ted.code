"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectStats, Project } from "@/lib/admin/projects";

interface DashboardStatsProps {
  projects: Project[];
}

export function DashboardStats({ projects }: DashboardStatsProps) {
  const stats = getProjectStats(projects);

  const items = [
    {
      label: "Total projects",
      value: stats.total.toString(),
      hint: "Across your portfolio",
    },
    {
      label: "Created",
      value: stats.created.toString(),
      hint: "Projects you built",
    },
    {
      label: "Contributed",
      value: stats.contributed.toString(),
      hint: "Projects you helped on",
    },
    {
      label: "Last updated",
      value: stats.latestUpdated
        ? format(stats.latestUpdated.updatedAt, "MMM d, yyyy")
        : "—",
      hint: stats.latestUpdated?.title ?? "No updates yet",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-2xl font-semibold tracking-tight">
              {item.value}
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
