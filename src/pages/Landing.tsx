import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/hooks/use-cart";

/* ─── Components ────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: { _id: string; name: string; price: number; image: string; bgColor?: string } }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => navigate(`/product/${product._id}`)}
        className={`w-full ${product.bgColor || "bg-[#f5ede4]"} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 cursor-pointer border-none`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      </button>
      <h3 className="text-sm font-bold text-foreground mt-3 text-center">{product.name}</h3>
      <p className="text-sm font-bold text-foreground mt-0.5">R{product.price}</p>
      <button
        onClick={() =>
          addItem({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
          })
        }
        className="mt-3 w-full max-w-[200px] py-2.5 rounded-full border border-[#d4b896] text-foreground text-sm font-semibold hover:bg-[#f0e0cc] transition-colors cursor-pointer bg-transparent"
      >
        Add to Cart
      </button>
    </div>
  );
}

/* ─── Hero Banner ───────────────────────────────────────────────────── */

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[#ede5d7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 sm:pt-8 sm:pb-10 lg:pt-8 lg:pb-20 relative">
        {/* Left decorative image */}
        <div className="absolute left-0 lg:left-4 top-1/2 -translate-y-1/2">
          <img src="https://res.cloudinary.com/kfcu2z4r/image/upload/v1787645893/IMG_7685_ictnrk.png" alt="" className="h-[120px] sm:h-[240px] lg:h-[340px] w-auto object-contain" />
        </div>

        {/* Right decorative image */}
        <div className="absolute right-0 lg:right-4 top-1/2 -translate-y-1/2">
          <img src="https://res.cloudinary.com/kfcu2z4r/image/upload/v1787645889/IMG_7683_bg28ov.png" alt="" className="h-[120px] sm:h-[240px] lg:h-[340px] w-auto object-contain" />
        </div>

        {/* Center text */}
        <div className="text-center w-full pt-10 sm:pt-14 lg:py-6 z-10 relative px-20 sm:px-16 lg:px-0">
          <h1 className="text-[11px] sm:text-lg lg:text-3xl font-serif font-bold text-[#3a2f28] leading-[1.2] tracking-tight">
            DEALIOFIND: Curated Living. Unbeatable Discoveries.
          </h1>
          <p className="text-[#7a6b5a] mt-0.5 sm:mt-3 text-[8px] sm:text-sm font-normal">
            Explore Premium Picks for Every Home
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-1.5 sm:mt-7 px-3 sm:px-8 py-1 sm:py-2.5 rounded-full bg-[#d5c4a8] text-[#3a2f28] text-[8px] sm:text-sm font-medium hover:bg-[#c8b898] transition-colors cursor-pointer border border-[#c8b898]"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2.5 pb-3">
        <span className="w-2 h-2 rounded-full bg-[#5a4a3a]" />
        <span className="w-2 h-2 rounded-full bg-[#c8b898]" />
        <span className="w-2 h-2 rounded-full bg-[#c8b898]" />
      </div>
    </section>
  );
}

/* ─── Category Tabs ─────────────────────────────────────────────────── */

function CategoryTabs({
  active,
  onSelect,
  categories,
}: {
  active: string;
  onSelect: (cat: string) => void;
  categories: string[];
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-2">
      <div className="flex justify-center gap-4 sm:gap-12 lg:gap-24 border-b border-[#e8e0d8]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`pb-4 text-xs sm:text-lg font-serif font-bold transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap ${
              active === cat
                ? "text-foreground border-b-2 border-foreground -mb-[2px]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Grid Section ──────────────────────────────────────────── */

function ProductGridSection() {
  const allProducts = useQuery(api.products.list, {});
  const categoriesQuery = useQuery(api.products.categories);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = categoriesQuery ?? [];
  const filteredProducts = activeCategory
    ? (allProducts ?? []).filter((p) => p.category === activeCategory)
    : (allProducts ?? []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {categories.length > 0 && (
        <CategoryTabs
          active={activeCategory ?? categories[0]}
          onSelect={(cat) => setActiveCategory(cat === activeCategory ? null : cat)}
          categories={categories}
        />
      )}

      <motion.div
        key={activeCategory ?? "all"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {allProducts === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#f0e0cc] rounded-2xl aspect-square" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-[#f0e0cc] rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-[#f0e0cc] rounded w-1/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products in this category yet.</p>
          </div>
        ) : (
          <>
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredProducts.slice(0, 3).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {/* Row 2 */}
            {filteredProducts.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {filteredProducts.slice(3, 6).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/catalog")}
          className="px-10 py-3 rounded-full border border-[#d4b896] text-foreground text-sm font-semibold hover:bg-[#f0e0cc] transition-colors cursor-pointer bg-transparent"
        >
          View All Products
        </button>
      </div>
    </section>
  );
}

/* ─── Deal of the Week ──────────────────────────────────────────────── */

function DealOfWeekSection() {
  const allProducts = useQuery(api.products.list, { featured: true });
  const dealProducts = (allProducts ?? []).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-10">
        Deal of the Week
      </h2>

      {dealProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No deals yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dealProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Special Section ───────────────────────────────────────────────── */

function SpecialSection() {
  const allProducts = useQuery(api.products.list, { special: true });
  const specialProducts = (allProducts ?? []).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Special Picks
        </h2>
        <span className="inline-block px-6 py-2 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold">
          Limited Time
        </span>
      </div>

      {specialProducts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No special items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {specialProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-[#d5c4a8] text-[#3a2f28] mt-16">
      <div className="w-full px-5 sm:px-6 lg:px-8 py-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-3">Dealiofind</h3>
            <p className="text-[#5a4a3a] text-sm leading-relaxed">
              DEALIOFIND: Curated Living.
              <br />
              Unbeatable Discoveries.
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#3a2f28]">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#3a2f28]">
              About Us
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Our Story</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Sustainability</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-[#5a4a3a] hover:text-[#3a2f28] transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter & Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-[#3a2f28]">
              Newsletter Signup
            </h4>
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/50 border border-[#c0b090] text-[#3a2f28] placeholder:text-[#8a7a6a] text-sm focus:outline-none focus:ring-2 focus:ring-[#3a2f28]/20"
              />
              <button className="px-4 py-2 rounded-lg bg-[#3a2f28] text-white text-sm font-semibold hover:bg-[#2a1f18] transition-colors cursor-pointer shrink-0">
                Join
              </button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider mt-8 mb-3 text-[#3a2f28]">
              Payment Methods
            </h4>
            <div className="flex gap-2.5 flex-wrap">
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">VISA</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">Mastercard</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">PayPal</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">EFT</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">SnapScan</div>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider mt-5 mb-3 text-[#3a2f28]">
              Shipping
            </h4>
            <div className="flex gap-2.5 flex-wrap">
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">Paxi</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">Pargo</div>
              <div className="px-3 py-1.5 rounded bg-white/50 border border-[#c0b090] text-[10px] font-bold tracking-wide text-[#3a2f28]">The Courier Guy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#c0b090]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-[#5a4a3a] text-center">
            © 2026 Dealiofind. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Landing Page ──────────────────────────────────────────────────── */

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-[#faf7f4]"
    >
      <HeroBanner />
      <main className="flex-1">
        <div className="h-4" />
        <ProductGridSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-[#e8e0d8]" />
        </div>
        <DealOfWeekSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-[#e8e0d8]" />
        </div>
        <SpecialSection />
      </main>
      <Footer />
    </motion.div>
  );
}
