import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import mockProducts from "../data/mockProducts";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({ totalUsers: 24, totalAdmins: 2, total: 26 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

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
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/products"),
        API.get("/orders")
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      // Local demo fallback with dynamic local registered users
      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const baseUsers = [
        { _id: "usr-admin", username: "admin", email: "admin@smartkrushi.com", role: "admin", createdAt: "2025-01-01" },
        { _id: "usr-shravani", username: "Shravani Mahajan", email: "shravanimahajan0744@gmail.com", role: "user", createdAt: "2025-02-14" },
        { _id: "usr-ramesh", username: "farmer_ramesh", email: "ramesh@gmail.com", role: "user", createdAt: "2025-01-10" },
        { _id: "usr-patil", username: "patil_krushi", email: "patil@yahoo.com", role: "user", createdAt: "2025-02-05" }
      ];

      // Merge base users with any newly registered users avoiding duplicates by email/username
      const combinedUsers = [...baseUsers];
      localUsers.forEach((lu) => {
        if (!combinedUsers.some((u) => u.email?.toLowerCase() === lu.email?.toLowerCase() || u.username?.toLowerCase() === lu.username?.toLowerCase())) {
          combinedUsers.push({
            _id: lu.id || "usr-" + Date.now(),
            username: lu.username,
            email: lu.email,
            role: lu.role || "user",
            createdAt: new Date().toISOString().split("T")[0]
          });
        }
      });

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
          createdAt: new Date().toISOString()
        },
        ...localOrders
      ];

      const localCustomProducts = JSON.parse(localStorage.getItem("mock_products") || "[]");
      const combinedProducts = localCustomProducts.length > 0 ? localCustomProducts : mockProducts;

      setUsers(combinedUsers);
      setProducts(combinedProducts);
      setOrders(defaultOrders);
      setStats({
        totalUsers: combinedUsers.filter(u => u.role !== "admin").length,
        totalAdmins: combinedUsers.filter(u => u.role === "admin").length,
        total: combinedUsers.length
      });
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
        <div className="admin-logo">
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
                      <h2>Recent Users</h2>
                      <button className="admin-view-all" onClick={() => setActiveTab("users")}>View All →</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(0, 5).map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div className="user-cell">
                                <div className="user-avatar-sm">{u.username[0].toUpperCase()}</div>
                                {u.username}
                              </div>
                            </td>
                            <td>{u.email}</td>
                            <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Recent Orders Table */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h2>Recent Orders</h2>
                      <button className="admin-view-all" onClick={() => setActiveTab("orders")}>View All →</button>
                    </div>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o._id}>
                            <td className="mono-cell">{o._id}</td>
                            <td>₹{o.totalAmount}</td>
                            <td><span className={`role-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                          </tr>
                        ))}
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
            {activeTab === "analytics" && (
              <div className="admin-analytics-tab">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h2>Reports & Analytics</h2>
                  </div>
                  <div style={{ padding: "2rem", textAlign: "center", color: "var(--admin-muted)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
                    <h3>Analytics Dashboard</h3>
                    <p style={{ marginTop: "0.5rem" }}>Detailed sales reports, popular products analysis, and stock overview will be available here soon.</p>
                  </div>
                </div>
              </div>
            )}
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
