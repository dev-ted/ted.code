"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? (theme ?? "system") : "system";

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5",
        className
      )}
      role="group"
      aria-label="Theme"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme("light")}
        className={cn(
          "size-8",
          activeTheme === "light" && "bg-primary/10 text-primary hover:bg-primary/15"
        )}
        aria-label="Light mode"
        aria-pressed={activeTheme === "light"}
      >
        <Sun className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme("dark")}
        className={cn(
          "size-8",
          activeTheme === "dark" && "bg-primary/10 text-primary hover:bg-primary/15"
        )}
        aria-label="Dark mode"
        aria-pressed={activeTheme === "dark"}
      >
        <Moon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setTheme("system")}
        className={cn(
          "size-8",
          activeTheme === "system" && "bg-primary/10 text-primary hover:bg-primary/15"
        )}
        aria-label="System mode"
        aria-pressed={activeTheme === "system"}
      >
        <Monitor className="size-4" />
      </Button>
    </div>
  );
}
