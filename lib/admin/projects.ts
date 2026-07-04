import { Doc } from "@/convex/_generated/dataModel";

export interface ProjectFormData {
  title: string;
  medium: string;
  description: string;
  link?: string;
  githubLink?: string;
  span: string;
  order: number;
  contributorType: "created" | "contributed";
}

export const SPAN_OPTIONS = [
  { value: "col-span-1 row-span-1", label: "Small (1x1)" },
  { value: "col-span-2 row-span-1", label: "Wide (2x1)" },
  { value: "col-span-1 row-span-2", label: "Tall (1x2)" },
  { value: "col-span-2 row-span-2", label: "Large (2x2)" },
] as const;

export const MEDIUM_OPTIONS = [
  { value: "Components library", label: "Components library" },
  { value: "Web application", label: "Web application" },
  { value: "Mobile application", label: "Mobile application" },
  { value: "Design system", label: "Design system" },
  { value: "Developer tools", label: "Developer tools" },
  { value: "Open source", label: "Open source" },
  { value: "API / Backend", label: "API / Backend" },
  { value: "Experiment", label: "Experiment" },
] as const;

export function getMediumOptions(currentValue?: string) {
  if (!currentValue || MEDIUM_OPTIONS.some((option) => option.value === currentValue)) {
    return MEDIUM_OPTIONS;
  }

  return [{ value: currentValue, label: currentValue }, ...MEDIUM_OPTIONS];
}

export type Project = Doc<"projects">;

export type ProjectTableFilters = {
  search: string;
  status: "all" | "published" | "draft";
  contributorType: "all" | "created" | "contributed";
};

export const DEFAULT_PROJECT_TABLE_FILTERS: ProjectTableFilters = {
  search: "",
  status: "all",
  contributorType: "all",
};

export function isProjectPublished(project: Project): boolean {
  return project.published === true || project.published === undefined;
}

export function filterProjects(
  projects: Project[],
  filters: ProjectTableFilters
): Project[] {
  const query = filters.search.trim().toLowerCase();

  return projects.filter((project) => {
    if (filters.status === "published" && !isProjectPublished(project)) {
      return false;
    }
    if (filters.status === "draft" && isProjectPublished(project)) {
      return false;
    }
    if (
      filters.contributorType !== "all" &&
      project.contributorType !== filters.contributorType
    ) {
      return false;
    }
    if (!query) {
      return true;
    }
    return [project.title, project.medium, project.description].some((field) =>
      field.toLowerCase().includes(query)
    );
  });
}

export function hasActiveProjectFilters(filters: ProjectTableFilters): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.status !== "all" ||
    filters.contributorType !== "all"
  );
}

export function getDefaultFormData(projectCount: number): ProjectFormData {
  return {
    title: "",
    medium: "",
    description: "",
    link: "",
    githubLink: "",
    span: "col-span-1 row-span-1",
    order: projectCount,
    contributorType: "created",
  };
}

export function getProjectStats(projects: Project[]) {
  const created = projects.filter((p) => p.contributorType === "created").length;
  const contributed = projects.filter((p) => p.contributorType === "contributed").length;
  const latestUpdated = projects.reduce<Project | null>((latest, project) => {
    if (!latest || project.updatedAt > latest.updatedAt) {
      return project;
    }
    return latest;
  }, null);

  return {
    total: projects.length,
    created,
    contributed,
    latestUpdated,
  };
}
