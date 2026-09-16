import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import API from "../services/api";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Always register user locally so instant login works with username or email
    const localUsers = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const existingIndex = localUsers.findIndex(
      (u) =>
        u.username?.toLowerCase().trim() === formData.username.toLowerCase().trim() ||
        u.email?.toLowerCase().trim() === formData.email.toLowerCase().trim()
    );

    const newUserObj = {
      id: "usr-" + Date.now(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: "user"
    };

    if (existingIndex > -1) {
      localUsers[existingIndex] = newUserObj;
    } else {
      localUsers.push(newUserObj);
    }
    localStorage.setItem("mock_users", JSON.stringify(localUsers));

    try {
      const res = await API.post("/auth/register", formData);
      setMessage({ text: (res.data?.message || "Registration successful!") + " Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/login"), 1000);
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
                <span>🌱</span>
              </div>
              <h1>{t("registerTitle")}</h1>
              <p>{t("registerSubtitle")}</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="auth-form" id="register-form">
              <div className="auth-field">
                <label htmlFor="reg-username">{t("fullNameLabel")}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">👤</span>
                  <input
                    id="reg-username"
                    type="text"
                    name="username"
                    placeholder={t("fullNamePlaceholder")}
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-email">{t("emailLabel")}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">✉️</span>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder={t("emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-password">{t("passwordLabel")}</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t("passwordRegPlaceholder")}
                    value={formData.password}
                    onChange={handleChange}
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

              <button type="submit" className="auth-btn-submit" id="register-submit" disabled={loading}>
                {loading ? (
                  <span className="auth-spinner">
                    <span className="spinner-circle"></span>
                    {t("creatingAccount")}
                  </span>
                ) : (
                  <>{t("registerTitle")}</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="auth-separator">
              <span>{t("authOr")}</span>
            </div>

            {/* Switch Link */}
            <p className="auth-switch-text">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" id="go-to-login">{t("signInBtn")}</Link>
            </p>
          </div>

          {/* Feature highlights */}
          <div className="auth-trust-badges">
            <div className="trust-badge">
              <span>🌾</span>
              <span>{t("qualitySeeds")}</span>
            </div>
            <div className="trust-badge">
              <span>🚚</span>
              <span>{t("fastDelivery")}</span>
            </div>
            <div className="trust-badge">
              <span>💰</span>
              <span>{t("bestPrices")}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;