import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { LogOut, Package, Upload, User, Plus, Trash2, Clock, CheckCircle, XCircle, Truck, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Tab = "orders" | "content" | "account" | "profile";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === "owner" || user?.role === "admin";
  const [tab, setTab] = useState<Tab>(isStaff ? "orders" : "profile");
  const orders = useQuery(api.orders.listByUser);
  const userContent = useQuery(api.userContent.listByUser);
  const createContent = useMutation(api.userContent.create);
  const removeContent = useMutation(api.userContent.remove);
  const updateProfile = useMutation(api.users.updateProfile);

  const [contentForm, setContentForm] = useState({ title: "", description: "", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    province: user?.province || "",
    postalCode: user?.postalCode || "",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync profile form when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        province: user.province || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createContent(contentForm);
      setContentForm({ title: "", description: "", imageUrl: "" });
    } catch (err) {
      console.error("Failed to create content:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await removeContent({ contentId } as any);
    } catch (err) {
      console.error("Failed to delete content:", err);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(profileForm);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = isStaff
    ? [
        { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
        { id: "orders", label: "My Orders", icon: <Package className="h-4 w-4" /> },
        { id: "content", label: "My Content", icon: <Upload className="h-4 w-4" /> },
        { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
      ]
    : [
        { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
        { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
      ];

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">My Account</p>
            <h1 className="mt-1 text-3xl font-serif font-bold tracking-tight text-foreground">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            {isStaff && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-[#d4a574]/20 text-[#d4a574] capitalize">
                {user?.role}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {isStaff && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors cursor-pointer whitespace-nowrap ${
                tab === t.id
                  ? "text-foreground border-b-2 border-foreground bg-muted/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── Profile Tab ── */}
          {tab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Personal Information</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Update your details for faster checkout. This information will be pre-filled when you place an order.
              </p>
              <form onSubmit={handleProfileSave} className="border border-border rounded-xl p-6 space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                      placeholder="e.g. 082 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                      placeholder="Cape Town"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Province</label>
                    <input
                      type="text"
                      value={profileForm.province}
                      onChange={(e) => setProfileForm({ ...profileForm, province: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                      placeholder="Western Cape"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={profileForm.postalCode}
                      onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                      placeholder="8001"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </button>
                  {profileSaved && (
                    <span className="text-sm text-green-600 font-medium">Profile saved!</span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ── Orders Tab ── */}
          {tab === "orders" && isStaff && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">My Orders</h2>
              {orders === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted rounded-xl" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet.</p>
                  <button
                    onClick={() => navigate("/catalog")}
                    className="mt-3 text-sm font-semibold text-foreground hover:underline cursor-pointer"
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-border rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {statusIcon(order.status)}
                          <span className="text-sm font-medium capitalize text-foreground">{order.status}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
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
                      <div className="mt-3 text-right">
                        <span className="text-sm font-bold text-foreground">Total: R{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Content Tab ── */}
          {tab === "content" && isStaff && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">My Content</h2>
              <form onSubmit={handleContentSubmit} className="border border-border rounded-xl p-5 mb-6 space-y-4">
                <h3 className="font-medium text-foreground">Upload New Content</h3>
                <input
                  required type="text" placeholder="Title"
                  value={contentForm.title}
                  onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                />
                <textarea
                  required placeholder="Description" rows={3}
                  value={contentForm.description}
                  onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50 resize-none"
                />
                <input
                  type="url" placeholder="Image URL (optional)"
                  value={contentForm.imageUrl}
                  onChange={(e) => setContentForm({ ...contentForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a574]/50"
                />
                <button
                  type="submit" disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {isSubmitting ? "Uploading..." : "Upload Content"}
                </button>
              </form>

              {userContent === undefined ? (
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded-xl" />)}
                </div>
              ) : userContent.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No content uploaded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userContent.map((content) => (
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
                      <button
                        onClick={() => handleDeleteContent(content._id)}
                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Account Tab ── */}
          {tab === "account" && (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Account Details</h2>
              <div className="border border-border rounded-xl p-6 space-y-4 max-w-lg">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <p className="text-foreground font-medium">{user?.name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium">{user?.email || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Role</label>
                  <p className="text-foreground font-medium capitalize">{user?.role || "user"}</p>
                </div>
                {user?.phone && (
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="text-foreground font-medium">{user.phone}</p>
                  </div>
                )}
                {user?.address && (
                  <div>
                    <label className="text-sm text-muted-foreground">Address</label>
                    <p className="text-foreground font-medium">{user.address}, {user.city} {user.province} {user.postalCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
