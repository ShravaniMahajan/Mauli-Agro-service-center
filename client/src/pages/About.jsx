import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  const stats = [
    { number: "10,000+", label: "Farmers Empowered", icon: "👨‍🌾" },
    { number: "100%", label: "Genuine Products", icon: "🛡️" },
    { number: "15+", label: "States Reached", icon: "📍" },
    { number: "24/7", label: "Agri Expert Support", icon: "📞" },
  ];

  const coreValues = [
    {
      title: "Our Mission",
      icon: "🎯",
      desc: "To deliver top-tier seeds, fertilizers, pesticides, and modern farming solutions directly to farmers' doorsteps, maximizing crop yields and promoting sustainable agricultural practices."
    },
    {
      title: "Our Vision",
      icon: "🔭",
      desc: "To become India's most trusted digital agricultural ecosystem, bridging the gap between scientific innovation and traditional farming for a prosperous rural economy."
    },
    {
      title: "Core Values",
      icon: "💎",
      desc: "Uncompromising quality, total transparency, farmer-first commitment, and relentless dedication to soil health and environmental sustainability."
    }
  ];

  const whyChooseUs = [
    {
      icon: "🌱",
      title: "Certified Genuine Seeds",
      desc: "High-germination hybrid and organic seeds tested for maximum crop viability and climate resilience."
    },
    {
      icon: "🧪",
      title: "Balanced Soil Fertilizers",
      desc: "Bio-fertilizers, micronutrients, and NPK formulas engineered to enrich soil structure and plant health."
    },
    {
      icon: "🛡️",
      title: "Targeted Crop Protection",
      desc: "Premium insecticides, fungicides, and herbicides to safeguard crops against pests and diseases."
    },
    {
      icon: "👨‍🌾",
      title: "Dedicated Expert Advisory",
      desc: "Direct guidance from agricultural scientists on seasonal crop planning, dosage, and yield optimization."
    }
  ];

  const milestones = [
    {
      year: "2016",
      title: "Grassroots Inception",
      desc: "Founded as an agro-consultancy unit in Aitawade Budruk, Sangli (Maharashtra) to assist local farmers."
    },
    {
      year: "2018",
      title: "Direct Supply Chain",
      desc: "Partnered directly with certified manufacturers, eliminating middlemen and cutting costs for 2,000+ farmers."
    },
    {
      year: "2021",
      title: "Digital E-Commerce Launch",
      desc: "Launched Smart Krushi online platform enabling easy rural ordering and doorstep product delivery."
    },
    {
      year: "2024",
      title: "Pan-India Reach",
      desc: "Crossed 10,000+ registered farmers across 15+ states with an expanded catalog of 100+ specialized agro-inputs."
    },
    {
      year: "2026",
      title: "Smart Agri Technology",
      desc: "Integrating digital crop diagnostics, smart advisory tools, and rapid doorstep delivery networks."
    }
  ];

  const team = [
    {
      name: "Harshad Kar",
      role: "Founder & Lead Director",
      bio: "Passionate about rural technology and dedicated to making farming sustainable and profitable for Indian farmers.",
      image: "👨‍💼"
    },
    {
      name: "Dr. Rajesh Patil",
      role: "Chief Agricultural Advisor",
      bio: "15+ years of experience in agronomy, soil chemistry, and sustainable plant protection strategies.",
      image: "👨‍🔬"
    },
    {
      name: "Aniket Shinde",
      role: "Head of Operations & Logistics",
      bio: "Ensures authentic products reach even the most remote farm gates reliably and on schedule.",
      image: "🚚"
    }
  ];

  const testimonials = [
    {
      quote: "Smart Krushi delivered genuine sugarcane fertilizers right to my farm in Sangli. My crop yield increased by 25% this season!",
      name: "Rameshwar Patil",
      location: "Sangli, Maharashtra"
    },
    {
      quote: "Finding authentic pesticides used to be tough in our local market. Smart Krushi offers guaranteed products at transparent rates.",
      name: "Suresh Kulkarni",
      location: "Kolhapur, Maharashtra"
    },
    {
      quote: "The agri-consultancy support helped me identify crop leaf infections early and saved my chili harvest from severe loss.",
      name: "Mahesh Deshmukh",
      location: "Satara, Maharashtra"
    }
  ];

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ===== HERO BANNER ===== */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container about-hero-content">

          <h1 className="about-hero-title">
            Transforming Farming with <span className="highlight-text">Smart Tech</span> & <span className="highlight-text">Genuine Inputs</span>
          </h1>
          <p className="about-hero-desc">
            Smart Krushi bridges the gap between scientific innovation and traditional agriculture.
            We provide farmers across India with certified seeds, premium fertilizers, eco-friendly crop protection, and expert consultancy.
          </p>
          <div className="about-hero-actions">
            <Link to="/products" className="btn-primary hero-btn">Explore Products</Link>
            <Link to="/contact" className="btn-outline hero-btn-outline">Contact Agri Experts</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <span className="stat-icon">{stat.icon}</span>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR STORY / WHO WE ARE ===== */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-text-col">
              <span className="sub-title">Our Story</span>
              <h2 className="story-heading">Rooted in Passion, Driven by Agricultural Excellence</h2>
              <p className="story-p">
                Founded in 2020 in <strong>Aitawade Budruk, Sangli (Maharashtra)</strong>, Smart Krushi began with a singular mission: to eliminate fake agricultural inputs and empower rural farmers with genuine quality supplies at honest prices.
              </p>
              <p className="story-p">
                Over the years, we have evolved from a local consultancy into a comprehensive e-commerce marketplace. By sourcing directly from verified manufacturers, we ensure every bag of fertilizer, packet of seeds, and bottle of crop protection is 100% authentic and delivered straight to the farm gate.
              </p>

              <div className="story-highlights">
                <div className="highlight-item">
                  <span className="hl-check">✓</span>
                  <span>Direct Factory Sourcing</span>
                </div>
                <div className="highlight-item">
                  <span className="hl-check">✓</span>
                  <span>100% Guaranteed Authenticity</span>
                </div>
                <div className="highlight-item">
                  <span className="hl-check">✓</span>
                  <span>Transparent Doorstep Delivery</span>
                </div>
                <div className="highlight-item">
                  <span className="hl-check">✓</span>
                  <span>Scientific Crop Guidance</span>
                </div>
              </div>
            </div>

            <div className="story-card-col">
              <div className="story-accent-card">
                <div className="story-card-icon">🌾</div>
                <h3>Our Core Promise</h3>
                <p>
                  "We commit to giving every farmer access to authentic, high-performing agricultural inputs backed by expert knowledge, fostering sustainable soil health and abundant harvests for generations to come."
                </p>
                <div className="story-card-footer">
                  <strong>Smart Krushi Team</strong>
                  <span>Sangli, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MISSION, VISION & CORE VALUES ===== */}
      <section className="mission-section">
        <div className="container">
          <div className="section-header center">
            <span className="sub-title">Pillars of Smart Krushi</span>
            <h2>Our Mission, Vision & Core Values</h2>
            <p>Guiding principles that steer our commitment toward Indian farmers.</p>
          </div>

          <div className="mission-grid">
            {coreValues.map((item, idx) => (
              <div key={idx} className="mission-card">
                <div className="mission-card-header">
                  <span className="mission-icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-header center">
            <span className="sub-title">Why Smart Krushi</span>
            <h2>Complete Agriculture Solutions Under One Roof</h2>
            <p>Empowering your farm with quality, convenience, and scientific advice.</p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="why-card">
                <div className="why-icon-box">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ===== TESTIMONIALS / FARMER REVIEWS ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header center">
            <span className="sub-title">Farmer Testimonials</span>
            <h2>What Our Farmers Say</h2>
            <p>Real stories of impact and success across Maharashtra and beyond.</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="quote-icon">“</div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION (CTA) ===== */}
      <section className="about-cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Elevate Your Farm’s Productivity?</h2>
            <p>Explore certified seeds, fertilizers, and crop protection tools delivered right to your farm gate.</p>
            <div className="cta-buttons">
              <Link to="/products" className="btn-primary cta-btn">Browse Product Catalog</Link>
              <Link to="/contact" className="btn-outline cta-btn-outline">Speak to an Expert</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
