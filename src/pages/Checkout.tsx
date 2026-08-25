import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useMutation(api.orders.create);
  const generatePayFastForm = useAction(api.payfast.generateCheckoutForm);
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shipping, setShipping] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"payfast" | "eft">("payfast");
  const [shippingMethod, setShippingMethod] = useState("pargo");

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = await createOrder({
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

      if (paymentMethod === "payfast") {
        const payfastData = await generatePayFastForm({
          orderId: orderId as string,
          amount: total,
          itemName: `Dealiofind Order - ${items.length} item(s)`,
          buyerEmail: shipping.email,
          buyerName: shipping.name,
        });

        const form = document.createElement("form");
        form.method = "POST";
        form.action = payfastData.url;

        for (const [key, value] of Object.entries(payfastData.formData)) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }

        clearCart();
        document.body.appendChild(form);
        form.submit();
      } else {
        clearCart();
        setStep("success");
      }
    } catch (err) {
      console.error("Order failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step !== "success") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Your cart is empty.</p>
          <button onClick={() => navigate("/catalog")} className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer">
            Browse products
          </button>
        </div>
      </main>
    );
  }

  if (step === "success") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-serif font-bold text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-4">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
          {paymentMethod === "eft" && (
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-sm text-left">
              <p className="font-medium text-foreground mb-2">Bank Transfer Details:</p>
              <p className="text-muted-foreground">Please transfer the total to the bank account details that will be emailed to you.</p>
              <p className="text-muted-foreground mt-1">Use your order number as the payment reference.</p>
            </div>
          )}
          <button onClick={() => navigate("/dashboard")} className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer">
            View My Orders
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">Checkout</h1>

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
          <div className="lg:col-span-2">
            {step === "shipping" ? (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleShippingSubmit} className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Shipping Details</h2>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Delivery Method</label>
                  <div className="flex gap-3 flex-wrap">
                    {[{ id: "pargo", label: "Pargo" }, { id: "paxi", label: "Paxi" }, { id: "courier", label: "The Courier Guy" }].map((m) => (
                      <button key={m.id} type="button" onClick={() => setShippingMethod(m.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${shippingMethod === m.id ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:bg-muted"}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                  <input required type="text" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                  <input required type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
                  <input required type="text" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                    <input required type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
                    <input required type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer mt-6">
                  Continue to Payment
                </button>
              </motion.form>
            ) : (
              <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handlePaymentSubmit} className="space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                <div className="space-y-3">
                  <button type="button" onClick={() => setPaymentMethod("payfast")}
                    className={`w-full p-4 rounded-xl border text-left transition-colors cursor-pointer ${paymentMethod === "payfast" ? "border-foreground bg-muted/50" : "border-border hover:bg-muted/30"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "payfast" ? "border-foreground" : "border-muted-foreground"}`}>
                        {paymentMethod === "payfast" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Pay with Card / EFT / SnapScan</p>
                        <p className="text-sm text-muted-foreground">Secure payment via PayFast — Visa, Mastercard, Instant EFT, SnapScan</p>
                      </div>
                    </div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod("eft")}
                    className={`w-full p-4 rounded-xl border text-left transition-colors cursor-pointer ${paymentMethod === "eft" ? "border-foreground bg-muted/50" : "border-border hover:bg-muted/30"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "eft" ? "border-foreground" : "border-muted-foreground"}`}>
                        {paymentMethod === "eft" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Direct Bank Transfer (EFT)</p>
                        <p className="text-sm text-muted-foreground">Pay via bank transfer — details provided after ordering</p>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep("shipping")} className="px-6 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors cursor-pointer">
                    Back
                  </button>
                  <button type="submit" disabled={isSubmitting}
                    className="flex-1 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? "Processing..." : paymentMethod === "payfast" ? (<>Pay with PayFast <ExternalLink className="h-4 w-4" /></>) : "Place Order"}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

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
