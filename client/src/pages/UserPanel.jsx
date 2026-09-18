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

  // Synchronize tab if user navigates or clicks dropdown menu item while already on this page
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: ""
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState({
    show: false,
    orderId: "",
    productName: "",
    productId: "",
    rating: 5,
    comment: "",
    submitting: false
  });
  const [ratingToast, setRatingToast] = useState({ show: false, msg: "", type: "success" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiProfile = null;
        let apiOrders = [];
        try {
          const [profileRes, ordersRes] = await Promise.all([
            API.get("/users/profile"),
            API.get("/orders/my-orders")
          ]);
          apiProfile = profileRes.data?.user;
          apiOrders = ordersRes.data || [];
        } catch (err) {
          console.log("API profile/orders fallback to local:", err);
        }

        const effectiveProfile = apiProfile || storedUser;
        setProfile(effectiveProfile);

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
            createdAt: "2025-02-15T14:20:00.000Z"
          }
        ];

        const combinedOrdersMap = new Map();
        apiOrders.forEach((o) => {
          const id = o._id || o.id;
          if (id) combinedOrdersMap.set(id, o);
        });
        localOrders.forEach((o) => {
          const id = o._id || o.id;
          if (id) combinedOrdersMap.set(id, o);
        });
        defaultOrders.forEach((o) => {
          if (!combinedOrdersMap.has(o._id)) {
            combinedOrdersMap.set(o._id, o);
          }
        });

        const allOrders = Array.from(combinedOrdersMap.values());
        const currentEmail = (effectiveProfile.email || storedUser.email || "").trim().toLowerCase();
        const currentUsername = (effectiveProfile.username || storedUser.username || "").trim().toLowerCase();

        const userOrders = allOrders.filter((o) => {
          if (!o.user) return true;
          const orderEmail = (o.user.email || "").trim().toLowerCase();
          const orderUsername = (o.user.username || "").trim().toLowerCase();
          return (
            (currentEmail && orderEmail === currentEmail) ||
            (currentUsername && orderUsername === currentUsername) ||
            (!orderEmail && !orderUsername)
          );
        }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

        setOrders(userOrders.length > 0 ? userOrders : allOrders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
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

  const handleStartEdit = () => {
    const cur = profile || storedUser;
    setEditForm({
      username: cur.username || "",
      email: cur.email || "",
      phone: cur.phone || "",
      address: cur.address || (orders[0]?.shippingAddress || "")
    });
    setProfileMsg({ text: "", type: "" });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.username.trim() || !editForm.email.trim()) {
      setProfileMsg({ text: "Username and email cannot be empty.", type: "error" });
      return;
    }

    setSavingProfile(true);
    try {
      const cur = profile || storedUser;
      let updatedUser = {
        ...cur,
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim()
      };

      try {
        const res = await API.put("/users/profile", editForm);
        if (res.data?.user) {
          updatedUser = { ...updatedUser, ...res.data.user };
        }
      } catch (apiErr) {
        console.warn("Backend update error, saving to local state", apiErr);
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfile(updatedUser);
      setIsEditing(false);
      setProfileMsg({ text: "Profile updated successfully! ✨", type: "success" });

      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new Event("storage"));

      setTimeout(() => setProfileMsg({ text: "", type: "" }), 4000);
    } catch (err) {
      console.error("Save profile error:", err);
      setProfileMsg({ text: "Failed to save profile changes.", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Rating Review Submit Handler ---
  const handleOpenRating = (order, item) => {
    const pName = item.name || item.product?.name || (typeof item.product === "string" ? item.product : "Product");
    const pId = item.product?._id || item.product || `prod-${Date.now()}`;
    setRatingModal({
      show: true,
      orderId: order._id,
      productName: pName,
      productId: pId,
      rating: 5,
      comment: "",
      submitting: false
    });
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!ratingModal.comment.trim()) {
      setRatingToast({ show: true, msg: "Please write a few words about your experience.", type: "error" });
      return;
    }

    setRatingModal((prev) => ({ ...prev, submitting: true }));
    const curUser = profile || storedUser;

    const newReview = {
      _id: `rev-${Date.now()}`,
      username: curUser.username || "Verified Customer",
      userEmail: curUser.email || "",
      rating: Number(ratingModal.rating),
      comment: ratingModal.comment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      if (ratingModal.productId && !ratingModal.productId.startsWith("prod-")) {
        await API.post(`/products/${ratingModal.productId}/reviews`, {
          username: newReview.username,
          userEmail: newReview.userEmail,
          rating: newReview.rating,
          comment: newReview.comment
        });
      }
    } catch (apiErr) {
      console.warn("Backend review post failed, fallback to local storage", apiErr);
    }

    // Update mock_products in localStorage so Admin Panel and Products immediately show it
    try {
      const localProds = JSON.parse(localStorage.getItem("mock_products") || "[]");
      let matched = false;
      const updatedProds = localProds.map((p) => {
        if (p._id === ratingModal.productId || p.name === ratingModal.productName) {
          matched = true;
          const reviews = [...(p.reviews || []), newReview];
          const avg = Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1));
          return { ...p, reviews, numReviews: reviews.length, rating: avg };
        }
        return p;
      });

      if (matched) {
        localStorage.setItem("mock_products", JSON.stringify(updatedProds));
      } else if (localProds.length > 0) {
        // Attach to first product or create item
        localProds[0].reviews = [...(localProds[0].reviews || []), { ...newReview, productName: ratingModal.productName }];
        localStorage.setItem("mock_products", JSON.stringify(localProds));
      }
    } catch (e) {}

    // Save user rated flag in localStorage
    const ratedOrders = JSON.parse(localStorage.getItem("user_rated_items") || "{}");
    ratedOrders[`${ratingModal.orderId}_${ratingModal.productName}`] = ratingModal.rating;
    localStorage.setItem("user_rated_items", JSON.stringify(ratedOrders));

    setRatingModal({ show: false, orderId: "", productName: "", productId: "", rating: 5, comment: "", submitting: false });
    setRatingToast({ show: true, msg: "Thank you! Your rating has been shared with the Admin & Store. ⭐", type: "success" });
    setTimeout(() => setRatingToast({ show: false, msg: "", type: "success" }), 4500);
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
                      <div className="up-info-card-header">
                        <h3>Account Information</h3>
                        {!isEditing && (
                          <button
                            className="up-edit-profile-btn"
                            onClick={handleStartEdit}
                          >
                            ✏️ Edit Profile
                          </button>
                        )}
                      </div>

                      {profileMsg.text && (
                        <div className={`up-feedback-msg ${profileMsg.type}`}>
                          {profileMsg.text}
                        </div>
                      )}

                      {isEditing ? (
                        <form onSubmit={handleSaveProfile} className="up-edit-form">
                          <div className="up-edit-field">
                            <label>👤 Full Name / Username</label>
                            <input
                              type="text"
                              required
                              value={editForm.username}
                              onChange={(e) =>
                                setEditForm({ ...editForm, username: e.target.value })
                              }
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className="up-edit-field">
                            <label>📧 Email Address</label>
                            <input
                              type="email"
                              required
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm({ ...editForm, email: e.target.value })
                              }
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="up-edit-field">
                            <label>📱 Phone Number</label>
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) =>
                                setEditForm({ ...editForm, phone: e.target.value })
                              }
                              placeholder="e.g. +91 98765 43210"
                            />
                          </div>

                          <div className="up-edit-field">
                            <label>📍 Delivery / Farm Address</label>
                            <textarea
                              rows={2}
                              value={editForm.address}
                              onChange={(e) =>
                                setEditForm({ ...editForm, address: e.target.value })
                              }
                              placeholder="Enter your delivery address"
                            />
                          </div>

                          <div className="up-edit-actions">
                            <button
                              type="submit"
                              className="up-save-btn"
                              disabled={savingProfile}
                            >
                              {savingProfile ? "Saving..." : "💾 Save Changes"}
                            </button>
                            <button
                              type="button"
                              className="up-cancel-btn"
                              onClick={() => {
                                setIsEditing(false);
                                setProfileMsg({ text: "", type: "" });
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
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
                            <span className="up-info-label">📱 Phone</span>
                            <span className="up-info-value">
                              {user.phone || <em className="up-muted-txt">Not added yet</em>}
                            </span>
                          </div>
                          <div className="up-info-row">
                            <span className="up-info-label">📍 Delivery Address</span>
                            <span className="up-info-value">
                              {user.address || orders[0]?.shippingAddress || (
                                <em className="up-muted-txt">Not added yet</em>
                              )}
                            </span>
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
                      )}
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
                                <div className="user-order-actions">
                                  {order.items.map((item, idx) => {
                                    const itemName = item.name || item.product?.name || (typeof item.product === "string" ? item.product : "Product");
                                    const ratedItems = JSON.parse(localStorage.getItem("user_rated_items") || "{}");
                                    const existingRating = ratedItems[`${order._id}_${itemName}`];

                                    return existingRating ? (
                                      <span key={idx} className="order-rated-badge">
                                        ✓ Rated {"★".repeat(existingRating)}
                                      </span>
                                    ) : (
                                      <button
                                        key={idx}
                                        className="order-rate-btn"
                                        onClick={() => handleOpenRating(order, item)}
                                      >
                                        ⭐ Rate {itemName.length > 20 ? `${itemName.slice(0, 20)}...` : itemName}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="user-order-total-box">
                                  <span>Total Paid:</span>
                                  <span className="order-total-amount">₹{order.totalAmount}</span>
                                </div>
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

      {/* Toast Notification */}
      {ratingToast.show && (
        <div className={`up-toast-notification ${ratingToast.type}`}>
          {ratingToast.msg}
        </div>
      )}

      {/* --- RATING MODAL --- */}
      {ratingModal.show && (
        <div className="up-modal-backdrop" onClick={() => setRatingModal({ ...ratingModal, show: false })}>
          <div className="up-rating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="up-modal-header">
              <div>
                <h3>Rate & Review Product</h3>
                <p className="up-modal-subtitle">{ratingModal.productName}</p>
              </div>
              <button
                className="up-modal-close"
                onClick={() => setRatingModal({ ...ratingModal, show: false })}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="up-rating-form">
              <div className="up-star-selector-box">
                <label>Select Your Rating:</label>
                <div className="up-stars-interactive">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${star <= ratingModal.rating ? "active" : ""}`}
                      onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-rating-text">
                    {ratingModal.rating === 5 && "Excellent! 🌟"}
                    {ratingModal.rating === 4 && "Very Good! 👍"}
                    {ratingModal.rating === 3 && "Average 👌"}
                    {ratingModal.rating === 2 && "Poor ⚠️"}
                    {ratingModal.rating === 1 && "Terrible ❌"}
                  </span>
                </div>
              </div>

              <div className="up-review-input-box">
                <label>Your Feedback / Experience:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the product quality, germination, crop performance, or delivery..."
                  value={ratingModal.comment}
                  onChange={(e) => setRatingModal({ ...ratingModal, comment: e.target.value })}
                />
              </div>

              <div className="up-rating-modal-actions">
                <button
                  type="submit"
                  className="up-submit-rating-btn"
                  disabled={ratingModal.submitting}
                >
                  {ratingModal.submitting ? "Submitting..." : "Submit Rating & Review ⭐"}
                </button>
                <button
                  type="button"
                  className="up-cancel-modal-btn"
                  onClick={() => setRatingModal({ ...ratingModal, show: false })}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default UserPanel;
