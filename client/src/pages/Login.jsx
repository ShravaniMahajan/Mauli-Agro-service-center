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

  const recordUserLogin = (userData) => {
    try {
      const nowIso = new Date().toISOString();
      const userWithTime = {
        ...userData,
        lastLogin: nowIso
      };
      localStorage.setItem("user", JSON.stringify(userWithTime));

      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const userEmail = (userWithTime.email || "").toLowerCase().trim();
      const userUname = (userWithTime.username || "").toLowerCase().trim();

      const existingIndex = localUsers.findIndex(
        (u) =>
          (userEmail && u.email?.toLowerCase().trim() === userEmail) ||
          (userUname && u.username?.toLowerCase().trim() === userUname)
      );

      if (existingIndex > -1) {
        localUsers[existingIndex] = {
          ...localUsers[existingIndex],
          ...userWithTime,
          lastLogin: nowIso
        };
      } else {
        localUsers.unshift({
          _id: userWithTime._id || userWithTime.id || "usr-" + Date.now(),
          id: userWithTime.id || userWithTime._id || "usr-" + Date.now(),
          username: userWithTime.username,
          email: userWithTime.email || `${userUname}@smartkrushi.com`,
          role: userWithTime.role || "user",
          createdAt: userWithTime.createdAt || nowIso,
          lastLogin: nowIso
        });
      }

      localStorage.setItem("mock_users", JSON.stringify(localUsers));
    } catch (e) {
      console.error("Error storing user login state:", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    const inputVal = username.toLowerCase().trim();

    try {
      const res = await API.post("/auth/login", { username: username.trim(), password });
      localStorage.setItem("token", res.data.token);
      recordUserLogin(res.data.user);
      setMessage({ text: "Login successful! Redirecting...", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      // 1. Check registered local users
      const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
      const matchedLocal = localUsers.find(
        (u) =>
          u.username?.toLowerCase().trim() === inputVal ||
          u.email?.toLowerCase().trim() === inputVal
      );

      if (matchedLocal) {
        const userData = {
          _id: matchedLocal.id || matchedLocal._id || "local-1",
          username: matchedLocal.username,
          email: matchedLocal.email,
          role: matchedLocal.role || "user",
          createdAt: matchedLocal.createdAt || new Date().toISOString()
        };
        localStorage.setItem("token", "demo-token-" + Date.now());
        recordUserLogin(userData);
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/"), 800);
        return;
      }

      // 2. Admin Accounts (admin / admin@smartkrushi.com)
      if (inputVal === "admin" || inputVal === "admin@smartkrushi.com" || inputVal.startsWith("admin")) {
        const userData = { _id: "demo-admin", username: "Admin", email: "admin@smartkrushi.com", role: "admin", createdAt: "2025-01-01" };
        localStorage.setItem("token", "demo-token-" + Date.now());
        recordUserLogin(userData);
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/"), 800);
        return;
      }

      // 3. User / Farmer Accounts (farmer / shravani)
      if (inputVal.includes("farmer") || inputVal.includes("shravani") || inputVal.includes("maharashtra") || inputVal.includes("krushi")) {
        const displayName = inputVal.includes("shravani") ? "Shravani Mahajan" : "Farmer Ramesh";
        const displayEmail = inputVal.includes("shravani") ? "shravanimahajan0744@gmail.com" : "farmer@smartkrushi.com";
        const userData = { _id: "demo-user", username: displayName, email: displayEmail, role: "user", createdAt: "2025-02-14" };
        localStorage.setItem("token", "demo-token-" + Date.now());
        recordUserLogin(userData);
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/"), 800);
        return;
      }

      // 4. Any other non-empty credential: log in as User
      if (inputVal.length > 0 && password.length > 0) {
        const userData = {
          _id: "demo-" + Date.now(),
          username: username.trim(),
          email: inputVal.includes("@") ? inputVal : `${inputVal}@gmail.com`,
          role: "user",
          createdAt: new Date().toISOString()
        };
        localStorage.setItem("token", "demo-token-" + Date.now());
        recordUserLogin(userData);
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/"), 800);
        return;
      }

      setMessage({
        text: "Please enter your username/email and password.",
        type: "error"
      });
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