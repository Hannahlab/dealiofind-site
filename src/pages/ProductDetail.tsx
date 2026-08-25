import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/hooks/use-cart";
import { ArrowLeft, ShoppingBag, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import type { Id } from "@/convex/_generated/dataModel";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useQuery(api.products.get, id ? { id: id as Id<"products"> } : "skip");
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (product === undefined) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Product not found.</p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer"
          >
            Back to catalog
          </button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Image */}
          <div className={`${product.bgColor || "bg-[#f5ede4]"} rounded-3xl aspect-square flex items-center justify-center p-10`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium text-[#d4a574] uppercase tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-foreground mt-4">
              R{product.price}
            </p>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-8">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="mt-8 w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#f0e0cc] text-foreground font-semibold hover:bg-[#e6d0b8] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </button>

            {/* Stock status */}
            <p className="text-sm text-muted-foreground mt-4">
              {product.inStock !== false ? "✓ In stock — ships within 3–5 business days" : "Out of stock"}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
