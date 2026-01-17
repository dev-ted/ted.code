"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Edit, Trash2, ExternalLink, Github, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ProjectFormData {
  title: string;
  medium: string;
  description: string;
  link?: string;
  githubLink?: string;
  span: string;
  order: number;
  contributorType: "created" | "contributed";
}

const SPAN_OPTIONS = [
  { value: "col-span-1 row-span-1", label: "Small (1x1)" },
  { value: "col-span-2 row-span-1", label: "Wide (2x1)" },
  { value: "col-span-1 row-span-2", label: "Tall (1x2)" },
  { value: "col-span-2 row-span-2", label: "Large (2x2)" },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const projects = useQuery(api.projects.getAll) || [];
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Id<"projects"> | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    medium: "",
    description: "",
    link: "",
    githubLink: "",
    span: "col-span-1 row-span-1",
    order: projects.length,
    contributorType: "created",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      medium: "",
      description: "",
      link: "",
      githubLink: "",
      span: "col-span-1 row-span-1",
      order: projects.length,
      contributorType: "created",
    });
    setEditingProject(null);
  };

  const handleOpenDialog = (projectId?: Id<"projects">) => {
    if (projectId) {
      const project = projects.find((p) => p._id === projectId);
      if (project) {
        setEditingProject(projectId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          title: "Success",
          description: "Project updated successfully",
        });
      } else {
        await createProject(submitData);
        toast({
          title: "Success",
          description: "Project created successfully",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (projectId: Id<"projects">) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteProject({ id: projectId });
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Logged out successfully",
        });
        router.push("/admin/login");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to logout",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">Projects Admin Dashboard</CardTitle>
                <CardDescription className="mt-2">
                  Manage your portfolio projects. Add, edit, or delete projects from your database.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProject ? "Edit Project" : "Create New Project"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProject
                        ? "Update the project details below."
                        : "Fill in the details to add a new project to your portfolio."}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                          placeholder="Project title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="medium">Medium/Category *</Label>
                        <Input
                          id="medium"
                          value={formData.medium}
                          onChange={(e) =>
                            setFormData({ ...formData, medium: e.target.value })
                          }
                          required
                          placeholder="e.g., Components library, E-Commerce"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                        placeholder="Project description"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="link">Project Link</Label>
                        <Input
                          id="link"
                          type="url"
                          value={formData.link}
                          onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
                          }
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="githubLink">GitHub Link</Label>
                        <Input
                          id="githubLink"
                          type="url"
                          value={formData.githubLink}
                          onChange={(e) =>
                            setFormData({ ...formData, githubLink: e.target.value })
                          }
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="span">Grid Span *</Label>
                        <Select
                          value={formData.span}
                          onValueChange={(value) =>
                            setFormData({ ...formData, span: value })
                          }
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
                        <Label htmlFor="order">Order *</Label>
                        <Input
                          id="order"
                          type="number"
                          value={formData.order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                          required
                          min={0}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contributorType">Contributor Type *</Label>
                      <Select
                        value={formData.contributorType}
                        onValueChange={(value: "created" | "contributed") =>
                          setFormData({ ...formData, contributorType: value })
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
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseDialog}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingProject ? "Update" : "Create"} Project
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No projects yet.</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Medium</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Grid Span</TableHead>
                      <TableHead>Links</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell className="font-mono text-xs">
                          {project.order}
                        </TableCell>
                        <TableCell className="font-medium">
                          {project.title}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {project.medium}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-accent/10 text-accent capitalize">
                            {project.contributorType}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {project.span}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            {project.githubLink && (
                              <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                            {!project.link && !project.githubLink && (
                              <span className="text-muted-foreground text-xs">
                                No links
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
