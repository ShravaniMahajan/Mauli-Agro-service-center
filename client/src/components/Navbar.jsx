import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") user = JSON.parse(userStr);
  } catch (e) {}

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

        {/* Right side: Search + Language Toggle + Auth */}
        <div className="agro-nav-right">
          <div className="agro-search-box">
            <input type="text" placeholder={t("searchPlaceholder")} />
          </div>

          {/* Language Toggle Button */}
          <button className="agro-lang-toggle-btn" onClick={toggleLanguage} title="Switch Language / भाषा बदला">
            🌐 <span className="lang-text">{lang === "en" ? "मराठी" : "English"}</span>
          </button>

          {user ? (
            <div className="agro-auth-area">
              <span className="agro-user-welcome" style={{ color: 'white', marginRight: '6px', fontSize: '0.85rem' }}>
                Hi, {user.username} 👋
              </span>
              {user.role === "admin" ? (
                <button className="agro-dashboard-btn" onClick={() => navigate("/admin-panel")}>
                  {t("adminPanel")}
                </button>
              ) : (
                <>
                  <button className="agro-dashboard-btn" onClick={() => navigate("/user-panel")}>
                    {t("myPanel")}
                  </button>
                  <button className="agro-cart-btn" onClick={() => navigate("/cart")}>
                    {t("cart")}
                  </button>
                </>
              )}
              <button className="agro-logout-btn" onClick={handleLogout}>
                {t("logout")}
              </button>
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