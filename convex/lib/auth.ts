import type { MutationCtx } from "../_generated/server";
import type { UserIdentity } from "convex/server";

export function parseAllowedEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function getIdentityEmail(identity: UserIdentity): string | undefined {
  if (identity.email) {
    return identity.email;
  }

  const custom = identity as Record<string, unknown>;
  const candidates = [
    custom.primary_email_address,
    custom.email_address,
    custom.primaryEmailAddress,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.includes("@")) {
      return candidate;
    }
  }

  return undefined;
}

export function isAllowedAdminEmail(email: string): boolean {
  const allowed = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
  return allowed.includes(email.toLowerCase());
}

async function isRegisteredAdmin(
  ctx: MutationCtx,
  subject: string
): Promise<boolean> {
  const registered = await ctx.db
    .query("adminUsers")
    .withIndex("by_subject", (q) => q.eq("subject", subject))
    .unique();

  return registered !== null;
}

export async function requireAdmin(ctx: MutationCtx): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  if (await isRegisteredAdmin(ctx, identity.subject)) {
    return identity;
  }

  const allowed = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
  if (allowed.length === 0) {
    throw new Error("Admin access is not configured");
  }

  const email = getIdentityEmail(identity)?.toLowerCase();
  if (email && allowed.includes(email)) {
    await ctx.db.insert("adminUsers", {
      subject: identity.subject,
      email,
      registeredAt: Date.now(),
    });
    return identity;
  }

  if (allowed.includes(identity.subject.toLowerCase())) {
    await ctx.db.insert("adminUsers", {
      subject: identity.subject,
      email: email ?? identity.subject,
      registeredAt: Date.now(),
    });
    return identity;
  }

  throw new Error("Unauthorized");
}
