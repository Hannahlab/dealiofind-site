import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ProductCard";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get("category") || undefined;
  const urlSearch = searchParams.get("search") || undefined;
  const urlFeatured = searchParams.get("featured") === "true";
  const urlSpecial = searchParams.get("special") === "true";

  const [search, setSearch] = useState(urlSearch || "");
  const [category, setCategory] = useState<string | undefined>(urlCategory);

  // Sync URL params → state
  useEffect(() => {
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
  }, [urlCategory, urlSearch]);

  const products = useQuery(api.products.list, {
    search: search || urlSearch || undefined,
    category: category || urlCategory || undefined,
    featured: urlFeatured || undefined,
    special: urlSpecial || undefined,
  });
  const categories = useQuery(api.products.categories);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {category ? category : urlFeatured ? "Best Sellers" : urlSpecial ? "Curated Picks" : "Our Collection"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover trendy products that make everyday life easier.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilter("search", search || null);
                }
              }}
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); updateFilter("search", null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setCategory(undefined); updateFilter("category", null); updateFilter("featured", null); updateFilter("special", null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                !category && !urlFeatured && !urlSpecial
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const newCat = category === cat ? undefined : cat;
                  setCategory(newCat);
                  updateFilter("category", newCat || null);
                  updateFilter("featured", null);
                  updateFilter("special", null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  category === cat
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter badges */}
        {(urlFeatured || urlSpecial) && (
          <div className="flex gap-2 mb-6">
            {urlFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4a574]/20 text-[#d4a574] text-xs font-medium">
                Best Sellers
                <button onClick={() => updateFilter("featured", null)} className="hover:text-foreground cursor-pointer"><X className="h-3 w-3" /></button>
              </span>
            )}
            {urlSpecial && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 text-xs font-medium">
                Curated Picks
                <button onClick={() => updateFilter("special", null)} className="hover:text-foreground cursor-pointer"><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {products === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl aspect-square" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found.</p>
            {(search || category) && (
              <button
                onClick={() => { setSearch(""); setCategory(undefined); setSearchParams({}, { replace: true }); }}
                className="mt-2 text-sm font-semibold text-foreground hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={fadeInUp}>
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  bgColor={product.bgColor}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
