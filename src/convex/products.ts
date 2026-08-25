import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireOwnerOrAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user || (user.role !== "owner" && user.role !== "admin"))
    throw new Error("Not authorized");
  return userId;
}

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    special: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let products;
    if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else if (args.featured) {
      products = await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", true))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }

    if (args.special) {
      products = products.filter((p) => p.special === true);
    }

    if (args.search) {
      const searchLower = args.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower),
      );
    }

    return products;
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const categories = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    special: v.optional(v.boolean()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireOwnerOrAdmin(ctx);
    const { productId, ...fields } = args;
    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) updates[key] = value;
    }
    if (updates.name && !updates.slug) {
      updates.slug = toSlug(updates.name as string);
    }
    await ctx.db.patch(productId, updates);
    return "updated";
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await requireOwnerOrAdmin(ctx);
    await ctx.db.delete(args.productId);
    return "deleted";
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    description: v.string(),
    category: v.string(),
    image: v.string(),
    bgColor: v.optional(v.string()),
    inStock: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    special: v.optional(v.boolean()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireOwnerOrAdmin(ctx);
    const slug = toSlug(args.name);
    return await ctx.db.insert("products", {
      ...args,
      slug,
      inStock: args.inStock ?? true,
      featured: args.featured ?? false,
      special: args.special ?? false,
    });
  },
});

export const seed = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "already seeded";

    const products = [
      {
        name: "Organic Cotton Bedding Set",
        price: 1200,
        description:
          "Premium organic cotton bedding set including duvet cover, fitted sheet, and two pillowcases. Soft, breathable, and sustainably sourced for the perfect night's sleep.",
        category: "Home Essentials",
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop",
        bgColor: "bg-[#f5ede4]",
        inStock: true,
        featured: true,
        special: false,
      },
      {
        name: "Nordic Ceramic Mug Collection",
        price: 450,
        description:
          "Set of four handcrafted Nordic-inspired ceramic mugs in earthy tones. Microwave and dishwasher safe. Perfect for your morning coffee or evening tea.",
        category: "Kitchen & Dining",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop",
        bgColor: "bg-[#f0ebe3]",
        inStock: true,
        featured: true,
        special: false,
      },
      {
        name: "Bamboo Bath Mat",
        price: 320,
        description:
          "Natural bamboo bath mat with a non-slip backing. Absorbent, durable, and adds a spa-like touch to any bathroom. Easy to clean and maintain.",
        category: "Wellness & Decor",
        image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600&h=600&fit=crop",
        bgColor: "bg-[#f2e8d8]",
        inStock: true,
        featured: true,
        special: true,
      },
      {
        name: "Soft Textiles Bundle",
        price: 350,
        description:
          "Luxuriously soft textiles bundle featuring a plush throw blanket and two decorative cushions. Available in neutral tones to complement any living space.",
        category: "Home Essentials",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
        bgColor: "bg-[#f5ede4]",
        inStock: true,
        featured: true,
        special: true,
      },
      {
        name: "Wellness & Decor Candle Set",
        price: 320,
        description:
          "Hand-poured soy wax candles in three signature scents: lavender fields, cedarwood forest, and vanilla bean. Creates a calming ambience in any room.",
        category: "Wellness & Decor",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
        bgColor: "bg-[#f8e8d8]",
        inStock: true,
        featured: true,
        special: false,
      },
      {
        name: "Quality Linen Bath Mat",
        price: 320,
        description:
          "Premium linen bath mat with a textured weave for superior absorbency. Machine washable and gets softer with every wash.",
        category: "Wellness & Decor",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
        bgColor: "bg-[#f0ebe3]",
        inStock: true,
        featured: true,
        special: false,
      },
      {
        name: "Ceramic Ring Vase",
        price: 120,
        description:
          "Modern circular ceramic vase with a minimalist design. Perfect for dried flowers or as a standalone decorative piece on a shelf or table.",
        category: "Wellness & Decor",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop",
        bgColor: "bg-[#f0ebe3]",
        inStock: true,
        featured: false,
        special: true,
      },
      {
        name: "Green Insulated Bottle",
        price: 280,
        description:
          "Double-walled stainless steel insulated bottle in sage green. Keeps drinks hot for 12 hours or cold for 24. Leak-proof and BPA-free.",
        category: "Kitchen & Dining",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
        bgColor: "bg-[#f8e8d8]",
        inStock: true,
        featured: false,
        special: true,
      },
      {
        name: "Sage Ceramic Bowl Set",
        price: 380,
        description:
          "Set of four sage green ceramic bowls with a matte finish. Ideal for salads, soups, or cereal. Dishwasher and microwave safe.",
        category: "Kitchen & Dining",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop",
        bgColor: "bg-[#f2e8d8]",
        inStock: true,
        featured: false,
        special: true,
      },
    ];

    for (const product of products) {
      const slug = toSlug(product.name);
      await ctx.db.insert("products", { ...product, slug });
    }
    return "seeded";
  },
});
