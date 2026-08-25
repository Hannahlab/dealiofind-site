import { useCart } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  bgColor?: string;
}

export function ProductCard({ id, name, price, image, bgColor = "bg-[#f5ede4]" }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: id, name, price, image });
  };

  return (
    <div className="group flex flex-col">
      <a href={`/product/${id}`} className={`${bgColor} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-6 shadow-sm hover:shadow-md transition-shadow`}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </a>
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
