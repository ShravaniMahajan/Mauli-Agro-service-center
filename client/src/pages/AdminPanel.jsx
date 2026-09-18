import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import mockProducts from "../data/mockProducts";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({ totalUsers: 24, totalAdmins: 2, total: 26 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "dashboard");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Product Form states
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Seeds",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    image: ""
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const fetchData = async () => {
    try {
      let apiUsers = [];
      let apiOrders = [];
      let apiProducts = [];
      let apiStats = null;

      try {
        const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/users"),
          API.get("/products"),
          API.get("/orders")
        ]);
        apiStats = statsRes.data;
        apiUsers = usersRes.data.users || [];
        apiProducts = productsRes.data || [];
        apiOrders = ordersRes.data || [];
      } catch (e) {
        console.log("API fetch error or offline, syncing with local storage:", e);
      }

      // Base seed users
      const baseUsers = [
        { _id: "usr-admin", username: "admin", email: "admin@smartkrushi.com", role: "admin", createdAt: "2025-01-01", lastLogin: "2025-01-01" },
        { _id: "usr-shravani", username: "Shravani Mahajan", email: "shravanimahajan0744@gmail.com", role: "user", createdAt: "2025-02-14", lastLogin: "2025-02-14" },
        { _id: "usr-ramesh", username: "farmer_ramesh", email: "ramesh@gmail.com", role: "user", createdAt: "2025-01-10", lastLogin: "2025-01-10" },
        { _id: "usr-patil", username: "patil_krushi", email: "patil@yahoo.com", role: "user", createdAt: "2025-02-05", lastLogin: "2025-02-05" }
      ];

      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");

      // Merge all users: apiUsers + localUsers + baseUsers
      const combinedUsersMap = new Map();

      // Put API users
      apiUsers.forEach((u) => {
        const key = (u.email || u.username || u._id || "").toLowerCase().trim();
        if (key) combinedUsersMap.set(key, u);
      });

      // Overlay / add local users (has newest lastLogin info)
      localUsers.forEach((lu) => {
        const key = (lu.email || lu.username || lu.id || lu._id || "").toLowerCase().trim();
        if (key) {
          const existing = combinedUsersMap.get(key) || {};
          combinedUsersMap.set(key, {
            _id: lu._id || lu.id || existing._id || "usr-" + Date.now(),
            ...existing,
            ...lu,
            lastLogin: lu.lastLogin || lu.createdAt || existing.lastLogin || existing.createdAt
          });
        }
      });

      // Add base users if not already present
      baseUsers.forEach((bu) => {
        const key = (bu.email || bu.username).toLowerCase().trim();
        if (!combinedUsersMap.has(key)) {
          combinedUsersMap.set(key, bu);
        }
      });

      const finalUsers = Array.from(combinedUsersMap.values()).sort((a, b) => {
        const timeA = new Date(a.lastLogin || a.createdAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.lastLogin || b.createdAt || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });

      // Orders Merge
      const localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
      const defaultOrders = [
        {
          _id: "ord-101",
          user: { username: "Shravani Mahajan", email: "shravanimahajan0744@gmail.com" },
          items: [{ name: "Super Hybrid Wheat Seeds (SH-40)", quantity: 2, price: 550 }],
          totalAmount: 1100,
          shippingAddress: "Plot 14, Main Road, Aitawade Budruk, Sangli",
          paymentMethod: "Cash on Delivery",
          status: "Delivered",
          createdAt: "2025-02-15T14:20:00.000Z"
        }
      ];

      const combinedOrdersMap = new Map();
      apiOrders.forEach((o) => {
        const orderId = o._id || o.id;
        if (orderId) combinedOrdersMap.set(orderId, o);
      });
      localOrders.forEach((o) => {
        const orderId = o._id || o.id;
        if (orderId) combinedOrdersMap.set(orderId, o);
      });
      defaultOrders.forEach((o) => {
        if (!combinedOrdersMap.has(o._id)) {
          combinedOrdersMap.set(o._id, o);
        }
      });

      const finalOrders = Array.from(combinedOrdersMap.values()).sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      // Products Merge
      const localCustomProducts = JSON.parse(localStorage.getItem("mock_products") || "[]");
      const finalProducts = apiProducts.length > 0 ? apiProducts : (localCustomProducts.length > 0 ? localCustomProducts : mockProducts);

      setUsers(finalUsers);
      setOrders(finalOrders);
      setProducts(finalProducts);
      setStats({
        totalUsers: finalUsers.filter(u => u.role !== "admin").length,
        totalAdmins: finalUsers.filter(u => u.role === "admin").length,
        total: finalUsers.length
      });
    } catch (err) {
      console.error("fetchData total failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- User Handlers ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
    } catch {
      // offline fallback
      const updated = users.filter((u) => u._id !== id);
      setUsers(updated);
      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]").filter((u) => u.id !== id && u._id !== id);
      localStorage.setItem("mock_users", JSON.stringify(localUsers));
    }
    showToast("User deleted successfully");
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role: newRole });
    } catch {
      // offline fallback
      const updated = users.map((u) => (u._id === id ? { ...u, role: newRole } : u));
      setUsers(updated);
    }
    showToast(`Role updated to ${newRole}`);
  };

  // --- Product Handlers ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      _id: editingProduct ? editingProduct._id : "prod-custom-" + Date.now(),
      ...productForm,
      price: Number(productForm.price),
      mrp: Number(productForm.mrp),
      stock: Number(productForm.stock),
      rating: editingProduct?.rating || 5.0,
      numReviews: editingProduct?.numReviews || 0
    };

    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
      } else {
        await API.post("/products", payload);
      }
    } catch (err) {
      // offline fallback
      let updatedProducts = [...products];
      if (editingProduct) {
        updatedProducts = updatedProducts.map((p) => (p._id === editingProduct._id ? payload : p));
      } else {
        updatedProducts.unshift(payload);
      }
      setProducts(updatedProducts);
      localStorage.setItem("mock_products", JSON.stringify(updatedProducts));
    }

    showToast(editingProduct ? "Product updated successfully" : "Product added successfully");
    setProductForm({
      name: "",
      category: "Seeds",
      description: "",
      price: "",
      mrp: "",
      stock: "",
      image: ""
    });
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await API.delete(`/products/${id}`);
    } catch {
      const updated = products.filter((p) => p._id !== id);
      setProducts(updated);
      localStorage.setItem("mock_products", JSON.stringify(updated));
    }
    showToast("Product deleted successfully");
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      image: product.image
    });
    setShowProductModal(true);
  };

  const handleAddNewProductClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Seeds",
      description: "",
      price: "",
      mrp: "",
      stock: "",
      image: ""
    });
    setShowProductModal(true);
  };

  // --- Order Handlers ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      // offline fallback
      const updatedOrders = orders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      );
      setOrders(updatedOrders);
      const localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
      const updatedLocal = localOrders.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem("mock_orders", JSON.stringify(updatedLocal));
      showToast(`Order status updated to ${newStatus}`);
    }
  };

  // --- Review Handlers ---
  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to remove this review?")) return;
    try {
      await API.delete(`/products/${productId}/reviews/${reviewId}`);
    } catch (err) {
      console.warn("API delete review error, updating local state", err);
    }
    const updatedProducts = products.map((p) => {
      if (p._id === productId) {
        const filteredReviews = (p.reviews || []).filter(
          (r) => (r._id || r.id)?.toString() !== reviewId?.toString()
        );
        const newRating = filteredReviews.length
          ? Number((filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1))
          : 5.0;
        return {
          ...p,
          reviews: filteredReviews,
          numReviews: filteredReviews.length,
          rating: newRating
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("mock_products", JSON.stringify(updatedProducts));
    showToast("Review deleted successfully");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.status?.toLowerCase().includes(search.toLowerCase()) ||
      o.items?.some((i) => (i.name || i.product?.name || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }} title="Go to Storefront">
          <span className="admin-logo-icon">🌿</span>
          <div>
            <div className="admin-logo-title">Smart Krushi</div>
            <div className="admin-logo-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => { setActiveTab("dashboard"); setSearch(""); }}
          >
            <span>🛡️</span> Admin Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setSearch(""); }}
          >
            <span>📦</span> Manage Products
          </button>
          <button
            className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setSearch(""); }}
          >
            <span>📋</span> Manage Orders
          </button>
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => { setActiveTab("users"); setSearch(""); }}
          >
            <span>👥</span> Manage Users
          </button>
          <button
            className={`admin-nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => { setActiveTab("analytics"); setSearch(""); }}
          >
            <span>📊</span> Reports / Analytics
          </button>
          <button
            className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => { setActiveTab("reviews"); setSearch(""); }}
          >
            <span>⭐</span> Customer Ratings & Reviews
          </button>
          <button
            className="admin-nav-item"
            onClick={() => navigate("/")}
            title="Go to main store"
          >
            <span>🏠</span> Go to Site
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-mini">
            <div className="admin-avatar">{adminUser.username?.[0]?.toUpperCase() || "A"}</div>
            <div>
              <div className="admin-profile-name">{adminUser.username}</div>
              <div className="admin-profile-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div>
            <h1 className="admin-page-title">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "users" && "Manage User Accounts"}
              {activeTab === "products" && "Product Catalog Management"}
              {activeTab === "orders" && "Customer Orders Management"}
              {activeTab === "analytics" && "Reports & Analytics"}
              {activeTab === "reviews" && "Customer Ratings & Reviews"}
            </h1>
            <p className="admin-page-sub">Welcome back, {adminUser.username} 👋</p>
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-refresh-btn" onClick={fetchData}>🔄 Refresh</button>
          </div>
        </header>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading admin panel data...</p>
          </div>
        ) : (
          <>
            {/* --- DASHBOARD TAB --- */}
            {activeTab === "dashboard" && (
              <div className="admin-dashboard-tab">
                <div className="admin-stats-grid">
                  <div className="admin-stat-card green">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <div className="stat-num">{stats.total}</div>
                      <div className="stat-label">Total Accounts</div>
                    </div>
                  </div>
                  <div className="admin-stat-card blue">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-info">
                      <div className="stat-num">{products.length}</div>
                      <div className="stat-label">Total Products</div>
                    </div>
                  </div>
                  <div className="admin-stat-card purple">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                      <div className="stat-num">{orders.length}</div>
                      <div className="stat-label">Total Orders</div>
                    </div>
                  </div>
                  <div className="admin-stat-card orange">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                      <div className="stat-num">
                        ₹{orders.filter(o => o.status !== "Cancelled").reduce((acc, o) => acc + o.totalAmount, 0)}
                      </div>
                      <div className="stat-label">Revenue (Excl. Cancelled)</div>
                    </div>
                  </div>
                </div>

                <div className="admin-double-card-row">
                  {/* Recent Users Table */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h2>Recent Users ({users.length})</h2>
                      <button className="admin-view-all" onClick={() => setActiveTab("users")}>View All →</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map((u) => {
                          const dateVal = u.lastLogin || u.createdAt;
                          const dateStr = dateVal ? new Date(dateVal).toLocaleDateString() : "Active";
                          return (
                            <tr key={u._id || u.id}>
                              <td>
                                <div className="user-cell">
                                  <div className="user-avatar-sm">{(u.username || "U")[0].toUpperCase()}</div>
                                  <span>{u.username}</span>
                                </div>
                              </td>
                              <td>{u.email}</td>
                              <td><span className={`role-badge ${u.role || "user"}`}>{u.role || "user"}</span></td>
                              <td style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{dateStr}</td>
                            </tr>
                          );
                        })}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: "1.5rem", color: "#888" }}>
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Recent Orders Table */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h2>Recent Orders ({orders.length})</h2>
                      <button className="admin-view-all" onClick={() => setActiveTab("orders")}>View All →</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => {
                          const statusNormalized = o.status
                            ? o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()
                            : "Pending";
                          const customerName = o.user?.username || o.user?.name || (typeof o.user === "string" ? o.user : "Customer");
                          const customerEmail = o.user?.email || "";

                          return (
                            <tr key={o._id || o.id}>
                              <td className="mono-cell">{o._id || o.id}</td>
                              <td>
                                <div className="user-info-cell">
                                  <span><strong>{customerName}</strong></span>
                                  {customerEmail && <span style={{ fontSize: "0.75rem", color: "#888" }}>{customerEmail}</span>}
                                </div>
                              </td>
                              <td><strong>₹{o.totalAmount}</strong></td>
                              <td><span className={`role-badge ${statusNormalized.toLowerCase()}`}>{statusNormalized}</span></td>
                            </tr>
                          );
                        })}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: "1.5rem", color: "#888" }}>
                              No orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* --- USERS TAB --- */}
            {activeTab === "users" && (
              <div className="admin-users-tab">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>All Users ({filteredUsers.length})</h2>
                    <div className="admin-search-wrap">
                      <span>🔍</span>
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u._id}>
                          <td>{i + 1}</td>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-sm">{u.username[0].toUpperCase()}</div>
                              {u.username}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                          <td>
                            <div className="admin-actions">
                              <button
                                className="admin-del-btn"
                                onClick={() => handleDelete(u._id)}
                                disabled={u._id === adminUser.id || u.role === "admin"}
                                title="Delete user"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- PRODUCTS TAB --- */}
            {activeTab === "products" && (
              <div className="admin-products-tab">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Products Inventory ({filteredProducts.length})</h2>
                    <div className="header-actions-row">
                      <div className="admin-search-wrap">
                        <span>🔍</span>
                        <input
                          type="text"
                          placeholder="Search product..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="admin-search-input"
                        />
                      </div>
                      <button className="add-prod-btn" onClick={handleAddNewProductClick}>
                        ➕ Add Product
                      </button>
                    </div>
                  </div>

                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>MRP</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <img
                              src={p.image}
                              alt={p.name}
                              className="table-prod-img"
                              onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
                            />
                          </td>
                          <td>
                            <div className="prod-name-cell">
                              <strong>{p.name}</strong>
                              <span className="prod-desc-cell">{p.description.substring(0, 50)}...</span>
                            </div>
                          </td>
                          <td><span className="p-cat-label">{p.category}</span></td>
                          <td>₹{p.price}</td>
                          <td>₹{p.mrp}</td>
                          <td>
                            <span className={`stock-lbl ${p.stock <= 0 ? "out" : p.stock < 10 ? "low" : "ok"}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td>
                            <div className="admin-actions">
                              <button className="edit-action-btn" onClick={() => handleEditProductClick(p)}>
                                ✏️ Edit
                              </button>
                              <button className="delete-action-btn" onClick={() => handleProductDelete(p._id)}>
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- ORDERS TAB --- */}
            {activeTab === "orders" && (
              <div className="admin-orders-tab">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Orders Log ({filteredOrders.length})</h2>
                    <div className="admin-search-wrap">
                      <span>🔍</span>
                      <input
                        type="text"
                        placeholder="Search orders, customers, items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search-input"
                      />
                    </div>
                  </div>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items & Quantity</th>
                        <th>Total Paid</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => {
                        const statusNormalized = o.status
                          ? o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase()
                          : "Pending";

                        return (
                          <tr key={o._id}>
                            <td className="mono-cell">{o._id}</td>
                            <td>
                              <div className="user-info-cell">
                                <span><strong>{o.user?.username || "Unknown"}</strong></span>
                                <span style={{ fontSize: "0.75rem", color: "#888" }}>{o.user?.email || "N/A"}</span>
                              </div>
                            </td>
                            <td>
                              <div className="order-items-col">
                                {o.items?.map((item, idx) => {
                                  const itemName =
                                    item.name ||
                                    item.product?.name ||
                                    (typeof item.product === "string" ? item.product : "Product");
                                  return (
                                    <div key={idx} className="order-item-lbl">
                                      • {itemName} (x{item.quantity})
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                            <td><strong>₹{o.totalAmount}</strong></td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>
                              <span className={`role-badge ${statusNormalized.toLowerCase()}`}>
                                {statusNormalized}
                              </span>
                            </td>
                            <td>
                              <select
                                className="order-status-select"
                                value={statusNormalized}
                                onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- ANALYTICS TAB --- */}
            {activeTab === "analytics" && (() => {
              // Calculate Analytics Data
              const validOrders = orders.filter(o => o.status !== "Cancelled");
              const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
              const totalItemsSold = validOrders.reduce((sum, o) => {
                return sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) : 0);
              }, 0);
              const avgOrderValue = validOrders.length > 0 ? (totalRevenue / validOrders.length).toFixed(2) : 0;
              
              // Top Products
              const productSales = {};
              validOrders.forEach(o => {
                if (o.items) {
                  o.items.forEach(item => {
                    const name = item.name || item.product?.name || item.product || "Unknown";
                    productSales[name] = (productSales[name] || 0) + (item.quantity || 1);
                  });
                }
              });
              const topProducts = Object.entries(productSales)
                .map(([name, qty]) => ({ name, qty }))
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 5);

              // Low Stock
              const lowStockProducts = products
                .filter(p => p.stock <= 20)
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 5);

              // Order Status
              const statusCounts = orders.reduce((acc, o) => {
                const status = o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase() : "Pending";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              }, {});

              return (
                <div className="admin-analytics-tab">
                  {/* Summary Cards */}
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card green">
                      <div className="stat-icon">📈</div>
                      <div className="stat-info">
                        <div className="stat-num">₹{totalRevenue.toLocaleString()}</div>
                        <div className="stat-label">Total Revenue</div>
                      </div>
                    </div>
                    <div className="admin-stat-card blue">
                      <div className="stat-icon">🛍️</div>
                      <div className="stat-info">
                        <div className="stat-num">{validOrders.length}</div>
                        <div className="stat-label">Successful Orders</div>
                      </div>
                    </div>
                    <div className="admin-stat-card purple">
                      <div className="stat-icon">🛒</div>
                      <div className="stat-info">
                        <div className="stat-num">{totalItemsSold}</div>
                        <div className="stat-label">Items Sold</div>
                      </div>
                    </div>
                    <div className="admin-stat-card orange">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <div className="stat-num">₹{avgOrderValue}</div>
                        <div className="stat-label">Avg. Order Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-double-card-row" style={{ marginTop: "1.5rem" }}>
                    {/* Top Products */}
                    <div className="admin-card">
                      <div className="admin-card-header">
                        <h2>Top Selling Products</h2>
                      </div>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Quantity Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topProducts.length > 0 ? topProducts.map((p, idx) => (
                            <tr key={idx}>
                              <td>{p.name}</td>
                              <td><span className="stock-lbl ok">{p.qty} units</span></td>
                            </tr>
                          )) : (
                            <tr><td colSpan="2" style={{ textAlign: "center", color: "#888" }}>No sales data available</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="admin-card">
                      <div className="admin-card-header">
                        <h2>Low Stock Alerts</h2>
                        <button className="admin-view-all" onClick={() => setActiveTab("products")}>Manage →</button>
                      </div>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Current Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
                            <tr key={p._id}>
                              <td>{p.name}</td>
                              <td>
                                <span className={`stock-lbl ${p.stock <= 0 ? "out" : "low"}`}>
                                  {p.stock} units
                                </span>
                              </td>
                            </tr>
                          )) : (
                            <tr><td colSpan="2" style={{ textAlign: "center", color: "#888" }}>All products are well stocked</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Order Status Breakdown */}
                  <div className="admin-card" style={{ marginTop: "1.5rem" }}>
                    <div className="admin-card-header">
                      <h2>Order Status Breakdown</h2>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", padding: "1.5rem", flexWrap: "wrap" }}>
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} style={{
                          flex: 1, minWidth: "150px", padding: "1rem", 
                          background: "var(--admin-bg)", borderRadius: "10px",
                          border: "1px solid var(--admin-border)", textAlign: "center"
                        }}>
                          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--admin-text)" }}>{count}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)", marginTop: "0.5rem" }}>{status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* --- REVIEWS & RATINGS TAB --- */}
            {activeTab === "reviews" && (() => {
              // Flatten all reviews from products
              const allReviews = products.flatMap((p) =>
                (p.reviews || []).map((r) => ({
                  ...r,
                  productId: p._id,
                  productName: p.name,
                  productImage: p.image,
                  productCategory: p.category
                }))
              );

              // Calculate overall metrics
              const totalReviewCount = allReviews.length;
              const avgScore = totalReviewCount
                ? (allReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / totalReviewCount).toFixed(1)
                : "5.0";
              const fiveStarCount = allReviews.filter((r) => r.rating === 5).length;
              const positivePercent = totalReviewCount
                ? Math.round((allReviews.filter((r) => r.rating >= 4).length / totalReviewCount) * 100)
                : 100;

              // Filtered reviews by search
              const filteredReviews = allReviews.filter((r) => {
                const term = search.toLowerCase();
                return (
                  (r.username || "").toLowerCase().includes(term) ||
                  (r.productName || "").toLowerCase().includes(term) ||
                  (r.comment || "").toLowerCase().includes(term)
                );
              });

              return (
                <div className="admin-reviews-tab">
                  {/* Reviews Stats Row */}
                  <div className="admin-stats-grid">
                    <div className="admin-stat-card green">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-info">
                        <div className="stat-num">{avgScore} / 5.0</div>
                        <div className="stat-label">Average Store Rating</div>
                      </div>
                    </div>
                    <div className="admin-stat-card blue">
                      <div className="stat-icon">💬</div>
                      <div className="stat-info">
                        <div className="stat-num">{totalReviewCount}</div>
                        <div className="stat-label">Total Customer Reviews</div>
                      </div>
                    </div>
                    <div className="admin-stat-card purple">
                      <div className="stat-icon">🌟</div>
                      <div className="stat-info">
                        <div className="stat-num">{fiveStarCount}</div>
                        <div className="stat-label">5-Star Ratings</div>
                      </div>
                    </div>
                    <div className="admin-stat-card orange">
                      <div className="stat-icon">📈</div>
                      <div className="stat-info">
                        <div className="stat-num">{positivePercent}%</div>
                        <div className="stat-label">Positive Sentiment (≥4★)</div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Card & List */}
                  <div className="admin-card" style={{ marginTop: "1.5rem" }}>
                    <div className="admin-card-header">
                      <div>
                        <h2>Customer Ratings & Feedback</h2>
                        <p style={{ fontSize: "0.82rem", color: "var(--admin-muted)", margin: 0 }}>
                          Showing {filteredReviews.length} of {totalReviewCount} verified reviews
                        </p>
                      </div>
                      <div className="admin-actions-row">
                        <input
                          type="text"
                          className="admin-search-input"
                          placeholder="Search reviewer, product, or comment..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    {filteredReviews.length === 0 ? (
                      <div style={{ padding: "3rem", textAlign: "center", color: "var(--admin-muted)" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>⭐</div>
                        <p>No customer reviews found matching your search.</p>
                      </div>
                    ) : (
                      <div className="admin-reviews-list">
                        {filteredReviews.map((rev, idx) => (
                          <div key={rev._id || idx} className="admin-review-item">
                            <div className="review-product-thumb">
                              <img src={rev.productImage} alt={rev.productName} />
                            </div>
                            <div className="review-main-content">
                              <div className="review-top-row">
                                <div>
                                  <h4 className="review-product-title">{rev.productName}</h4>
                                  <span className="review-category-badge">{rev.productCategory}</span>
                                </div>
                                <div className="review-stars-badge">
                                  {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                  <span className="review-score-num">({rev.rating}/5)</span>
                                </div>
                              </div>
                              <p className="review-comment-text">"{rev.comment}"</p>
                              <div className="review-author-meta">
                                <span>👤 <strong>{rev.username}</strong></span>
                                {rev.userEmail && <span>📧 {rev.userEmail}</span>}
                                <span>📅 {new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="review-action-col">
                              <button
                                className="action-btn delete"
                                title="Delete Review"
                                onClick={() => handleDeleteReview(rev.productId, rev._id || rev.id)}
                              >
                                🗑️ Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          </>
        )}
      </main>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="modal-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <button
                  type="button"
                  className="modal-back-btn"
                  onClick={() => setShowProductModal(false)}
                  title="Go back to products list"
                >
                  <span className="back-arrow-icon">←</span> Back
                </button>
                <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowProductModal(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={productForm.price && productForm.mrp && productForm.stock ? handleProductSubmit : (e) => e.preventDefault()} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Super Hybrid Wheat Seeds (SH-40)"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizers">Fertilizers</option>
                    <option value="Pesticides">Pesticides</option>
                    <option value="Herbicides">Herbicides</option>
                    <option value="Fungicides">Fungicides</option>
                    <option value="Insecticides">Insecticides</option>
                    <option value="Animal Feed">Animal Feed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 100"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 450"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>MRP (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 600"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://domain.com/image.jpg"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea
                  required
                  placeholder="Describe product uses, application rates..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="cancel-modal-btn"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-modal-btn">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
