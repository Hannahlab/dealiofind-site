import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.OWNER),
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    products: defineTable({
      name: v.string(),
      price: v.number(),
      description: v.string(),
      category: v.string(),
      image: v.string(),
      bgColor: v.optional(v.string()),
      inStock: v.optional(v.boolean()),
      featured: v.optional(v.boolean()),
      special: v.optional(v.boolean()),
      slug: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
    }).index("by_category", ["category"])
      .index("by_featured", ["featured"])
      .index("by_slug", ["slug"]),

    userContent: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.string(),
      imageUrl: v.optional(v.string()),
      status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
      createdAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),

    orders: defineTable({
      userId: v.id("users"),
      items: v.array(v.object({
        productId: v.id("products"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
        image: v.string(),
      })),
      total: v.number(),
      status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("shipped"), v.literal("delivered")),
      shippingInfo: v.object({
        name: v.string(),
        email: v.string(),
        address: v.string(),
        city: v.string(),
        phone: v.string(),
      }),
      createdAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
