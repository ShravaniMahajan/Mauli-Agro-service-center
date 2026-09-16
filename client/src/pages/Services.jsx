import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Services.css";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: "fertilizer",
    icon: "🌱",
    title: "Fertilizers",
    category: "Fertilizers",
    tagline: "Nourish Your Soil, Grow Your Yields",
    desc: "Premium macro and micro-nutrient fertilizers scientifically formulated to maximize crop yield and soil health across all crop types.",
    features: ["NPK Blends", "Organic Compost", "Micronutrient Mix", "Slow Release Formulas", "Water Soluble Grades"],
    products: 80,
    color: "#7cb518",
    bg: "#f0fdf4",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80",
  },
  {
    id: "pesticides",
    icon: "🛡️",
    title: "Pesticides",
    category: "Pesticides & Seeds",
    tagline: "Protect Crops from Harmful Insects",
    desc: "Advanced insecticide and pesticide formulations to safeguard your crops from pests while being safe for beneficial organisms.",
    features: ["Systemic Insecticides", "Contact Sprays", "Soil Drenches", "Bio-pesticides", "Granular Forms"],
    products: 95,
    color: "#1a5c38",
    bg: "#f0fdf4",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&q=80",
  },
  {
    id: "herbicide",
    icon: "🌾",
    title: "Herbicides",
    category: "Herbicides & Fungicides",
    tagline: "Keep Weeds Away, Keep Yields High",
    desc: "Selective and non-selective herbicides designed to eliminate problematic weeds without harming your primary crop species.",
    features: ["Pre-emergent Herbicides", "Post-emergent Sprays", "Soil Active Types", "Selective Action", "Broad-spectrum"],
    products: 60,
    color: "#d97706",
    bg: "#fffbeb",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80",
  },
  {
    id: "seeds",
    icon: "🌻",
    title: "Seeds",
    category: "Pesticides & Seeds",
    tagline: "Start Strong with Premium Quality Seeds",
    desc: "Certified high-germination seeds for all major crops — from staple grains to horticulture — bred for high yield and disease resistance.",
    features: ["Hybrid Varieties", "Open-Pollinated Seeds", "Treated Seeds", "Vegetable Seeds", "Cereal Crops"],
    products: 75,
    color: "#c0392b",
    bg: "#fff5f5",
    image: "https://images.unsplash.com/photo-1592502712628-b04f7a7b8e54?w=500&q=80",
  },
  {
    id: "fungicides",
    icon: "🍄",
    title: "Fungicides",
    category: "Herbicides & Fungicides",
    tagline: "Combat Fungal Diseases at Every Stage",
    desc: "Broad-spectrum and targeted fungicides to protect your crops from devastating fungal infections and mold outbreaks.",
    features: ["Systemic Fungicides", "Contact Fungicides", "Seed Treatment", "Foliar Sprays", "Soil Applications"],
    products: 45,
    color: "#7c3aed",
    bg: "#f5f3ff",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  },
  {
    id: "insecticides",
    icon: "🐛",
    title: "Insecticides",
    category: "Insecticides",
    tagline: "Eliminate Pests Before They Harm",
    desc: "Fast-acting and residual insecticides to control a wide range of crop-damaging insects at every growth stage.",
    features: ["Contact Killers", "Systemic Action", "Soil Drench", "Granular Formulas", "Biopesticides"],
    products: 55,
    color: "#b45309",
    bg: "#fef3c7",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&q=80",
  },
  {
    id: "post-harvest",
    icon: "📦",
    title: "Post-Harvest Care",
    category: "Post-Harvest",
    tagline: "Preserve Quality After the Harvest",
    desc: "Post-harvest treatments and storage solutions that extend shelf life and maintain crop quality from farm to market.",
    features: ["Anti-fungal Coatings", "Storage Fumigants", "Ripening Agents", "Waxing Solutions", "Cold Chain Support"],
    products: 30,
    color: "#0891b2",
    bg: "#ecfeff",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80",
  },
  {
    id: "organic",
    icon: "🌿",
    title: "Organic Products",
    category: "Organic",
    tagline: "Go Green with Certified Organic Solutions",
    desc: "100% certified organic bio-stimulants, compost, and crop protection products for sustainable, chemical-free farming.",
    features: ["Bio-stimulants", "Vermicompost", "Neem-based Sprays", "Microbial Inoculants", "Green Manure"],
    products: 40,
    color: "#059669",
    bg: "#ecfdf5",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80",
  },
];

const serviceCategories = [
  "All",
  "Pesticides & Seeds",
  "Fertilizers",
  "Herbicides & Fungicides",
  "Insecticides",
  "Post-Harvest",
  "Organic",
];

