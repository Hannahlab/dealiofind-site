import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ShoppingBag, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  bgColor?: string;
}

export function ProductCard({ id, name, price, image, bgColor = "bg-[#f5ede4]" }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const toggleWishlist = useMutation(api.wishlist.toggle);
  const isWishlisted = useQuery(
    api.wishlist.isWishlisted,
    isAuthenticated ? { productId: id as any } : "skip"
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: id, name, price, image });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await toggleWishlist({ productId: id as any });
  };

  return (
    <div className="group flex flex-col">
      <div className="relative">
        <a href={`/product/${id}`} className={`block ${bgColor} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </a>
        {isAuthenticated && (
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all cursor-pointer ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/80 text-muted-foreground hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-col items-center text-center">
        <a href={`/product/${id}`}>
          <h3 className="text-sm font-semibold text-foreground hover:underline">{name}</h3>
        </a>
        <p className="text-sm font-bold text-foreground mt-1">R{price}</p>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full max-w-[180px] py-2.5 px-6 rounded-full bg-[#f0e0cc] text-foreground text-sm font-semibold hover:bg-[#e6d0b8] transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
