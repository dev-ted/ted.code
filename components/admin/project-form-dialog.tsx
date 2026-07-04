"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectFormData, Project, SPAN_OPTIONS, getMediumOptions } from "@/lib/admin/projects";
import { ProjectLayoutPreview } from "@/components/admin/project-layout-preview";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ProjectFormData;
  onFormDataChange: (data: ProjectFormData) => void;
  onSubmit: (event: React.FormEvent) => void;
  isEditing: boolean;
  projects: Project[];
  editingId?: string;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  isEditing,
  projects,
  editingId,
}: ProjectFormDialogProps) {
  const mediumOptions = getMediumOptions(formData.medium);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-[calc(100%-2rem)] flex-col overflow-hidden p-0 sm:max-w-6xl">
        <div className="border-b px-6 py-5">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit project" : "Create project"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the project details below."
                : "Fill in the details to add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <form onSubmit={onSubmit} className="space-y-4 border-b px-6 py-5 lg:border-r lg:border-b-0">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              required
              placeholder="Project title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medium">Medium / category</Label>
            <Select
              value={formData.medium || undefined}
              onValueChange={(value) => onFormDataChange({ ...formData, medium: value })}
            >
              <SelectTrigger id="medium" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {mediumOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onFormDataChange({ ...formData, description: e.target.value })
              }
              required
              placeholder="Project description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link">Project link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => onFormDataChange({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubLink">GitHub link</Label>
              <Input
                id="githubLink"
                type="url"
                value={formData.githubLink}
                onChange={(e) =>
                  onFormDataChange({ ...formData, githubLink: e.target.value })
                }
                placeholder="https://github.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="span">Grid span</Label>
              <Select
                value={formData.span}
                onValueChange={(value) => onFormDataChange({ ...formData, span: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grid span" />
                </SelectTrigger>
                <SelectContent>
                  {SPAN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    order: parseInt(e.target.value, 10) || 0,
                  })
                }
                required
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contributorType">Contributor type</Label>
            <Select
              value={formData.contributorType}
              onValueChange={(value: "created" | "contributed") =>
                onFormDataChange({ ...formData, contributorType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contributor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="contributed">Contributed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update project" : "Create project"}</Button>
          </DialogFooter>
          </form>

          <div className="px-6 py-5 lg:overflow-y-auto">
            <ProjectLayoutPreview
              projects={projects}
              mode="dialog"
              formData={formData}
              editingId={editingId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
