"use client";

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
  Github,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProjectFormDialog } from "@/components/admin/project-form-dialog";
import { ProjectLayoutPreview } from "@/components/admin/project-layout-preview";
import {
  DEFAULT_PROJECT_TABLE_FILTERS,
  filterProjects,
  getDefaultFormData,
  hasActiveProjectFilters,
  isProjectPublished,
  Project,
  ProjectFormData,
  ProjectTableFilters,
} from "@/lib/admin/projects";

interface ProjectsTableProps {
  projects: Project[];
}

type PublishDialogState = {
  projectId: Id<"projects">;
  title: string;
  nextPublished: boolean;
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const { toast } = useToast();
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);
  const setPublished = useMutation(api.projects.setPublished);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Id<"projects"> | null>(null);
  const [highlightProjectId, setHighlightProjectId] = useState<string | undefined>();
  const [formData, setFormData] = useState<ProjectFormData>(getDefaultFormData(projects.length));
  const [filters, setFilters] = useState<ProjectTableFilters>(DEFAULT_PROJECT_TABLE_FILTERS);
  const [publishDialog, setPublishDialog] = useState<PublishDialogState | null>(null);

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters]
  );
  const filtersActive = hasActiveProjectFilters(filters);

  const resetForm = () => {
    setFormData(getDefaultFormData(projects.length));
    setEditingProject(null);
    setHighlightProjectId(undefined);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_PROJECT_TABLE_FILTERS);
  };

  const handleOpenDialog = (projectId?: Id<"projects">) => {
    if (projectId) {
      const project = projects.find((p) => p._id === projectId);
      if (project) {
        setEditingProject(projectId);
        setHighlightProjectId(projectId);
        setFormData({
          title: project.title,
          medium: project.medium,
          description: project.description,
          link: project.link || "",
          githubLink: project.githubLink || "",
          span: project.span,
          order: project.order,
          contributorType: project.contributorType,
        });
      }
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.medium.trim()) {
      toast({
        title: "Category required",
        description: "Select a medium / category for this project.",
        variant: "destructive",
      });
      return;
    }

    try {
      const submitData = {
        ...formData,
        link: formData.link || undefined,
        githubLink: formData.githubLink || undefined,
      };

      if (editingProject) {
        await updateProject({
          id: editingProject,
          ...submitData,
        });
        toast({
          title: "Project updated",
          description: "Your changes were saved.",
        });
      } else {
        await createProject(submitData);
        toast({
          title: "Project created",
          description: "Publish the project when you are ready for it to appear on your portfolio.",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (projectId: Id<"projects">) => {
    if (!confirm("Delete this project? This cannot be undone.")) {
      return;
    }

    try {
      await deleteProject({ id: projectId });
      toast({
        title: "Project deleted",
        description: "The project was removed from your portfolio.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleConfirmPublish = async () => {
    if (!publishDialog) {
      return;
    }

    try {
      await setPublished({
        id: publishDialog.projectId,
        published: publishDialog.nextPublished,
      });
      toast({
        title: publishDialog.nextPublished ? "Project published" : "Project unpublished",
        description: publishDialog.nextPublished
          ? "The project is now visible on your portfolio site."
          : "The project is hidden from your portfolio site.",
      });
      setPublishDialog(null);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update publish status",
        variant: "destructive",
      });
    }
  };

  const handleQuickSpanChange = async (projectId: string, span: string) => {
    if (projectId === "__draft__") {
      return;
    }

    try {
      await updateProject({
        id: projectId as Id<"projects">,
        span,
      });
      toast({
        title: "Layout updated",
        description: "Project grid span was saved.",
      });
    } catch (error) {
      toast({
        title: "Layout update failed",
        description: error instanceof Error ? error.message : "Failed to update layout",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage portfolio projects, links, and display order.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add project
        </Button>
      </div>

      <div className="mt-6">
        <ProjectLayoutPreview
          projects={projects}
          mode="page"
          editable
          highlightProjectId={highlightProjectId}
          onProjectClick={(projectId) => handleOpenDialog(projectId as Id<"projects">)}
          onSpanChange={handleQuickSpanChange}
        />
      </div>

      {projects.length === 0 ? (
        <Empty className="mt-6 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderKanban />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Add your first project to start building your portfolio content.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Create first project
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="mt-6 rounded-md border">
          <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, search: event.target.value }))
                  }
                  placeholder="Search projects..."
                  className="pl-9"
                />
              </div>
              <Select
                value={filters.status}
                onValueChange={(value: ProjectTableFilters["status"]) =>
                  setFilters((current) => ({ ...current, status: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.contributorType}
                onValueChange={(value: ProjectTableFilters["contributorType"]) =>
                  setFilters((current) => ({ ...current, contributorType: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="contributed">Contributed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              {filtersActive ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredProjects.length} of {projects.length}
                  </p>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Clear filters
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Empty className="border-0 py-12">
              <EmptyHeader>
                <EmptyTitle>No matching projects</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search or filters to find what you are looking for.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={resetFilters}>
                  Clear filters
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Grid span</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const published = isProjectPublished(project);

                  return (
                    <TableRow key={project._id}>
                      <TableCell className="font-mono text-xs">{project.order}</TableCell>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="text-muted-foreground">{project.medium}</TableCell>
                      <TableCell>
                        <span
                          className={
                            published
                              ? "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                              : "inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {published ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium capitalize text-accent">
                          {project.contributorType}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{project.span}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : null}
                          {project.githubLink ? (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          ) : null}
                          {!project.link && !project.githubLink ? (
                            <span className="text-xs text-muted-foreground">No links</span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title={published ? "Unpublish" : "Publish"}
                            onClick={() =>
                              setPublishDialog({
                                projectId: project._id,
                                title: project.title,
                                nextPublished: !published,
                              })
                            }
                          >
                            {published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(project._id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <AlertDialog
        open={publishDialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPublishDialog(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishDialog?.nextPublished ? "Publish project?" : "Unpublish project?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {publishDialog?.nextPublished
                ? `"${publishDialog.title}" will appear on your portfolio site.`
                : `"${publishDialog?.title}" will be hidden from your portfolio site.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPublish}>
              {publishDialog?.nextPublished ? "Publish" : "Unpublish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ProjectFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          } else {
            setIsDialogOpen(true);
          }
        }}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        isEditing={editingProject !== null}
        projects={projects}
        editingId={editingProject ?? undefined}
      />
    </>
  );
}
