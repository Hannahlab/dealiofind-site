import { useCart } from "@/hooks/use-cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

export function CartSheet() {
  const { items, removeItem, updateQuantity, total, itemCount, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-serif font-bold text-foreground">
            Shopping Bag ({itemCount})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground">Your bag is empty</p>
              <button
                onClick={() => { setIsOpen(false); navigate("/catalog"); }}
                className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer"
              >
                Browse products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 py-3 border-b border-border/50 last:border-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f5ede4] shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.name}</h3>
                    <p className="text-sm font-bold text-foreground mt-1">R{item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors self-start cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">R{total}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate("/checkout"); }}
              className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