const whyChoose = [
  { icon: "✅", title: "Certified Quality", desc: "All products are government-certified and tested for efficacy." },
  { icon: "🚚", title: "Fast Delivery", desc: "Same-day or next-day delivery to your doorstep or farm." },
  { icon: "💬", title: "Expert Guidance", desc: "Free agronomist consultation with every bulk order." },
  { icon: "💰", title: "Best Prices", desc: "Competitive wholesale prices with bulk purchase discounts." },
];

function Services() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="services-main">

        {/* Hero */}
        <section className="services-hero">
          <div className="services-hero-inner">
            <span className="services-hero-badge">What We Offer</span>
            <h1>Complete Agro <span>Services</span> for Every Farmer</h1>
            <p>From soil preparation to harvest protection — we have everything your farm needs under one roof.</p>
            <div className="services-hero-cta">
              <button className="btn-primary" onClick={() => navigate("/contact")}>Talk to an Expert</button>
              <button className="btn-outline" onClick={() => navigate("/brand")}>View Brands</button>
            </div>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="svc-filter-section">
          <div className="svc-search-wrap">
            <span className="svc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="svc-search-input"
            />
            {search && (
              <button className="svc-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <div className="svc-category-tabs">
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                className={`svc-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="services-grid-section">
          <div className="services-header">
            <h2 className="section-heading">Our Service Categories</h2>
            <p className="section-subheading">
              {filteredServices.length} service{filteredServices.length !== 1 ? "s" : ""} found — click any card to explore
            </p>
          </div>
          <div className="services-grid">
            {filteredServices.length === 0 && (
              <div className="svc-empty">
                <span className="svc-empty-icon">🔍</span>
                <p>No services found for "<strong>{search || activeCategory}</strong>"</p>
                <button className="btn-outline" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear Filters</button>
              </div>
            )}
            {filteredServices.map(svc => (
              <div
                className={`service-card ${activeService === svc.id ? "expanded" : ""}`}
                key={svc.id}
                style={{ "--svc-color": svc.color, "--svc-bg": svc.bg }}
                onClick={() => setActiveService(activeService === svc.id ? null : svc.id)}
              >
                <div className="svc-card-img">
                  <img src={svc.image} alt={svc.title} onError={e => e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80"} />
                  <div className="svc-img-overlay" style={{ background: `${svc.color}cc` }}>
                    <span className="svc-big-icon">{svc.icon}</span>
                  </div>
                </div>
                <div className="svc-card-body">
                  <div className="svc-card-head">
                    <span className="svc-icon">{svc.icon}</span>
                    <div>
                      <h3 style={{ color: svc.color }}>{svc.title}</h3>
                      <p className="svc-tagline">{svc.tagline}</p>
                    </div>
                    <span className="svc-expand-arrow">{activeService === svc.id ? "▲" : "▼"}</span>
                  </div>
                  <p className="svc-desc">{svc.desc}</p>
                  {activeService === svc.id && (
                    <div className="svc-details">
                      <h4>Available Types:</h4>
                      <ul className="svc-features">
                        {svc.features.map(f => (
                          <li key={f}><span style={{ color: svc.color }}>✓</span> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="svc-card-footer">
                    <span className="svc-count" style={{ color: svc.color }}>📦 {svc.products}+ Products</span>
                    <button
                      className="svc-btn"
                      style={{ background: svc.color }}
                      onClick={(e) => { e.stopPropagation(); navigate("/dashboard"); }}
                    >
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose */}
        <section className="services-why">
          <div className="services-why-inner">
            <h2 className="section-heading" style={{ color: "white" }}>Why Choose Us?</h2>
            <p className="section-subheading" style={{ color: "rgba(255,255,255,0.75)" }}>We go beyond just selling products — we partner in your farming success.</p>
            <div className="why-grid">
              {whyChoose.map(w => (
                <div className="why-card" key={w.title}>
                  <span className="why-icon">{w.icon}</span>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="services-process">
          <h2 className="section-heading" style={{ textAlign: "center" }}>How It Works</h2>
          <p className="section-subheading" style={{ textAlign: "center" }}>Simple 4-step process to get products delivered to your farm</p>
          <div className="process-steps">
            {["Browse Products", "Add to Cart", "Place Order", "Receive Delivery"].map((step, i) => (
              <div className="process-step" key={step}>
                <div className="process-num">{i + 1}</div>
                <p>{step}</p>
                {i < 3 && <span className="process-arrow">→</span>}
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default Services;
