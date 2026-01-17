
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all projects ordered by order field
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

// Query: Get a single project by ID
export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
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
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("projects", {
      ...args,
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
    contributorType: v.optional(v.union(v.literal("created"), v.literal("contributed"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Project not found");
    }
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

// Mutation: Delete a project
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
