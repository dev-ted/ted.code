import { SPAN_OPTIONS } from "@/lib/admin/projects";

export const PROJECTS_PER_PAGE = 5;

export const PORTFOLIO_GRID_CLASS =
  "grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[200px]";

export const PORTFOLIO_GRID_CLASS_COMPACT =
  "grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 md:auto-rows-[120px]";

export interface GridPreviewProject {
  id: string;
  title: string;
  medium: string;
  description: string;
  span: string;
  order: number;
  contributorType: "created" | "contributed";
  isDraft?: boolean;
}

export function spanToGridClasses(span: string): string {
  return span
    .split(" ")
    .map((part) => `md:${part}`)
    .join(" ");
}

export function getSpanLabel(span: string): string {
  return SPAN_OPTIONS.find((option) => option.value === span)?.label ?? span;
}

export function sortProjectsByOrder<T extends { order: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => a.order - b.order);
}

export function getTotalPages(projectCount: number): number {
  return Math.max(1, Math.ceil(projectCount / PROJECTS_PER_PAGE));
}

export function getProjectsPage<T extends { order: number }>(
  projects: T[],
  page: number
): T[] {
  const sorted = sortProjectsByOrder(projects);
  const start = (page - 1) * PROJECTS_PER_PAGE;
  return sorted.slice(start, start + PROJECTS_PER_PAGE);
}

export function getPageForIndex(index: number): number {
  return Math.floor(index / PROJECTS_PER_PAGE) + 1;
}

export function getPageForOrder(
  projects: Array<{ order: number }>,
  order: number
): number {
  const sorted = sortProjectsByOrder(projects);
  const index = sorted.findIndex((project) => project.order === order);
  if (index === -1) {
    const insertIndex = sorted.findIndex((project) => project.order > order);
    const resolvedIndex = insertIndex === -1 ? sorted.length : insertIndex;
    return getPageForIndex(resolvedIndex);
  }
  return getPageForIndex(index);
}

export function buildProjectListWithDraft(
  projects: Array<{
    _id: string;
    title: string;
    medium: string;
    description: string;
    span: string;
    order: number;
    contributorType: "created" | "contributed";
  }>,
  draft: {
    title: string;
    medium: string;
    description: string;
    span: string;
    order: number;
    contributorType: "created" | "contributed";
  },
  editingId?: string
): GridPreviewProject[] {
  const saved = editingId
    ? projects.filter((project) => project._id !== editingId)
    : projects;

  const draftProject: GridPreviewProject = {
    id: editingId ?? "__draft__",
    title: draft.title || "Untitled project",
    medium: draft.medium || "Category",
    description: draft.description || "Project description preview",
    span: draft.span,
    order: draft.order,
    contributorType: draft.contributorType,
    isDraft: true,
  };

  const gridProjects: GridPreviewProject[] = [
    ...saved.map((project) => ({
      id: project._id,
      title: project.title,
      medium: project.medium,
      description: project.description,
      span: project.span,
      order: project.order,
      contributorType: project.contributorType,
    })),
    draftProject,
  ];

  return sortProjectsByOrder(gridProjects);
}
