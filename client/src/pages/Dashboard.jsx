import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import mockProducts from "../data/mockProducts";
import "./Dashboard.css";

const categories = [
  { 
    id: 1, 
    key: "catSeeds",
    name: "Seeds", 
    icon: "🌱",
    count: "20+ Products",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80", 
    link: "/products?category=Seeds" 
  },
  { 
    id: 2, 
    key: "catFertilizers",
    name: "Fertilizers", 
    icon: "🧪",
    count: "15+ Products",
    image: "https://eos.com/wp-content/uploads/2023/11/components-of-different-types-of-fertilizers.jpg", 
    link: "/products?category=Fertilizers" 
  },
  { 
    id: 3, 
    key: "catPesticides",
    name: "Pesticides", 
    icon: "🛡️",
    count: "12+ Products",
    image: "https://th.bing.com/th/id/OIP.8P9QTf_uiRpKghnvbVkzZwHaE7?w=258&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
    link: "/products?category=Pesticides" 
  },
  { 
    id: 4, 
    key: "catHerbicides",
    name: "Herbicides", 
    icon: "🌾",
    count: "10+ Products",
    image: "https://th.bing.com/th/id/OIP.CSoWk7GkwC3g1ZNxf-R-OAHaHa?w=183&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
    link: "/products?category=Herbicides" 
  },
  { 
    id: 5, 
    key: "catFungicides",
    name: "Fungicides", 
    icon: "🍃",
    count: "8+ Products",
    image: "https://th.bing.com/th/id/OIP.Ky8fWaZ8RgNz-9RYE5YCQQHaHa?w=175&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", 
    link: "/products?category=Fungicides" 
  },
  { 
    id: 6, 
    key: "catInsecticides",
    name: "Insecticides", 
    icon: "🦟",
    count: "14+ Products",
    image: "https://perfectfitliving.com/wp-content/uploads/2024/05/effective_insecticides_for_pest.jpg", 
    link: "/products?category=Insecticides" 
  },
  {
    id: 7,
    key: "catAnimalFeed",
    name: "Animal Feed",
    icon: "🐄",
    count: "10+ Products",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/8/333130131/MK/AW/AJ/15170914/chana-churi-500x500.jpg",
    link: "/products?category=Animal Feed"
  }
];

const topBrands = [
  { name: "Bayer CropScience", icon: "🌱", sub: "Global Leader" },
  { name: "Syngenta", icon: "🌾", sub: "Crop Care" },
  { name: "UPL Ltd.", icon: "🍃", sub: "Bio Nutrients" },
  { name: "Mahyco Seeds", icon: "🌻", sub: "Certified Hybrid" },
  { name: "Katyayani", icon: "🛡️", sub: "Bio Pesticides" },
  { name: "IFFCO", icon: "🧪", sub: "Quality Fertilizers" },
  { name: "Advanta Seeds", icon: "🌽", sub: "Resistant Seeds" },
  { name: "Tata Rallis", icon: "⚡", sub: "Agri Solutions" }
];

const faqs = [
  { qKey: "faq1Q", aKey: "faq1A" },
  { qKey: "faq2Q", aKey: "faq2A" },
  { qKey: "faq3Q", aKey: "faq3A" },
  { qKey: "faq4Q", aKey: "faq4A" }
];

