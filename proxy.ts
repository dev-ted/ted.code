import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getAllowedAdminEmails,
  getSessionEmail,
} from "@/lib/admin/clerk-session";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminLoginRoute = createRouteMatcher(["/admin/login(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isAdminRoute(request) || isAdminLoginRoute(request)) {
    return;
  }

  const session = await auth.protect();
  const email = await getSessionEmail(
    session.userId,
    session.sessionClaims as Record<string, unknown> | null | undefined
  );
  const allowed = getAllowedAdminEmails();

  if (!email || !allowed.includes(email.toLowerCase())) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
