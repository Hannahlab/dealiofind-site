import { motion } from "framer-motion";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState } from "react";

// Product data matching the design
const featuredProducts = [
  {
    id: 1,
    name: "Organic Cotton Bedding Set",
    price: "R1200",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop",
    bgColor: "bg-[#f5ede4]",
  },
  {
    id: 2,
    name: "Nordic Ceramic Mug Collection",
    price: "R450",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    bgColor: "bg-[#f0ebe3]",
  },
  {
    id: 3,
    name: "Bamboo Bath Mat",
    price: "R320",
    image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400&h=400&fit=crop",
    bgColor: "bg-[#f2e8d8]",
  },
  {
    id: 4,
    name: "Soft Textiles",
    price: "R350",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    bgColor: "bg-[#f5ede4]",
  },
  {
    id: 5,
    name: "Wellness & Decor",
    price: "R320",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    bgColor: "bg-[#f8e8d8]",
  },
  {
    id: 6,
    name: "Quality Bath Mat",
    price: "R320",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    bgColor: "bg-[#f0ebe3]",
  },
];

const specialProducts = [
  {
    id: 7,
    name: "Bamboo Bath Mat",
    price: "R320",
    image: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=400&h=400&fit=crop",
    bgColor: "bg-[#f5ede4]",
  },
  {
    id: 8,
    name: "Ceramic Decor",
    price: "R120",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
    bgColor: "bg-[#f0ebe3]",
  },
  {
    id: 9,
    name: "Bamboo Bath Mat",
    price: "R320",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    bgColor: "bg-[#f8e8d8]",
  },
  {
    id: 10,
    name: "Soft Textiles",
    price: "R350",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    bgColor: "bg-[#f2e8d8]",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Dealiofind
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#featured" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop
            </a>
            <a href="#special" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Deals
            </a>
            <a href="#footer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-4 w-4" />
            </button>
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#d4a574] text-[10px] font-bold text-white flex items-center justify-center">
                0
              </span>
            </button>
            <button
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 py-4"
          >
            <nav className="flex flex-col gap-3">
              <a href="#featured" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </a>
              <a href="#special" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Deals
              </a>
              <a href="#footer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}

function ProductCard({ product, index }: { product: typeof featuredProducts[0]; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group flex flex-col"
    >
      <div className={`${product.bgColor} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 shadow-sm`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex flex-col items-center text-center">
        <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
        <p className="text-sm font-bold text-foreground mt-1">{product.price}</p>
        <button className="mt-3 w-full max-w-[180px] py-2.5 px-6 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold hover:bg-[#e6d0b8] transition-colors cursor-pointer">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

function FeaturedSection() {
  return (
    <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-12"
      >
        Deal of the Week
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {featuredProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>

      <div className="flex justify-center mt-12">
        <button className="px-8 py-3 rounded-full bg-[#f0e0cc] text-foreground font-semibold hover:bg-[#e6d0b8] transition-colors cursor-pointer">
          Show Now
        </button>
      </div>
    </section>
  );
}

function SpecialSection() {
  return (
    <section id="special" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Deal of the Week
        </h2>
        <span className="inline-block px-5 py-2 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold">
          Special
        </span>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {specialProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="bg-[#3a2f28] text-white/90 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-3">Dealiofind</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              DEALIOFIND: Curated Living.<br />
              Unbeatable Discoveries.
            </p>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">About Us</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Newsletter & Payment */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Newsletter Signup</h4>
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

            <h4 className="text-sm font-bold uppercase tracking-wider mt-8 mb-3">Payment / Shipping</h4>
            <div className="flex gap-3 flex-wrap">
              <div className="px-3 py-1.5 rounded bg-white/10 text-xs font-medium">VISA</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-xs font-medium">Mastercard</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-xs font-medium">Maestro</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-xs font-medium">COD</div>
              <div className="px-3 py-1.5 rounded bg-white/10 text-xs font-medium">EFT</div>
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

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Header />

      <main className="flex-1">
        <FeaturedSection />

        {/* Decorative divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-border/60" />
        </div>

        <SpecialSection />
      </main>

      <Footer />
    </motion.div>
  );
}
