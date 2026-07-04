"use client";

import { cn } from "@/lib/utils";
import {
  PORTFOLIO_GRID_CLASS,
  PORTFOLIO_GRID_CLASS_COMPACT,
  type GridPreviewProject,
} from "@/lib/portfolio-grid";
import { PortfolioGridCard } from "@/components/portfolio/portfolio-grid-card";

interface PortfolioGridProps {
  projects: GridPreviewProject[];
  startIndex?: number;
  highlightProjectId?: string;
  editable?: boolean;
  compact?: boolean;
  ghostIds?: Set<string>;
  onProjectClick?: (projectId: string) => void;
  onSpanChange?: (projectId: string, span: string) => void;
  className?: string;
}

export function PortfolioGrid({
  projects,
  startIndex = 0,
  highlightProjectId,
  editable = false,
  compact = false,
  ghostIds,
  onProjectClick,
  onSpanChange,
  className,
}: PortfolioGridProps) {
  return (
    <div
      className={cn(
        compact ? PORTFOLIO_GRID_CLASS_COMPACT : PORTFOLIO_GRID_CLASS,
        className
      )}
    >
      {projects.map((project, index) => (
        <PortfolioGridCard
          key={project.id}
          project={project}
          index={startIndex + index}
          highlighted={highlightProjectId === project.id}
          ghost={ghostIds?.has(project.id) ?? false}
          editable={editable}
          compact={compact}
          onClick={onProjectClick ? () => onProjectClick(project.id) : undefined}
          onSpanChange={
            onSpanChange ? (span) => onSpanChange(project.id, span) : undefined
          }
        />
      ))}
    </div>
  );
}
