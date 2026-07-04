"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { Spinner } from "@/components/ui/spinner";

function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);

  return null;
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthLoading>
        <div className="flex min-h-svh items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3 text-center">
            <Spinner className="size-6 text-primary" />
            <p className="text-sm text-muted-foreground">Connecting...</p>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <AdminLoginRedirect />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}
