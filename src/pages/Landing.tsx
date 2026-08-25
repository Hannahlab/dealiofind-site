import { motion } from "framer-motion";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

/* ─── Data ──────────────────────────────────────────────────────────── */

const categoryProducts: Record<string, typeof featuredRow1> = {
  "Home Essentials": {
    row1: [
      { name: "Organic Cotton Bedding Set", price: "R1200", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
      { name: "Nordic Ceramic Mug Collection", price: "R450", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
      { name: "Bamboo Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
    ],
    row2: [
      { name: "Organic Cotton Mat", price: "R220", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
      { name: "Nordic Ceramic", price: "R450", image: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
      { name: "Wellness & Decor", price: "R320", image: "https://images.unsplash.com/photo-1612196808214-b7e239e5bb89?w=500&h=500&fit=crop", bg: "bg-[#d5dfc8]" },
    ],
  },
  "Kitchen & Dining": {
    row1: [
      { name: "Nordic Ceramic Mug Collection", price: "R450", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
      { name: "Ceramic Dinnerware Set", price: "R680", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
      { name: "Bamboo Serving Board", price: "R290", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
    ],
    row2: [
      { name: "Stoneware Pitcher", price: "R380", image: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
      { name: "Insulated Bottle", price: "R280", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", bg: "bg-[#f8e8d8]" },
      { name: "Sage Ceramic Bowl Set", price: "R380", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
    ],
  },
  "Wellness & Decor": {
    row1: [
      { name: "Wellness & Decor Candle Set", price: "R320", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", bg: "bg-[#f8e8d8]" },
      { name: "Bamboo Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
      { name: "Ceramic Ring Vase", price: "R120", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
    ],
    row2: [
      { name: "Soft Textiles Bundle", price: "R350", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
      { name: "Quality Linen Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
      { name: "Green Insulated Bottle", price: "R280", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", bg: "bg-[#f8e8d8]" },
    ],
  },
};

const dealOfWeekProducts = [
  { name: "Organic Cotton Bedding Set", price: "R1200", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
  { name: "Nordic Ceramic Mug Collection", price: "R450", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
  { name: "Bamboo Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
  { name: "Soft Textiles", price: "R350", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
  { name: "Wellness & Decor", price: "R320", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", bg: "bg-[#f8e8d8]" },
  { name: "Quality Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
];

const specialProducts = [
  { name: "Bamboo Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=500&h=500&fit=crop", bg: "bg-[#f5ede4]" },
  { name: "Ceramic Decor", price: "R120", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop", bg: "bg-[#f0ebe3]" },
  { name: "Bamboo Bath Mat", price: "R320", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop", bg: "bg-[#f8e8d8]" },
  { name: "Soft Textiles", price: "R350", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop", bg: "bg-[#f2e8d8]" },
];

type Product = { name: string; price: string; image: string; bg: string };
const featuredRow1 = { row1: [] as Product[], row2: [] as Product[] };

/* ─── Components ────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => navigate("/catalog")}
        className={`w-full ${product.bg} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 cursor-pointer border-none`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />
      </button>
      <h3 className="text-sm font-bold text-foreground mt-3 text-center">{product.name}</h3>
      <p className="text-sm font-bold text-foreground mt-0.5">{product.price}</p>
      <button
        onClick={() =>
          addItem({
            productId: product.name,
            name: product.name,
            price: parseInt(product.price.replace("R", "")),
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

/* ─── Header ────────────────────────────────────────────────────────── */

function Header() {
  const navigate = useNavigate();
  const { itemCount, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [deptOpen, setDeptOpen] = useState(false);

  return (
    <header className="bg-[#faf7f4] border-b border-[#e8e0d8]">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end gap-6 py-2 text-xs text-foreground">
          <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none text-xs text-foreground">
            Account
          </button>
          <span className="hover:text-[#d4a574] transition-colors cursor-pointer">Wishlist</span>
          <button onClick={() => setIsOpen(true)} className="flex items-center gap-1.5 hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none text-xs text-foreground">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 ? `${itemCount} items` : "0 items"}
          </button>
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="text-2xl font-serif font-bold text-foreground tracking-tight cursor-pointer bg-transparent border-none p-0 shrink-0">
            Dealiofind
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 ml-10">
            <div className="relative">
              <button
                onClick={() => setDeptOpen(!deptOpen)}
                className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none"
              >
                Shop Departments
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {deptOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8e0d8] py-2 z-50">
                  {Object.keys(categoryProducts).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { navigate("/catalog"); setDeptOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-[#f5ede4] transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => navigate("/catalog")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              New Arrivals
            </button>
            <button onClick={() => navigate("/catalog")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              Best Sellers
            </button>
            <button onClick={() => navigate("/catalog")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              Curated Picks
            </button>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="pl-9 pr-4 py-2 rounded-full border border-[#e0d8d0] bg-white text-sm text-foreground placeholder:text-muted-foreground w-52 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/30 focus:border-[#d4a574]"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero Banner ───────────────────────────────────────────────────── */

function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f5ede4 0%, #efe5d8 40%, #e8ddd0 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          {/* Left decorative vases */}
          <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2">
            <img
              src="https://images.unsplash.com/photo-1612196808214-b7e239e5bb89?w=120&h=200&fit=crop"
              alt=""
              className="w-16 h-28 object-cover rounded-lg opacity-60"
            />
          </div>

          {/* Center text */}
          <div className="text-center lg:text-center flex-1 z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight">
              DEALIOFIND: Curated Living.
              <br />
              Unbeatable Discoveries.
            </h1>
            <p className="text-muted-foreground mt-4 text-sm sm:text-base">
              Explore Premium Picks for Every Home
            </p>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-6 px-8 py-3 rounded-full bg-white/80 text-foreground text-sm font-semibold hover:bg-white transition-colors cursor-pointer border border-white/40 shadow-sm"
            >
              Shop Now
            </button>
          </div>

          {/* Right coffee maker */}
          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
            <img
              src="https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=180&h=220&fit=crop"
              alt=""
              className="w-40 h-52 object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-6">
        <span className="w-2.5 h-2.5 rounded-full bg-[#d4a574]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#d4c4b0]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#d4c4b0]" />
      </div>
    </section>
  );
}

/* ─── Category Tabs ─────────────────────────────────────────────────── */

function CategoryTabs({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (cat: string) => void;
}) {
  const categories = Object.keys(categoryProducts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-2">
      <div className="flex justify-center gap-12 sm:gap-16 lg:gap-24 border-b border-[#e8e0d8]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`pb-4 text-base sm:text-lg font-serif font-bold transition-colors cursor-pointer bg-transparent border-none ${
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
  const [activeCategory, setActiveCategory] = useState("Home Essentials");
  const navigate = useNavigate();
  const data = categoryProducts[activeCategory];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />

      <motion.div
        key={activeCategory}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {data.row1.map((p) => (
            <ProductCard key={p.name + p.price} product={p} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {data.row2.map((p) => (
            <ProductCard key={p.name + p.price} product={p} />
          ))}
        </div>
      </motion.div>

      {/* Show Now */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/catalog")}
          className="px-10 py-3 rounded-full border border-[#d4b896] text-foreground text-sm font-semibold hover:bg-[#f0e0cc] transition-colors cursor-pointer bg-transparent"
        >
          Show Now
        </button>
      </div>
    </section>
  );
}

/* ─── Deal of the Week ──────────────────────────────────────────────── */

function DealOfWeekSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-10">
        Deal of the Week
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dealOfWeekProducts.map((p) => (
          <ProductCard key={p.name + p.price} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ─── Special Section ───────────────────────────────────────────────── */

function SpecialSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Deal of the Week
        </h2>
        <span className="inline-block px-6 py-2 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold">
          Special
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {specialProducts.map((p) => (
          <ProductCard key={p.name + p.price} product={p} />
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-[#3a2f28] text-white/90 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-3">Dealiofind</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              DEALIOFIND: Curated Living.
              <br />
              Unbeatable Discoveries.
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">
              About Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Payment */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">
              Newsletter Signup
            </h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
              />
              <button className="px-5 py-2.5 rounded-lg bg-[#d4a574] text-white text-sm font-semibold hover:bg-[#c49564] transition-colors cursor-pointer">
                Join
              </button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider mt-8 mb-3">
              Payment / Shipping
            </h4>
            <div className="flex gap-2.5 flex-wrap">
              <div className="px-3 py-1.5 rounded bg-white/10 text-[10px] font-bold tracking-wide">VISA</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-[10px] font-bold tracking-wide">Mastercard</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-[10px] font-bold tracking-wide">Maestro</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-[10px] font-bold tracking-wide">COD</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-[10px] font-bold tracking-wide">EFT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-white/40 text-center">
            © 2024 Dealiofind. All Rights Reserved.
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
      <Header />
      <HeroBanner />
      <main className="flex-1">
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
