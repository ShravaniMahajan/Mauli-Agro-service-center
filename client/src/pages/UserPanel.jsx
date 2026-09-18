import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./UserPanel.css";

function UserPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          API.get("/users/profile"),
          API.get("/orders/my-orders")
        ]);
        setProfile(profileRes.data.user);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error("Error loading panel data:", err);
        setProfile(storedUser);

        // Fallback for offline / static hosting demo
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

        const currentEmail = (storedUser.email || "").trim().toLowerCase();
        const currentUsername = (storedUser.username || "").trim().toLowerCase();

        const userOrders = defaultOrders.filter((o) => {
          if (!o.user) return true;
          const orderEmail = (o.user.email || "").trim().toLowerCase();
          const orderUsername = (o.user.username || "").trim().toLowerCase();
          return (
            (currentEmail && orderEmail === currentEmail) ||
            (currentUsername && orderUsername === currentUsername) ||
            (!orderEmail && !orderUsername)
          );
        });

        setOrders(userOrders.length > 0 ? userOrders : defaultOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const user = profile || storedUser;
  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  const quickLinks = [
    { icon: "🏠", label: "Home", path: "/" },
    { icon: "🛍️", label: "Shop Store", path: "/products" },
    { icon: "⭐", label: "Product Reviews", path: "/products" },
    { icon: "🛒", label: "My Cart", path: "/cart" },
    { icon: "🌿", label: "Brands", path: "/brand" },
    { icon: "📞", label: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="user-panel-main">
        <div className="user-panel-container">
          {loading ? (
            <div className="up-loading">
              <div className="up-spinner"></div>
              <p>Loading your profile...</p>
            </div>
          ) : (
            <>
              {/* Profile Card */}
              <aside className="up-sidebar">
                <div className="up-profile-card">
                  <div className="up-avatar">{initials}</div>
                  <h2 className="up-username">{user.username}</h2>
                  <p className="up-email">{user.email}</p>
                  <span className="up-role-badge">{user.role || "user"}</span>

                  <div className="up-stats-row">
                    <div className="up-stat">
                      <span className="up-stat-num">{orders.length}</span>
                      <span className="up-stat-label">Orders</span>
                    </div>
                    <div className="up-stat-divider"></div>
                    <div className="up-stat">
                      <span className="up-stat-num">Active</span>
                      <span className="up-stat-label">Status</span>
                    </div>
                  </div>

                  <button className="up-logout-btn" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>

                {/* Quick Links */}
                <div className="up-quick-links">
                  <h3>Quick Navigation</h3>
                  <div className="up-links-grid">
                    {quickLinks.map((l) => (
                      <button
                        key={l.path}
                        className="up-link-btn"
                        onClick={() => navigate(l.path)}
                      >
                        <span>{l.icon}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Content Area */}
              <section className="up-content">
                {/* Tabs */}
                <div className="up-tabs">
                  <button
                    className={`up-tab ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    👤 Profile
                  </button>
                  <button
                    className={`up-tab ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                  >
                    📦 Order History
                  </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="up-profile-tab">
                    <div className="up-info-card">
                      <h3>Account Information</h3>
                      <div className="up-info-grid">
                        <div className="up-info-row">
                          <span className="up-info-label">👤 Username</span>
                          <span className="up-info-value">{user.username}</span>
                        </div>
                        <div className="up-info-row">
                          <span className="up-info-label">📧 Email</span>
                          <span className="up-info-value">{user.email}</span>
                        </div>
                        <div className="up-info-row">
                          <span className="up-info-label">🛡️ Role</span>
                          <span className="up-info-value capitalize">{user.role || "user"}</span>
                        </div>
                        <div className="up-info-row">
                          <span className="up-info-label">🔐 Auth</span>
                          <span className="up-info-value">JWT Token Active</span>
                        </div>
                        <div className="up-info-row">
                          <span className="up-info-label">🌐 Status</span>
                          <span className="up-info-value up-status-active">● Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Welcome Banner */}
                    <div className="up-welcome-banner">
                      <div className="up-banner-icon">🌾</div>
                      <div>
                        <h3>Welcome to Smart Krushi!</h3>
                        <p>
                          Explore premium agricultural products, expert agronomist
                          advice, and the latest farming solutions — all in one place.
                        </p>
                        <button
                          className="up-explore-btn"
                          onClick={() => navigate("/products")}
                        >
                          Explore Products →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders History Tab */}
                {activeTab === "orders" && (
                  <div className="up-orders-tab">
                    <div className="up-info-card">
                      <h3>Your Orders</h3>
                      {orders.length === 0 ? (
                        <div className="no-orders-box">
                          <p>You haven't placed any orders yet.</p>
                          <button className="explore-store-btn" onClick={() => navigate("/products")}>
                            Browse Products
                          </button>
                        </div>
                      ) : (
                        <div className="orders-list">
                          {orders.map((order) => (
                            <div key={order._id} className="user-order-card">
                              <div className="user-order-header">
                                <div>
                                  <span className="order-id-lbl">Order ID:</span>
                                  <span className="order-id-val">{order._id}</span>
                                </div>
                                <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </div>
                              
                              <div className="user-order-body">
                                <div className="order-items-summary">
                                  {order.items.map((item, idx) => {
                                    const itemName =
                                      item.name ||
                                      item.product?.name ||
                                      (typeof item.product === "string" ? item.product : "Product");
                                    return (
                                      <div key={idx} className="order-item-row">
                                        <span>{itemName} (x{item.quantity})</span>
                                        <span>₹{item.price * item.quantity}</span>
                                      </div>
                                    );
                                  })}
                                </div>

                                <div className="order-details-summary">
                                  <p><strong>Address:</strong> {order.shippingAddress}</p>
                                  <p><strong>Method:</strong> {order.paymentMethod}</p>
                                  <p><strong>Date:</strong> {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="user-order-footer">
                                <span>Total Paid:</span>
                                <span className="order-total-amount">₹{order.totalAmount}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}


              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserPanel;
