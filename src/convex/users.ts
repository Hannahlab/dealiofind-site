import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current signed in user. Returns null if the user is not signed in.
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return null;
    }
    return user;
  },
});

/**
 * Use this function internally to get the current user data.
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
};

/**
 * Set user name during sign-up
 */
export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, { name: args.name });
    return "updated";
  },
});

/**
 * Auto-assign first user as owner, subsequent users get "user" role.
 * Called after sign-up to ensure first user becomes the store owner.
 */
export const ensureRole = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // If user already has a role, do nothing
    if (user.role) return user.role;

    // Check if this is the first user (no other users with roles)
    const allUsers = await ctx.db.query("users").collect();
    const usersWithRoles = allUsers.filter((u) => u.role);

    if (usersWithRoles.length === 0) {
      // First user becomes owner
      await ctx.db.patch(userId, { role: "owner" });
      return "owner";
    }

    // Subsequent users get "user" role
    await ctx.db.patch(userId, { role: "user" });
    return "user";
  },
});

/**
 * Update user profile (phone, address, city, province, postal code)
 */
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const updates: Record<string, string> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.phone !== undefined) updates.phone = args.phone;
    if (args.address !== undefined) updates.address = args.address;
    if (args.city !== undefined) updates.city = args.city;
    if (args.province !== undefined) updates.province = args.province;
    if (args.postalCode !== undefined) updates.postalCode = args.postalCode;
    await ctx.db.patch(userId, updates);
    return "updated";
  },
});

/**
 * Owner-only: manually set a user's role by email.
 */
/**
 * One-time: if no owner exists yet, claim owner role for yourself.
 * Once an owner exists, this stops working.
 */
export const claimOwner = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Check if any owner already exists
    const allUsers = await ctx.db.query("users").collect();
    const existingOwner = allUsers.find((u) => u.role === "owner");
    if (existingOwner) throw new Error("An owner already exists. Contact them for access.");

    await ctx.db.patch(userId, { role: "owner" });
    return "You are now the store owner!";
  },
});
