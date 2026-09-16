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
    try {
      const res = await API.post("/auth/login", { username, password });
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
      setMessage({ text: err.response?.data?.message || "Invalid credentials. Please try again.", type: "error" });
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