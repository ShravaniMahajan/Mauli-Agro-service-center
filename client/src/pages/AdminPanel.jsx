import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({ totalUsers: 0, totalAdmins: 0, total: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
      showToast("Failed to load admin data", "error");
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
      showToast("User deleted successfully");
      fetchData();
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await API.patch(`/admin/users/${id}/role`, { role: newRole });
      showToast(`Role updated to ${newRole}`);
      fetchData();
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  // --- Product Handlers ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        stock: Number(productForm.stock)
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        showToast("Product updated successfully");
      } else {
        await API.post("/products", payload);
        showToast("Product added successfully");
      }

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
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save product", "error");
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await API.delete(`/products/${id}`);
      showToast("Product deleted successfully");
      fetchData();
    } catch {
      showToast("Failed to delete product", "error");
    }
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
      showToast("Failed to update status", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
            <span>📊</span> Dashboard
          </button>
          <button
            className={`admin-nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => { setActiveTab("users"); setSearch(""); }}
          >
            <span>👥</span> Manage Users
          </button>
          <button
            className={`admin-nav-item ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setSearch(""); }}
          >
            <span>🛍️</span> Manage Products
          </button>
          <button
            className={`admin-nav-item ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setSearch(""); }}
          >
            <span>📦</span> Manage Orders
          </button>
          <button
            className="admin-nav-item"
            onClick={() => navigate("/")}
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
                              <select
                                className="role-select"
                                value={u.role}
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                disabled={u._id === adminUser.id}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                className="admin-del-btn"
                                onClick={() => handleDelete(u._id)}
                                disabled={u._id === adminUser.id}
                                title="Delete user"
                              >
                                🗑️
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
                    <h2>Orders Log ({orders.length})</h2>
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
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td className="mono-cell">{o._id}</td>
                          <td>
                            <div className="user-info-cell">
                              <span><strong>{o.user?.username || "Unknown"}</strong></span>
                              <span style={{ fontSize: "0.75rem", color: "#888" }}>{o.user?.email}</span>
                            </div>
                          </td>
                          <td>
                            <div className="order-items-col">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="order-item-lbl">
                                  • {item.product?.name || "Product"} (x{item.quantity})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td><strong>₹{o.totalAmount}</strong></td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span className={`role-badge ${o.status.toLowerCase()}`}>
                              {o.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="order-status-select"
                              value={o.status}
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
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#aaa" }}>
                            No orders placed yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-modal-btn" onClick={() => setShowProductModal(false)}>✖</button>
            </div>
            
            <form onSubmit={productForm.price && productForm.mrp && productForm.stock ? handleProductSubmit : (e) => e.preventDefault()} className="modal-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Katyayani Insecticide"
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
                    placeholder="e.g. 50"
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
                ></textarea>
              </div>

              <button type="submit" className="submit-modal-btn">
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
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
