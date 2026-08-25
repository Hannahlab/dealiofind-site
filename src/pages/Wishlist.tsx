import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const items = useQuery(api.wishlist.list);
  const toggleWishlist = useMutation(api.wishlist.toggle);
  const { addItem } = useCart();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Sign in to view your wishlist</p>
          <button
            onClick={() => navigate("/auth?returnTo=/wishlist")}
            className="mt-4 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            Items you've saved for later.
          </p>
        </div>

        {items === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-2xl aspect-square" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/4 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Your wishlist is empty</p>
            <button
              onClick={() => navigate("/catalog")}
              className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer"
            >
              Browse products
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col"
              >
                <button
                  onClick={() => navigate(`/product/${item.productId}`)}
                  className={`w-full ${item.product.bgColor || "bg-[#f5ede4]"} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 cursor-pointer border-none`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </button>
                <h3 className="text-sm font-bold text-foreground mt-3 text-center">
                  {item.product.name}
                </h3>
                <p className="text-sm font-bold text-foreground mt-0.5 text-center">
                  R{item.product.price}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      addItem({
                        productId: item.productId,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image,
                      });
                    }}
                    className="flex-1 py-2.5 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold hover:bg-[#e6d0b8] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist({ productId: item.productId })}
                    className="p-2.5 rounded-full border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
