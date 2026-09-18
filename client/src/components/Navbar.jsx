import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const dropdownRef = useRef(null);

  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") user = JSON.parse(userStr);
  } catch (e) {}

  // Sync cart count
  const updateCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
      setCartCount(totalItems);

      const localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
      setOrderCount(localOrders.length || (user ? 1 : 0));
    } catch (e) {}
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("storage", updateCounts);
    return () => {
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShowProfileMenu(false);
    navigate("/login");
  };

  const initials = user?.username
    ? user.username
        .trim()
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <nav className="agro-navbar">
      <div className="agro-nav-inner">
        {/* Logo */}
        <div className="agro-logo" onClick={() => navigate("/")}>
          <div className="agro-logo-circle">
            <img src="https://img.icons8.com/color/48/wheat.png" alt="Smart Krushi Agro" />
          </div>
        </div>

        {/* Nav Links */}
        <ul className="agro-nav-links">
          <li className={location.pathname === "/" || location.pathname === "/dashboard" ? "active" : ""} onClick={() => navigate("/")}>
            {t("home")}
          </li>
          {user?.role !== "admin" && (
            <li className={location.pathname === "/about" ? "active" : ""} onClick={() => navigate("/about")}>
              {t("aboutUs")}
            </li>
          )}
          <li className={location.pathname === "/products" ? "active" : ""} onClick={() => navigate("/products")}>
            {t("products")}
          </li>
          <li className={location.pathname === "/brand" ? "active" : ""} onClick={() => navigate("/brand")}>
            {t("brands")}
          </li>
          <li className={location.pathname === "/contact" ? "active" : ""} onClick={() => navigate("/contact")}>
            {user?.role === "admin" ? t("enquiries") : t("contactUs")}
          </li>
        </ul>

        {/* Right side: Search + Language Toggle + Cart + Profile */}
        <div className="agro-nav-right">

          {/* Language Toggle Button */}
          <button className="agro-lang-toggle-btn" onClick={toggleLanguage} title="Switch Language / भाषा बदला">
            🌐 <span className="lang-text">{lang === "en" ? "मराठी" : "English"}</span>
          </button>

          {/* Cart Button — hidden for admins */}
          {user?.role !== "admin" && (
            <button className="agro-cart-btn" onClick={() => navigate("/cart")} title="Shopping Cart">
              🛒 <span className="cart-text">Cart</span>
              {cartCount > 0 && <span className="agro-cart-badge">{cartCount}</span>}
            </button>
          )}

          {user ? (
            /* Profile Avatar Button & Dropdown */
            <div className="agro-profile-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`agro-avatar-btn ${showProfileMenu ? "active" : ""}`}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                title="Account Profile"
              >
                <div className="agro-avatar-circle">{initials}</div>
                <span className="agro-avatar-arrow">{showProfileMenu ? "▲" : "▼"}</span>
              </button>

              {showProfileMenu && (
                <div className="agro-profile-popup">
                  {/* Popup User Header */}
                  <div className="profile-popup-header">
                    <div className="popup-avatar-lg">{initials}</div>
                    <div className="popup-user-details">
                      <div className="popup-user-name">{user.username}</div>
                      <div className="popup-user-email">{user.email || "No email attached"}</div>
                      <span className={`popup-role-tag ${user.role || "user"}`}>
                        {user.role === "admin" ? "🛡️ Administrator" : "🌱 Active User"}
                      </span>
                    </div>
                  </div>

                  {/* Popup Quick Stats */}
                  <div className="profile-popup-stats">
                    <div className="popup-stat-item">
                      <span className="popup-stat-val">{orderCount}</span>
                      <span className="popup-stat-lbl">Orders</span>
                    </div>
                    <div className="popup-stat-divider"></div>
                    <div className="popup-stat-item">
                      <span className="popup-stat-val text-green">● Active</span>
                      <span className="popup-stat-lbl">Status</span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="profile-popup-menu">
                    {user.role === "admin" ? (
                      <button
                        className="popup-menu-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/admin-panel", { state: { tab: "dashboard" } });
                        }}
                      >
                        <span className="menu-icon">🛡️</span> Admin Dashboard
                      </button>
                    ) : (
                      <>
                        <button
                          className="popup-menu-item"
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/user-panel", { state: { tab: "profile" } });
                          }}
                        >
                          <span className="menu-icon">👤</span> My Profile & Details
                        </button>
                        <button
                          className="popup-menu-item"
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/user-panel", { state: { tab: "orders" } });
                          }}
                        >
                          <span className="menu-icon">📦</span> My Order History
                        </button>
                      </>
                    )}

                    {user.role !== "admin" && (
                      <button
                        className="popup-menu-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/products");
                        }}
                      >
                        <span className="menu-icon">🛍️</span> Browse Products
                      </button>
                    )}

                    {user.role === "admin" && (
                      <button
                        className="popup-menu-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/admin-panel", { state: { tab: "products" } });
                        }}
                      >
                        <span className="menu-icon">📦</span> Manage Products
                      </button>
                    )}

                    {user.role !== "admin" && (
                      <button
                        className="popup-menu-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/cart");
                        }}
                      >
                        <span className="menu-icon">🛒</span> View Shopping Cart
                      </button>
                    )}

                    <div className="popup-menu-divider"></div>

                    <button className="popup-menu-item logout-item" onClick={handleLogout}>
                      <span className="menu-icon">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="agro-auth-area">
              <button className="agro-signup-btn" onClick={() => navigate("/register")}>
                {t("signUp")}
              </button>
              <button className="agro-login-btn" onClick={() => navigate("/login")}>
                {t("login")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;