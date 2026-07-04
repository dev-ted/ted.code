"use client";

import { cn } from "@/lib/utils";
import { spanToGridClasses } from "@/lib/portfolio-grid";
import { SPAN_OPTIONS } from "@/lib/admin/projects";
import { Button } from "@/components/ui/button";
import type { GridPreviewProject } from "@/lib/portfolio-grid";

const SPAN_SHORT_LABELS: Record<string, string> = {
  "col-span-1 row-span-1": "Small",
  "col-span-2 row-span-1": "Wide",
  "col-span-1 row-span-2": "Tall",
  "col-span-2 row-span-2": "Large",
};

interface PortfolioGridCardProps {
  project: GridPreviewProject;
  index: number;
  highlighted?: boolean;
  ghost?: boolean;
  editable?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onSpanChange?: (span: string) => void;
}

export function PortfolioGridCard({
  project,
  index,
  highlighted = false,
  ghost = false,
  editable = false,
  compact = false,
  onClick,
  onSpanChange,
}: PortfolioGridCardProps) {
  const gridSpanClasses = spanToGridClasses(project.span);

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border border-border/40 p-4 transition-colors",
        gridSpanClasses,
        highlighted && "border-primary/70 ring-2 ring-primary/30",
        ghost && "opacity-45",
        onClick && "cursor-pointer hover:border-accent/60",
        !onClick && "cursor-default"
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "font-mono uppercase tracking-widest text-muted-foreground",
              compact ? "text-[8px]" : "text-[10px]"
            )}
          >
            {project.medium}
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 font-medium capitalize",
              compact ? "text-[8px]" : "text-[10px]",
              project.contributorType === "created"
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground"
            )}
          >
            {project.contributorType === "created" ? "Created" : "Contributed"}
          </span>
          {project.isDraft ? (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Preview
            </span>
          ) : null}
        </div>
        <h3
          className={cn(
            "mt-2 font-(--font-bebas) tracking-tight text-foreground",
            compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl",
            highlighted && "text-primary"
          )}
        >
          {project.title}
        </h3>
      </div>

      <p
        className={cn(
          "relative z-10 line-clamp-2 font-mono leading-relaxed text-muted-foreground",
          compact ? "text-[10px]" : "text-xs"
        )}
      >
        {project.description}
      </p>

      <span
        className={cn(
          "absolute bottom-3 right-3 font-mono text-muted-foreground/50",
          compact ? "text-[8px]" : "text-[10px]",
          highlighted && "text-primary"
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {editable && onSpanChange ? (
        <div
          className="relative z-20 mt-2 flex flex-wrap gap-1"
          onClick={(event) => event.stopPropagation()}
        >
          {SPAN_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={project.span === option.value ? "default" : "outline"}
              className={cn("h-6 px-2 text-[10px]", compact && "h-5 px-1.5")}
              onClick={() => onSpanChange(option.value)}
            >
              {SPAN_SHORT_LABELS[option.value] ?? option.label}
            </Button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
