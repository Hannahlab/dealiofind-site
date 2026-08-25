import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, FileText, Users, CheckCircle, XCircle, Clock, Truck, Database } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "orders" | "content";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("orders");

  const orders = useQuery(api.orders.listAll);
  const allContent = useQuery(api.userContent.listAll);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const updateContentStatus = useMutation(api.userContent.updateStatus);
  const seedProducts = useMutation(api.products.seed);

  // Redirect non-admins
  if (user && user.role !== "admin") {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Access denied. Admin only.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-sm font-semibold text-foreground hover:underline cursor-pointer"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    );
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "shipped": return <Truck className="h-4 w-4 text-purple-500" />;
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>          <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-[#d4a574]/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#d4a574]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage orders, content, and products</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={async () => { const result = await seedProducts(); alert(result); }}
              className="px-4 py-2 rounded-lg bg-[#d4a574]/10 text-[#d4a574] text-sm font-medium hover:bg-[#d4a574]/20 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Seed Products
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-1">
          <button
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              tab === "orders"
                ? "text-foreground border-b-2 border-foreground bg-muted/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Orders ({orders?.length ?? 0})
          </button>
          <button
            onClick={() => setTab("content")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
              tab === "content"
                ? "text-foreground border-b-2 border-foreground bg-muted/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Content ({allContent?.length ?? 0})
          </button>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tab === "orders" && (
            <div>
              {orders === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {statusIcon(order.status)}
                          <span className="text-sm font-medium capitalize text-foreground">{order.status}</span>
                          <span className="text-xs text-muted-foreground">
                            Order from {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Customer info */}
                      <div className="bg-muted/50 rounded-lg p-3 mb-3 text-sm">
                        <p className="text-foreground font-medium">{order.shippingInfo.name}</p>
                        <p className="text-muted-foreground">{order.shippingInfo.email} · {order.shippingInfo.phone}</p>
                        <p className="text-muted-foreground">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                      </div>

                      {/* Items */}
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                            <div className="w-8 h-8 rounded overflow-hidden bg-[#f5ede4]">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {item.name} × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">Total: R{order.total}</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus({
                              orderId: order._id,
                              status: e.target.value as any,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "content" && (
            <div>
              {allContent === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl" />
                  ))}
                </div>
              ) : allContent.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No user content submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allContent.map((content) => (
                    <div key={content._id} className="border border-border rounded-xl p-4 flex items-start gap-4">
                      {content.imageUrl && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f5ede4] shrink-0">
                          <img src={content.imageUrl} alt={content.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{content.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{content.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {statusIcon(content.status)}
                          <span className="text-xs font-medium capitalize text-muted-foreground">{content.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {content.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateContentStatus({ contentId: content._id, status: "approved" })
                              }
                              className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateContentStatus({ contentId: content._id, status: "rejected" })
                              }
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
