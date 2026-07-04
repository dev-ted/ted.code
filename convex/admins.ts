import {
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import {
  getIdentityEmail,
  isAllowedAdminEmail,
} from "./lib/auth";

export const getBySubject = internalQuery({
  args: { subject: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("adminUsers"),
      _creationTime: v.number(),
      subject: v.string(),
      email: v.string(),
      registeredAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_subject", (q) => q.eq("subject", args.subject))
      .unique();
  },
});

export const register = internalMutation({
  args: {
    subject: v.string(),
    email: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_subject", (q) => q.eq("subject", args.subject))
      .unique();

    if (existing) {
      if (existing.email !== args.email) {
        await ctx.db.patch("adminUsers", existing._id, { email: args.email });
      }
      return null;
    }

    await ctx.db.insert("adminUsers", {
      subject: args.subject,
      email: args.email,
      registeredAt: Date.now(),
    });

    return null;
  },
});

export const registerFromSession = mutation({
  args: {
    email: v.string(),
    syncToken: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const expectedToken = process.env.ADMIN_SYNC_SECRET;
    if (!expectedToken || args.syncToken !== expectedToken) {
      throw new Error("Unauthorized");
    }

    if (!isAllowedAdminEmail(args.email)) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    if (existing) {
      if (existing.email !== args.email.toLowerCase()) {
        await ctx.db.patch("adminUsers", existing._id, {
          email: args.email.toLowerCase(),
        });
      }
      return null;
    }

    await ctx.db.insert("adminUsers", {
      subject: identity.subject,
      email: args.email.toLowerCase(),
      registeredAt: Date.now(),
    });

    return null;
  },
});

export const registerFromIdentity = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const email = getIdentityEmail(identity);
    if (!email || !isAllowedAdminEmail(email)) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .unique();

    if (existing) {
      return null;
    }

    await ctx.db.insert("adminUsers", {
      subject: identity.subject,
      email: email.toLowerCase(),
      registeredAt: Date.now(),
    });

    return null;
  },
});
