import { useCart } from "@/hooks/use-cart";
import { useNavigate } from "react-router";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useMutation(api.orders.create);
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createOrder({
        items: items.map((i) => ({
          productId: i.productId as any,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        total,
        shippingInfo: shipping,
      });
      clearCart();
      setStep("success");
    } catch (err) {
      console.error("Order failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Your cart is empty.</p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer"
          >
            Browse products
          </button>
        </div>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            View My Orders
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          Checkout
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-4 mb-10">
          <div className={`flex items-center gap-2 ${step === "shipping" || step === "payment" ? "text-foreground" : "text-muted-foreground"}`}>
            <span className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">1</span>
            <span className="text-sm font-medium hidden sm:inline">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}>
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "payment" ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>2</span>
            <span className="text-sm font-medium hidden sm:inline">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleShippingSubmit}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold text-foreground">Shipping Details</h2>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                  <input
                    required
                    type="text"
                    value={shipping.name}
                    onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                  <input
                    required
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
                  <input
                    required
                    type="text"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                    <input
                      required
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
                    <input
                      required
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer mt-6"
                >
                  Continue to Payment
                </button>
              </motion.form>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handlePaymentSubmit}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </h2>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Cardholder Name</label>
                  <input
                    required
                    type="text"
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Card Number</label>
                  <input
                    required
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Expiry</label>
                    <input
                      required
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">CVV</label>
                    <input
                      required
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/50 rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f5ede4] shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">R{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">R{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
