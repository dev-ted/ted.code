import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  getAllowedAdminEmails,
  getSessionEmail,
} from "@/lib/admin/clerk-session";

export async function POST() {
  const syncSecret = process.env.ADMIN_SYNC_SECRET;
  if (!syncSecret) {
    return Response.json(
      { error: "ADMIN_SYNC_SECRET is not configured" },
      { status: 500 }
    );
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return Response.json(
      { error: "NEXT_PUBLIC_CONVEX_URL is not configured" },
      { status: 500 }
    );
  }

  const authState = await auth.protect();
  const email = await getSessionEmail(
    authState.userId,
    authState.sessionClaims as Record<string, unknown> | null | undefined
  );
  const allowed = getAllowedAdminEmails();

  if (!email || !allowed.includes(email.toLowerCase())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = await (
    await auth()
  ).getToken({ template: "convex" });

  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(token);

  try {
    await convex.mutation(api.admins.registerFromSession, {
      email,
      syncToken: syncSecret,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sync admin session";
    return Response.json({ error: message }, { status: 403 });
  }

  return Response.json({ ok: true });
}
