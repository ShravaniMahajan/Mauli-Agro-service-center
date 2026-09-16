import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import "./Brand.css";
import { useNavigate } from "react-router-dom";

const brands = [
  {
    id: 1,
    name: "MAHAAGRO",
    mrName: "महाॲग्रो",
    category: "Pesticides & Seeds",
    logo: "https://th.bing.com/th/id/OIP.qoaX-i-qqbcvgjzX1pSW4wHaD4?w=319&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "MG",
    color: "#c0392b",
  },
  {
    id: 2,
    name: "MAHADHAN",
    mrName: "महाधन",
    category: "Fertilizers",
    logo: "https://th.bing.com/th/id/OIP.cK1p7_DwQH7RlX1pSB-5UQHaDo?w=329&h=166&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "MD",
    color: "#e8940a",
  },
  {
    id: 3,
    name: "ADAMA",
    mrName: "अदामा",
    category: "Herbicides & Fungicides",
    logo: "https://th.bing.com/th/id/OIP.WvKMUdD4dX3mGFUPDTgXNQHaEe?w=253&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "AD",
    color: "#006884",
  },
  {
    id: 4,
    name: "CRYSTAL CROP",
    mrName: "क्रिस्टल क्रॉप",
    category: "Pesticides & Seeds",
    logo: "https://th.bing.com/th/id/OIP.yhoZLS7mPl6-I7rIiCnCWAHaEH?w=319&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "CC",
    color: "#27ae60",
  },
  {
    id: 5,
    name: "GHARDA",
    mrName: "घारडा",
    category: "Insecticides",
    logo: "https://th.bing.com/th/id/OIP.iKCQRuh4OxpRmx1Dl5DsCgHaED?w=299&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "GC",
    color: "#1565c0",
  },
  {
    id: 6,
    name: "DHANUKA",
    mrName: "धनुका",
    category: "Herbicides & Fungicides",
    logo: "https://th.bing.com/th/id/OIP.yhoZLS7mPl6-I7rIiCnCWAHaEH?w=319&h=180",
    fallback: "DH",
    color: "#1b5e20",
  },
  {
    id: 7,
    name: "FMC",
    mrName: "एफएमसी",
    category: "Insecticides",
    logo: "https://tse2.mm.bing.net/th/id/OIP._PqvIfhno-gwHE1EyGBvtwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    fallback: "FMC",
    color: "#e53935",
  },
  {
    id: 8,
    name: "BAYER",
    mrName: "बायार",
    category: "Pesticides & Seeds",
    logo: "https://th.bing.com/th/id/OIP.3mNaOooszTwWYp-rsL9btwHaEK?w=326&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "BY",
    color: "#01579b",
  },
  {
    id: 9,
    name: "SYNGENTA",
    mrName: "सिंजेंटा",
    category: "Seeds & Traits",
    logo: "https://th.bing.com/th/id/OIP.WvKMUdD4dX3mGFUPDTgXNQHaEe?w=253&h=180",
    fallback: "SYN",
    color: "#2e7d32",
  },
  {
    id: 10,
    name: "UPL",
    mrName: "यूपीएल",
    category: "Post-Harvest",
    logo: "https://th.bing.com/th/id/OIP.IvxnIFG5I0DCii6YwWeQ0AHaEY?w=249&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "UPL",
    color: "#d84315",
  },
  {
    id: 11,
    name: "IFFCO",
    mrName: "इफको",
    category: "Fertilizers",
    logo: "https://th.bing.com/th/id/OIP.xg0wBlcCIXBoXycii5Fe7AHaEK?w=275&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "IFF",
    color: "#1565c0",
  },
  {
    id: 12,
    name: "RALLIS",
    mrName: "रालीस",
    category: "Insecticides",
    logo: "https://th.bing.com/th/id/OIP.JM7aIMLY8_C8Vmal84diEQHaD4?w=318&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    fallback: "RL",
    color: "#6a1b9a",
  },
];

const categories = [
  { key: "brandAll", name: "All" },
  { key: "brandPestSeeds", name: "Pesticides & Seeds" },
  { key: "brandFert", name: "Fertilizers" },
  { key: "brandHerbFung", name: "Herbicides & Fungicides" },
  { key: "brandInsect", name: "Insecticides" },
  { key: "brandSeedsTraits", name: "Seeds & Traits" },
  { key: "brandPostHarvest", name: "Post-Harvest" }
];

// Fallback logo box renderer
function LogoBox({ brand }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="brand-logo-fallback"
        style={{ background: brand.color, color: "#fff" }}
      >
        {brand.fallback}
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="brand-logo-img"
      onError={() => setFailed(true)}
    />
  );
}

function Brand() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = brands.filter((b) => {
    const matchCat =
      activeCategory === "All" || b.category === activeCategory;
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.mrName && b.mrName.includes(search)) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="brand-main">

        {/* Hero */}
        <section className="brand-hero">
          <div className="brand-hero-content">
            <span className="brand-hero-badge">{t("brandHeroBadge")}</span>
            <h1>
              {t("brandHeroTitle").split("Brands")[0]}<span>Brands</span>{t("brandHeroTitle").split("Brands")[1] || " We Carry"}
            </h1>
            <p>{t("brandHeroDesc")}</p>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="brand-filter-section">
          <div className="brand-search-wrap">
            <span className="brand-search-icon">🔍</span>
            <input
              type="text"
              placeholder={t("brandSearchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="brand-search-input"
            />
          </div>
          <div className="brand-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`brand-tab ${activeCategory === cat.name ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                {t(cat.key)}
              </button>
            ))}
          </div>
        </section>

        {/* Brand Logo Grid */}
        <section className="brand-grid-section">
          <p className="brand-count">{filtered.length} {t("brandsFound")}</p>
          <div className="brand-logo-grid">
            {filtered.map((brand) => (
              <div
                className="brand-logo-card"
                key={brand.id}
                onClick={() => navigate("/dashboard")}
                title={`Explore ${brand.name} products`}
              >
                <div className="brand-logo-box">
                  <LogoBox brand={brand} />
                </div>
                <p className="brand-logo-name">
                  {lang === "mr" && brand.mrName ? brand.mrName : brand.name}
                </p>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="brand-empty">
              <p>
                No brands found for "
                <strong>{search || activeCategory}</strong>"
              </p>
              <button
                className="btn-outline"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="brand-cta">
          <h2>{t("brandCtaTitle")}</h2>
          <p>{t("brandCtaDesc")}</p>
          <button className="btn-primary" onClick={() => navigate("/contact")}>
            {t("brandCtaBtn")}
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Brand;
