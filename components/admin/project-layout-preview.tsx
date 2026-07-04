"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import {
  buildProjectListWithDraft,
  getPageForOrder,
  getProjectsPage,
  getSpanLabel,
  getTotalPages,
  type GridPreviewProject,
} from "@/lib/portfolio-grid";
import { SPAN_OPTIONS, type Project, type ProjectFormData } from "@/lib/admin/projects";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectLayoutPreviewProps {
  projects: Project[];
  mode?: "page" | "dialog";
  formData?: ProjectFormData;
  editingId?: string;
  highlightProjectId?: string;
  editable?: boolean;
  compact?: boolean;
  onProjectClick?: (projectId: string) => void;
  onSpanChange?: (projectId: string, span: string) => void;
}

function toGridProjects(projects: Project[]): GridPreviewProject[] {
  return projects.map((project) => ({
    id: project._id,
    title: project.title,
    medium: project.medium,
    description: project.description,
    span: project.span,
    order: project.order,
    contributorType: project.contributorType,
  }));
}

export function ProjectLayoutPreview({
  projects,
  mode = "page",
  formData,
  editingId,
  highlightProjectId,
  editable = false,
  compact = mode === "dialog",
  onProjectClick,
  onSpanChange,
}: ProjectLayoutPreviewProps) {
  const allGridProjects = useMemo(() => {
    if (mode === "dialog" && formData) {
      return buildProjectListWithDraft(projects, formData, editingId);
    }
    return toGridProjects(projects);
  }, [mode, projects, formData, editingId]);

  const initialPage = useMemo(() => {
    if (mode === "dialog" && formData) {
      return getPageForOrder(allGridProjects, formData.order);
    }
    return 1;
  }, [mode, formData, allGridProjects]);

  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const totalPages = getTotalPages(allGridProjects.length);
  const pageProjects = getProjectsPage(allGridProjects, page);
  const startIndex = (page - 1) * 5;

  const resolvedHighlightId =
    highlightProjectId ??
    (mode === "dialog" && formData ? (editingId ?? "__draft__") : undefined);

  const ghostIds = useMemo(() => {
    if (mode !== "dialog" || !formData) {
      return undefined;
    }
    const draftId = editingId ?? "__draft__";
    return new Set(
      pageProjects
        .filter((project) => project.id !== draftId)
        .map((project) => project.id)
    );
  }, [mode, formData, editingId, pageProjects]);

  if (projects.length === 0 && mode === "page") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio layout</CardTitle>
          <CardDescription>
            Add a project to see how it will appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Portfolio layout</CardTitle>
            <CardDescription>
              Matches the Work section on your public site. Five projects per page.
            </CardDescription>
          </div>
          {totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="min-w-16 text-center font-mono text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {SPAN_OPTIONS.map((option) => (
            <span
              key={option.value}
              className="rounded-md border border-border/60 px-2 py-1 font-mono text-[10px] text-muted-foreground"
            >
              {getSpanLabel(option.value)}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <PortfolioGrid
          projects={pageProjects}
          startIndex={startIndex}
          highlightProjectId={resolvedHighlightId}
          editable={editable}
          compact={compact}
          ghostIds={ghostIds}
          onProjectClick={onProjectClick}
          onSpanChange={onSpanChange}
        />
      </CardContent>
    </Card>
  );
}
