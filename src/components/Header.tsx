import { useNavigate } from "react-router";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Search, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const { itemCount, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const [deptOpen, setDeptOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#faf7f4] border-b border-[#e8e0d8] sticky top-0 z-40">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end gap-6 py-3 text-foreground">
          <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="hover:text-[#d4a574] transition-colors cursor-pointer bg-transparent border-none text-xs text-foreground">
            Account
          </button>
          <span className="text-xs text-foreground hover:text-[#d4a574] transition-colors cursor-pointer">Wishlist</span>
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
                  {["Home Essentials", "Kitchen & Dining", "Wellness & Decor"].map((cat) => (
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
          <nav className="flex flex-col gap-3">
            <button onClick={() => { navigate("/catalog"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left">
              Shop
            </button>
            <button onClick={() => { navigate("/catalog"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left">
              New Arrivals
            </button>
            <button onClick={() => { navigate("/catalog"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left">
              Best Sellers
            </button>
            <button onClick={() => { navigate(isAuthenticated ? "/dashboard" : "/auth"); setMenuOpen(false); }} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none text-left">
              {isAuthenticated ? "My Account" : "Sign In"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
