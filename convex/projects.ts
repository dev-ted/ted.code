import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";

const projectValidator = v.object({
  _id: v.id("projects"),
  _creationTime: v.number(),
  title: v.string(),
  medium: v.string(),
  description: v.string(),
  link: v.optional(v.string()),
  githubLink: v.optional(v.string()),
  span: v.string(),
  order: v.number(),
  contributorType: v.union(v.literal("created"), v.literal("contributed")),
  published: v.optional(v.boolean()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// Query: Get all projects ordered by order field (admin)
export const getAll = query({
  args: {},
  returns: v.array(projectValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

// Query: Get published projects for public portfolio
export const listPublished = query({
  args: {},
  returns: v.array(projectValidator),
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_published_and_order", (q) => q.eq("published", true))
      .order("asc")
      .collect();
  },
});

// Query: Get a single project by ID
export const getById = query({
  args: { id: v.id("projects") },
  returns: v.union(projectValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get("projects", args.id);
  },
});

// Mutation: Create a new project
export const create = mutation({
  args: {
    title: v.string(),
    medium: v.string(),
    description: v.string(),
    link: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    span: v.string(),
    order: v.number(),
    contributorType: v.union(v.literal("created"), v.literal("contributed")),
  },
  returns: v.id("projects"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
      published: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation: Update an existing project
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    medium: v.optional(v.string()),
    description: v.optional(v.string()),
    link: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    span: v.optional(v.string()),
    order: v.optional(v.number()),
    contributorType: v.optional(
      v.union(v.literal("created"), v.literal("contributed"))
    ),
  },
  returns: v.union(projectValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...updates } = args;
    const existing = await ctx.db.get("projects", id);
    if (!existing) {
      throw new Error("Project not found");
    }
    await ctx.db.patch("projects", id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return await ctx.db.get("projects", id);
  },
});

// Mutation: Set project published status
export const setPublished = mutation({
  args: {
    id: v.id("projects"),
    published: v.boolean(),
  },
  returns: v.union(projectValidator, v.null()),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.get("projects", args.id);
    if (!existing) {
      throw new Error("Project not found");
    }
    await ctx.db.patch("projects", args.id, {
      published: args.published,
      updatedAt: Date.now(),
    });
    return await ctx.db.get("projects", args.id);
  },
});

// Mutation: Delete a project
export const remove = mutation({
  args: { id: v.id("projects") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete("projects", args.id);
    return null;
  },
});

// Internal: Backfill published=true for existing projects
export const backfillPublished = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    let updated = 0;
    for (const project of projects) {
      if (project.published === undefined) {
        await ctx.db.patch("projects", project._id, { published: true });
        updated++;
      }
    }
    return updated;
  },
});
