"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@/lib/admin/projects";

interface ProjectsPreviewProps {
  projects: Project[];
}

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  const previewProjects = [...projects]
    .sort((a, b) => a.order - b.order)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>Top five projects by display order.</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/projects">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {previewProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects to preview yet.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewProjects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell className="font-mono text-xs">{project.order}</TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="text-muted-foreground">{project.medium}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium capitalize text-accent">
                        {project.contributorType}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
