import { useNavigate } from "react-router";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, ShoppingCart, ChevronDown, Menu, X, Heart } from "lucide-react";
import { useState } from "react";

const departments = ["Home Essentials", "Kitchen & Dining", "Wellness & Decor"];

export function Header() {
  const navigate = useNavigate();
  const { itemCount, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const wishlistCount = useQuery(api.wishlist.count);
  const [deptOpen, setDeptOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const [desktopSearch, setDesktopSearch] = useState("");

  const handleSearch = (q: string) => {
    if (q.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(q.trim())}`);
    } else {
      navigate("/catalog");
    }
  };

  return (
    <header className="bg-[#faf7f4] border-b border-[#e8e0d8] sticky top-0 z-40">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end gap-6 py-3 text-foreground">
          <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none text-xs text-foreground">
            Account
          </button>
          <button onClick={() => navigate("/wishlist")} className="flex items-center gap-1 hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none text-xs text-foreground">
            <Heart className="h-3.5 w-3.5" />
            Wishlist
            {wishlistCount !== undefined && wishlistCount > 0 && (
              <span className="ml-0.5 text-[10px] bg-[#d4a574] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </button>
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
                onBlur={() => setTimeout(() => setDeptOpen(false), 200)}
                className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none"
              >
                Shop Departments
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${deptOpen ? "rotate-180" : ""}`} />
              </button>
              {deptOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e8e0d8] py-2 z-50">
                  {departments.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { navigate(`/catalog?category=${encodeURIComponent(cat)}`); setDeptOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-[#f5ede4] transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {cat}
                    </button>
                  ))}
                  <div className="border-t border-[#e8e0d8] mt-1 pt-1">
                    <button
                      onClick={() => { navigate("/catalog"); setDeptOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-[#d4a574] hover:bg-[#f5ede4] transition-colors cursor-pointer bg-transparent border-none"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/catalog")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              New Arrivals
            </button>
            <button onClick={() => navigate("/catalog?featured=true")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              Best Sellers
            </button>
            <button onClick={() => navigate("/catalog?special=true")} className="text-sm font-bold text-foreground hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none">
              Curated Picks
            </button>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex items-center ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                value={desktopSearch}
                onChange={(e) => setDesktopSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(desktopSearch); }}
                className="pl-9 pr-4 py-2 rounded-full border border-[#e0d8d0] bg-white text-sm text-foreground placeholder:text-muted-foreground w-52 focus:outline-none focus:ring-2 focus:ring-[#d4a574]/30 focus:border-[#d4a574]"
              />
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#e8e0d8] py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Mobile search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { handleSearch(mobileSearch); setMenuOpen(false); } }}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-[#e0d8d0] bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#d4a574]/30"
            />
          </div>
          <nav className="flex flex-col gap-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-4 pt-2 pb-1">Departments</p>
            {departments.map((cat) => (
              <button
                key={cat}
                onClick={() => { navigate(`/catalog?category=${encodeURIComponent(cat)}`); setMenuOpen(false); }}
                className="text-sm font-medium text-foreground hover:bg-[#f5ede4] px-4 py-2 rounded transition-colors cursor-pointer bg-transparent border-none text-left"
              >
                {cat}
              </button>
            ))}
            <div className="border-t border-[#e8e0d8] my-2" />
            <button onClick={() => { navigate("/catalog"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left px-4 py-2">
              New Arrivals
            </button>
            <button onClick={() => { navigate("/catalog?featured=true"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left px-4 py-2">
              Best Sellers
            </button>
            <button onClick={() => { navigate("/catalog?special=true"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left px-4 py-2">
              Curated Picks
            </button>
            <button onClick={() => { navigate("/wishlist"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left px-4 py-2">
              Wishlist
            </button>
            <div className="border-t border-[#e8e0d8] my-2" />
            <button onClick={() => { navigate(isAuthenticated ? "/dashboard" : "/auth"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left px-4 py-2">
              {isAuthenticated ? "My Account" : "Sign In"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
