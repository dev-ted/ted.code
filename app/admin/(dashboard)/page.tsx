"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { ProjectsPreview } from "@/components/admin/projects-preview";

export default function AdminDashboardPage() {
  const projects = useQuery(api.projects.getAll);

  if (projects === undefined) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your portfolio content and recent project activity.
        </p>
      </div>
      <DashboardStats projects={projects} />
      <ProjectsPreview projects={projects} />
    </div>
  );
}
