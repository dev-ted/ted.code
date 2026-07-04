"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectsTable } from "@/components/admin/projects-table";
import { ProjectLayoutSkeleton } from "@/components/admin/project-layout-skeleton";

export default function AdminProjectsPage() {
  const projects = useQuery(api.projects.getAll);

  if (projects === undefined) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <ProjectLayoutSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <ProjectsTable projects={projects} />
    </div>
  );
}
