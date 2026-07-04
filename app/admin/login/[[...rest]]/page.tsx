"use client";

import { SignIn, useAuth, useClerk } from "@clerk/nextjs";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Lock } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const isUnauthorized = searchParams.get("error") === "unauthorized";
  const [ready, setReady] = useState(!isUnauthorized);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isUnauthorized) {
      setReady(true);
      return;
    }

    if (!hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: "Access denied",
        description: "Your account is not authorized to access the admin dashboard.",
        variant: "destructive",
      });
    }

    if (isSignedIn) {
      void signOut().then(() => {
        setReady(true);
      });
      return;
    }

    setReady(true);
  }, [isLoaded, isSignedIn, isUnauthorized, signOut, toast]);

  if (!isLoaded || !ready) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
        <CardDescription className="text-center">
          {isUnauthorized
            ? "Sign in with an authorized account to continue."
            : "Sign in with your authorized account to access the admin dashboard"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn
          routing="path"
          path="/admin/login"
          forceRedirectUrl="/admin"
          appearance={{
            elements: {
              footerAction: { display: "none" },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">Loading...</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
