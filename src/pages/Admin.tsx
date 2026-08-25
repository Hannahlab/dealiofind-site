import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import {
  ArrowLeft, Package, FileText, Users, CheckCircle, XCircle,
  Clock, Truck, Database, Plus, Pencil, Trash2, Save, X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "orders" | "content" | "products";

const emptyProduct = {
  name: "",
  price: 0,
  description: "",
  category: "",
  image: "",
  bgColor: "bg-[#f5ede4]",
  inStock: true,
  featured: false,
  special: false,
  metaDescription: "",
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  const orders = useQuery(api.orders.listAll);
  const allContent = useQuery(api.userContent.listAll);
  const allProducts = useQuery(api.products.list, {});
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const updateContentStatus = useMutation(api.userContent.updateStatus);
  const seedProducts = useMutation(api.products.seed);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof emptyProduct>(emptyProduct);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<typeof emptyProduct>(emptyProduct);

  const isStaff = user?.role === "owner" || user?.role === "admin";

  // Redirect non-staff
  if (user && !isStaff) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Access denied. Owner or Admin only.</p>
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

  if (!isStaff) return null;

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

  const startEdit = (product: any) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      bgColor: product.bgColor || "bg-[#f5ede4]",
      inStock: product.inStock ?? true,
      featured: product.featured ?? false,
      special: product.special ?? false,
      metaDescription: product.metaDescription || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct({ productId: editingProduct as any, ...editForm });
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(addForm);
      setAddForm(emptyProduct);
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct({ productId: productId as any });
    } catch (err) {
      console.error("Failed to delete product:", err);
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
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-[#d4a574]/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#d4a574]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage orders, content, and products</p>
          </div>
          <div className="ml-auto flex gap-2">
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
          {([
            { id: "products" as Tab, icon: <Package className="h-4 w-4" />, label: "Products", count: allProducts?.length ?? 0 },
            { id: "orders" as Tab, icon: <Package className="h-4 w-4" />, label: "Orders", count: orders?.length ?? 0 },
            { id: "content" as Tab, icon: <FileText className="h-4 w-4" />, label: "Content", count: allContent?.length ?? 0 },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
                tab === t.id
                  ? "text-foreground border-b-2 border-foreground bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Products Tab ── */}
          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">All Products</h2>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>

              {/* Add Product Form */}
              {isAdding && (
                <form onSubmit={handleAddProduct} className="border border-border rounded-xl p-5 mb-6 space-y-4 bg-muted/30">
                  <h3 className="font-medium text-foreground">New Product</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required placeholder="Product name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                    <input required type="number" placeholder="Price (R)" value={addForm.price || ""} onChange={(e) => setAddForm({ ...addForm, price: Number(e.target.value) })}
                      className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                    <input required placeholder="Category" value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                    <input required placeholder="Image URL" value={addForm.image} onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                  </div>
                  <textarea required placeholder="Description" rows={3} value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50 resize-none" />
                  <input placeholder="SEO meta description (for Google)" value={addForm.metaDescription} onChange={(e) => setAddForm({ ...addForm, metaDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addForm.inStock} onChange={(e) => setAddForm({ ...addForm, inStock: e.target.checked })} className="rounded" />In Stock</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addForm.featured} onChange={(e) => setAddForm({ ...addForm, featured: e.target.checked })} className="rounded" />Featured</label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={addForm.special} onChange={(e) => setAddForm({ ...addForm, special: e.target.checked })} className="rounded" />Special</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">Save Product</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors cursor-pointer">Cancel</button>
                  </div>
                </form>
              )}

              {/* Product list */}
              {allProducts === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
                </div>
              ) : allProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No products yet. Click "Add Product" or "Seed Products".</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allProducts.map((product) => (
                    <div key={product._id} className="border border-border rounded-xl p-4">
                      {editingProduct === product._id ? (
                        /* Edit mode */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input placeholder="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                            <input type="number" placeholder="Price" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                            <input placeholder="Category" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                            <input placeholder="Image URL" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                          </div>
                          <textarea placeholder="Description" rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50 resize-none" />
                          <input placeholder="SEO meta description" value={editForm.metaDescription} onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50" />
                          <div className="flex gap-4 flex-wrap">
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editForm.inStock} onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })} className="rounded" />In Stock</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editForm.featured} onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })} className="rounded" />Featured</label>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editForm.special} onChange={(e) => setEditForm({ ...editForm, special: e.target.checked })} className="rounded" />Special</label>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleSaveEdit} className="px-4 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors cursor-pointer flex items-center gap-1">
                              <Save className="h-3 w-3" />Save
                            </button>
                            <button onClick={() => setEditingProduct(null)} className="px-4 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 transition-colors cursor-pointer flex items-center gap-1">
                              <X className="h-3 w-3" />Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* View mode */
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-lg overflow-hidden ${product.bgColor || "bg-[#f5ede4]"} shrink-0`}>
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">R{product.price} · {product.category}</p>
                            <div className="flex gap-2 mt-1">
                              {product.featured && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600">Featured</span>}
                              {product.special && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600">Special</span>}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => startEdit(product)} className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer text-muted-foreground hover:text-foreground">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Orders Tab ── */}
          {tab === "orders" && (
            <div>
              {orders === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}
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

                      <div className="bg-muted/50 rounded-lg p-3 mb-3 text-sm">
                        <p className="text-foreground font-medium">{order.shippingInfo.name}</p>
                        <p className="text-muted-foreground">{order.shippingInfo.email} · {order.shippingInfo.phone}</p>
                        <p className="text-muted-foreground">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                      </div>

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
                          onChange={(e) => updateOrderStatus({ orderId: order._id, status: e.target.value as any })}
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

          {/* ── Content Tab ── */}
          {tab === "content" && (
            <div>
              {allContent === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl" />)}
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
                              onClick={() => updateContentStatus({ contentId: content._id, status: "approved" })}
                              className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-xs font-medium hover:bg-green-500/20 transition-colors cursor-pointer"
                            >Approve</button>
                            <button
                              onClick={() => updateContentStatus({ contentId: content._id, status: "rejected" })}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
                            >Reject</button>
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