function Dashboard() {
  const navigate = useNavigate();
  const { t, getCategory, translateProd, toMarathiNumbers } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState(() => {
    return [...mockProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribedToast, setSubscribedToast] = useState(false);
  const [toastMsg, setToastMsg] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await API.get("/products");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const sorted = [...res.data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setFeaturedProducts(sorted.slice(0, 4));
      }
    } catch (err) {
      console.warn("Backend API unavailable, using initial featured products.");
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      setToastMsg({ show: true, msg: "Please login to add products to your cart.", type: "error" });
      setTimeout(() => setToastMsg({ show: false, msg: "", type: "success" }), 3000);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item) => item.product === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: 1
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setToastMsg({ show: true, msg: `Added "${product.name}" to cart! 🛒`, type: "success" });
    setTimeout(() => setToastMsg({ show: false, msg: "", type: "success" }), 3000);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribedToast(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribedToast(false), 4000);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Top Announcement Trust Strip */}
      <div className="ecommerce-trust-strip">
        <div className="trust-strip-inner">
          <div className="trust-strip-item">
            <span className="trust-strip-icon">🚚</span>
            <span><strong>Free Delivery</strong> on orders above ₹499</span>
          </div>
          <div className="trust-strip-item">
            <span className="trust-strip-icon">🛡️</span>
            <span><strong>100% Genuine</strong> Certified Agri Inputs</span>
          </div>
          <div className="trust-strip-item">
            <span className="trust-strip-icon">💵</span>
            <span><strong>Cash on Delivery</strong> Available</span>
          </div>
          <div className="trust-strip-item">
            <span className="trust-strip-icon">📞</span>
            <span><strong>Kisan Helpline:</strong> +91 98765 43210</span>
          </div>
        </div>
      </div>

      <main className="dashboard-main">
        {/* ===== HERO SECTION ===== */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <div className="hero-badge-wrap">
              <span className="hero-badge">🌿 100% Certified Agricultural Inputs • Direct from Factory</span>
            </div>
            <h1 className="hero-title">
              {t("heroTitlePrefix")} <br /> <span>{t("heroTitleSuffix")}</span>
            </h1>
            <p className="hero-subtitle">
              {t("heroSubtitle")}
            </p>

            <div className="hero-cta">
              <button className="btn-primary btn-lg" onClick={() => navigate("/products")}>
                {t("shopProductsBtn")}
              </button>
              <button className="btn-outline-light btn-lg" onClick={() => navigate("/about")}>
                {t("ourStoryBtn")}
              </button>
            </div>

            <div className="hero-stats-mini">
              <div className="h-stat">
                <strong>50,000+</strong>
                <span>Happy Farmers</span>
              </div>
              <div className="h-stat-div"></div>
              <div className="h-stat">
                <strong>500+</strong>
                <span>Certified Inputs</span>
              </div>
              <div className="h-stat-div"></div>
              <div className="h-stat">
                <strong>4.9 ★</strong>
                <span>Farmer Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-backdrop"></div>
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
              alt="Smart Krushi Farm Land"
              className="main-hero-img"
              onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
            />
            <div className="floating-card top-card">
              <span className="icon">🌱</span>
              <div>
                <strong>High Germination</strong>
                <p>98% Lab Tested</p>
              </div>
            </div>
            <div className="floating-card bottom-card">
              <span className="icon">🚚</span>
              <div>
                <strong>Fast Delivery</strong>
                <p>To Farm Gate</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEASONAL MEGA PROMO BANNER ===== */}
        <section className="seasonal-promo-banner">
          <div className="promo-banner-inner">
            <div className="promo-left">
              <span className="promo-badge">🔥 KHARIF & RABI MEGA SALE</span>
              <h2>Up to <strong>40% OFF</strong> on Certified Seeds & Bio-Fertilizers</h2>
              <p>Empower your field with verified disease-resistant seeds, balanced NPK nutrients, and organic soil boosters.</p>
            </div>
            <div className="promo-right">
              <button className="promo-btn" onClick={() => navigate("/products")}>
                Shop Discount Deals →
              </button>
              <div className="promo-code-box">Coupon Code: <strong>SMARTKRUSHI</strong></div>
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section className="dashboard-section bg-white">
          <div className="section-header text-center">
            <h2 className="section-heading">{t("shopByCategory")}</h2>
            <p className="section-subheading">{t("shopByCategorySub")}</p>
          </div>
          <div className="categories-grid-modern">
            {categories.map((cat) => (
              <div className="category-item" key={cat.id} onClick={() => navigate(cat.link)}>
                <div className="category-image-wrap">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"; }}
                  />
                  <span className="category-icon-badge">{cat.icon}</span>
                </div>
                <h3>{t(cat.key)}</h3>
                <span className="category-count-tag">{cat.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS SHOWCASE ===== */}
        {featuredProducts.length > 0 && (
          <section className="dashboard-section bg-light">
            <div className="section-header">
              <div>
                <h2 className="section-heading">{t("topRatedProducts")}</h2>
                <p className="section-subheading">{t("topRatedSub")}</p>
              </div>
              <button className="btn-outline-dark" onClick={() => navigate("/products")}>
                {t("viewAllProducts")}
              </button>
            </div>

            <div className="featured-products-grid">
              {featuredProducts.map((p) => {
                const product = translateProd(p);
                const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

                return (
                  <div key={product._id} className="featured-p-card" onClick={() => navigate("/products")}>
                    <div className="featured-p-img-box">
                      {product.mrp > product.price && (
                        <span className="save-tag">
                          {toMarathiNumbers(discountPercent)}% OFF
                        </span>
                      )}
                      <span className="stock-tag-pill">🟢 In Stock</span>
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
                      />
                    </div>
                    <div className="featured-p-info">
                      <span className="p-cat-badge">{getCategory(product.category)}</span>
                      <h4>{product.name}</h4>
                      <div className="rating-row font-medium">
                        <span className="stars-gold">⭐⭐⭐⭐⭐</span>
                        <span className="score">({toMarathiNumbers(product.rating ? product.rating.toFixed(1) : "5.0")})</span>
                      </div>
                      <div className="p-price-row">
                        <div className="price-stack">
                          <span className="price-now">₹{toMarathiNumbers(product.price)}</span>
                          {product.mrp > product.price && <span className="price-old">₹{toMarathiNumbers(product.mrp)}</span>}
                        </div>
                        <button
                          type="button"
                          className="btn-add-cart-fast"
                          onClick={(e) => handleAddToCart(e, product)}
                          title="Add directly to cart"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== TOP PARTNER BRANDS ===== */}
        <section className="dashboard-section bg-white">
          <div className="section-header text-center">
            <h2 className="section-heading">Trusted Global Agri Brands</h2>
            <p className="section-subheading">We partner directly with industry-leading manufacturers to guarantee 100% genuine inputs.</p>
          </div>
          <div className="brands-showcase-grid">
            {topBrands.map((b, idx) => (
              <div key={idx} className="brand-badge-card" onClick={() => navigate("/brand")}>
                <div className="brand-badge-icon">{b.icon}</div>
                <div className="brand-badge-name">{b.name}</div>
                <div className="brand-badge-sub">{b.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== AI CROP DOCTOR ADVISORY BANNER ===== */}
        <section className="crop-doctor-section">
          <div className="crop-doctor-card">
            <div className="crop-doctor-content">
              <span className="doctor-badge">🌾 AI Kisan Crop Doctor</span>
              <h2>Instant Crop Advisory & Disease Diagnosis</h2>
              <p>Have questions regarding pest attacks, fertilizer timing, or crop diseases? Ask our 24/7 AI Agri-Assistant directly!</p>
              <div className="doctor-sample-chips">
                <span>🍃 Cotton Whitefly Control</span>
                <span>🌾 Sugarcane Fertilizer Dosage</span>
                <span>🍅 Tomato Leaf Curl Solution</span>
              </div>
            </div>
            <div className="crop-doctor-action">
              <button
                className="doctor-open-chat-btn"
                onClick={() => {
                  const chatBtn = document.querySelector(".chat-toggle-btn");
                  if (chatBtn) chatBtn.click();
                }}
              >
                💬 Open Crop Assistant
              </button>
            </div>
          </div>
        </section>

        {/* ===== WHY CHOOSE SMART KRUSHI ===== */}
        <section className="dashboard-section bg-light">
          <div className="why-choose-us-wrap">
            <div className="wcu-visual-col">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&q=80"
                alt="Agri Expert Field Inspection"
                className="wcu-main-img"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"; }}
              />
            </div>

            <div className="wcu-text-col">
              <h2 className="section-heading">{t("whyChooseTitle")}</h2>
              <p className="section-subheading" style={{ marginBottom: "24px" }}>
                {t("whyChooseSub")}
              </p>

              <div className="wcu-features-list">
                <div className="wcu-feature-item">
                  <div className="wcu-icon-box">🌱</div>
                  <div>
                    <h4>{t("wcu1Title")}</h4>
                    <p>{t("wcu1Desc")}</p>
                  </div>
                </div>

                <div className="wcu-feature-item">
                  <div className="wcu-icon-box">🧪</div>
                  <div>
                    <h4>{t("wcu2Title")}</h4>
                    <p>{t("wcu2Desc")}</p>
                  </div>
                </div>

                <div className="wcu-feature-item">
                  <div className="wcu-icon-box">👨‍🌾</div>
                  <div>
                    <h4>{t("wcu3Title")}</h4>
                    <p>{t("wcu3Desc")}</p>
                  </div>
                </div>

                <div className="wcu-feature-item">
                  <div className="wcu-icon-box">🏷️</div>
                  <div>
                    <h4>{t("wcu4Title")}</h4>
                    <p>{t("wcu4Desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FREQUENTLY ASKED QUESTIONS ===== */}
        <section className="dashboard-section bg-white">
          <div className="section-header text-center">
            <h2 className="section-heading">{t("faqTitle")}</h2>
            <p className="section-subheading">{t("faqSub")}</p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`faq-item-card ${openFaq === idx ? "active" : ""}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <h3>{t(faq.qKey)}</h3>
                  <span className="faq-toggle-icon">{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer-body">
                    <p>{t(faq.aKey)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ===== NEWSLETTER SECTION ===== */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>{t("newsletterTitle")}</h2>
            <p>{t("newsletterSub")}</p>
            
            {subscribedToast && (
              <div className="sub-toast-msg">
                🎉 Thank you for subscribing! You'll receive our latest agri-updates soon.
              </div>
            )}

            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address (e.g. farmer@gmail.com)"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-accent">
                {t("subscribeBtn")}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMsg.show && (
        <div className={`dash-toast ${toastMsg.type}`}>
          {toastMsg.msg}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;