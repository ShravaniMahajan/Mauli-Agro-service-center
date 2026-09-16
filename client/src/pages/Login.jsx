import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    const inputVal = username.toLowerCase().trim();

    try {
      const res = await API.post("/auth/login", { username: username.trim(), password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin-panel");
        } else {
          navigate("/user-panel");
        }
      }, 800);
    } catch (err) {
      // Offline fallback: Check registered local users by Username OR Email
      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const matchedLocal = localUsers.find(
        (u) =>
          (u.username?.toLowerCase().trim() === inputVal ||
           u.email?.toLowerCase().trim() === inputVal) &&
          u.password === password
      );

      if (matchedLocal) {
        const userData = {
          _id: matchedLocal.id || "local-1",
          username: matchedLocal.username,
          email: matchedLocal.email,
          role: matchedLocal.role || "user"
        };
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate(userData.role === "admin" ? "/admin-panel" : "/user-panel"), 800);
        return;
      }

      // Default demo accounts (Admin & Farmer)
      if ((inputVal === "admin" || inputVal === "admin@smartkrushi.com") &&
          (password === "admin" || password === "admin123" || password === "Admin@123")) {
        const userData = { _id: "demo-admin", username: "Admin", email: "admin@smartkrushi.com", role: "admin" };
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/admin-panel"), 800);
        return;
      }

      if ((inputVal === "farmer" || inputVal === "farmer@smartkrushi.com") &&
          (password === "farmer" || password === "farmer123")) {
        const userData = { _id: "demo-farmer", username: "Farmer", email: "farmer@smartkrushi.com", role: "user" };
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("user", JSON.stringify(userData));
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/user-panel"), 800);
        return;
      }

      // If user exists by username or email but wrong password
      const existsUser = localUsers.find(
        (u) => u.username?.toLowerCase().trim() === inputVal || u.email?.toLowerCase().trim() === inputVal
      );
      if (existsUser) {
        setMessage({ text: "Incorrect password. Please try again.", type: "error" });
      } else {
        setMessage({
          text: err.response?.data?.message || "Invalid credentials. Please check your username/email or sign up.",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="auth-section">
        <div className="auth-container">
          {/* Decorative Background Elements */}
          <div className="auth-decor auth-decor-1">🌿</div>
          <div className="auth-decor auth-decor-2">🌾</div>
          <div className="auth-decor auth-decor-3">🍃</div>

          <div className="auth-card">
            {/* Card Header */}
            <div className="auth-card-header">
              <div className="auth-icon-circle">
                <span>🔐</span>
              </div>
              <h1>{t("loginTitle")}</h1>
              <p>{t("loginSubtitle")}</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="auth-form" id="login-form">
              <div className="auth-field">
                <label htmlFor="login-username">{t("usernameLabel")}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">👤</span>
                  <input
                    id="login-username"
                    type="text"
                    placeholder={t("usernamePlaceholder")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">{t("passwordLabel")}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {message.text && (
                <div className={`auth-alert ${message.type}`} role="alert">
                  <span>{message.type === "success" ? "✅" : "❌"}</span>
                  <span>{message.text}</span>
                </div>
              )}

              <button type="submit" className="auth-btn-submit" id="login-submit" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner">
                    <span className="spinner-circle"></span>
                    {t("signingIn")}
                  </span>
                ) : (
                  <>{t("signInBtn")}</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-separator">
              <span>{t("authOr")}</span>
            </div>

            {/* Switch Link */}
            <p className="auth-switch-text">
              {t("noAccountText")}{" "}
              <Link to="/register" id="go-to-register">{t("createAccountLink")}</Link>
            </p>
          </div>

          {/* Trust badges */}
          <div className="auth-trust-badges">
            <div className="trust-badge">
              <span>🛡️</span>
              <span>{t("secureLogin")}</span>
            </div>
            <div className="trust-badge">
              <span>🌱</span>
              <span>{t("farmersCount")}</span>
            </div>
            <div className="trust-badge">
              <span>⭐</span>
              <span>{t("trustedPlatform")}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;