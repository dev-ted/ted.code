"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AdminSessionSync() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const registerFromIdentity = useMutation(api.admins.registerFromIdentity);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || syncedRef.current) {
      return;
    }

    syncedRef.current = true;

    void (async () => {
      try {
        await registerFromIdentity({});
      } catch {
        const response = await fetch("/api/admin/sync", { method: "POST" });
        if (!response.ok) {
          console.error("Failed to sync admin session with Convex");
        }
      }
    })();
  }, [isAuthenticated, isLoading, registerFromIdentity]);

  return null;
}
