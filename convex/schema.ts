import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    medium: v.string(),
    description: v.string(),
    link: v.optional(v.string()),
    githubLink: v.optional(v.string()),
    span: v.string(), // Grid span class like "col-span-2 row-span-2"
    order: v.number(), // For ordering projects
    contributorType: v.union(v.literal("created"), v.literal("contributed")), // Whether you created or contributed to the project
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_created", ["createdAt"]),
});
