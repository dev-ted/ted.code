"use client";

import { usePathname } from "next/navigation";
import { SplashCursor } from "@/components/splash-cursor";

export function PortfolioSplashCursor() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <SplashCursor />;
}
