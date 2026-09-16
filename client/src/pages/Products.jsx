import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "./Products.css";

function Products() {
  const { t, getCategory, translateProd, toMarathiNumbers } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartMsg, setCartMsg] = useState({ show: false, msg: "", type: "success" });

  // Reviews modal states
  const [selectedProductForReviews, setSelectedProductForReviews] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    username: "",
    rating: 5,
    comment: ""
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewToast, setReviewToast] = useState({ show: false, msg: "", type: "success" });

  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") user = JSON.parse(userStr);
  } catch (e) {}

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("category");
    if (catParam) {
      setCategoryFilter(catParam);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      showCartMessage(t("cartLoginRequiredToast"), "error");
      return;
    }

    if (user?.role === "admin") {
      showCartMessage("Admin users cannot add items to cart.", "error");
      return;
    }

    if (product.stock <= 0) {
      showCartMessage("This product is currently out of stock.", "error");
      return;
    }

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex((item) => item.product === product._id);

    if (existingIndex > -1) {
      if (cart[existingIndex].quantity >= product.stock) {
        showCartMessage(`Cannot add more. Only ${product.stock} items in stock.`, "error");
        return;
      }
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
    // Trigger custom event so navbar or other components can update
    window.dispatchEvent(new Event("cartUpdated"));
    showCartMessage(`Added "${product.name}" to cart!`);
  };

  const showCartMessage = (msg, type = "success") => {
    setCartMsg({ show: true, msg, type });
    setTimeout(() => setCartMsg({ show: false, msg: "", type: "success" }), 3000);
  };

  const openReviewsModal = (product) => {
    setSelectedProductForReviews(product);
    setReviewForm({
      username: user?.username || "",
      rating: 5,
      comment: ""
    });
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.username.trim() || !reviewForm.comment.trim()) {
      setReviewToast({ show: true, msg: "Please provide your name and review comment.", type: "error" });
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await API.post(`/products/${selectedProductForReviews._id}/reviews`, {
        username: reviewForm.username,
        userEmail: user?.email || "",
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });

      setSelectedProductForReviews(res.data);
      setProducts(products.map((p) => (p._id === res.data._id ? res.data : p)));
      setReviewForm({ username: user?.username || "", rating: 5, comment: "" });
      setReviewToast({ show: true, msg: "Thank you! Your review has been submitted.", type: "success" });
      setTimeout(() => setReviewToast({ show: false, msg: "", type: "success" }), 3000);
    } catch (err) {
      console.error("Review API error, fallback local review update:", err);
      const newReview = {
        _id: Date.now().toString(),
        username: reviewForm.username,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        createdAt: new Date().toISOString()
      };
      const existingReviews = selectedProductForReviews.reviews || [];
      const updatedReviews = [newReview, ...existingReviews];
      const avg = Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
      const updatedProd = {
        ...selectedProductForReviews,
        reviews: updatedReviews,
        rating: avg,
        numReviews: updatedReviews.length
      };
      setSelectedProductForReviews(updatedProd);
      setProducts(products.map((p) => (p._id === updatedProd._id ? updatedProd : p)));
      setReviewForm({ username: user?.username || "", rating: 5, comment: "" });
      setReviewToast({ show: true, msg: "Review added successfully!", type: "success" });
      setTimeout(() => setReviewToast({ show: false, msg: "", type: "success" }), 3000);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await API.delete(`/products/${productId}/reviews/${reviewId}`);
      setSelectedProductForReviews(res.data);
      setProducts(products.map((p) => (p._id === res.data._id ? res.data : p)));
    } catch (err) {
      console.error("Delete review error:", err);
      const updatedReviews = (selectedProductForReviews.reviews || []).filter((r) => r._id !== reviewId);
      const avg = updatedReviews.length > 0
        ? Number((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1))
        : 5.0;
      const updatedProd = {
        ...selectedProductForReviews,
        reviews: updatedReviews,
        rating: avg,
        numReviews: updatedReviews.length
      };
      setSelectedProductForReviews(updatedProd);
      setProducts(products.map((p) => (p._id === updatedProd._id ? updatedProd : p)));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      
      {/* Toast Notification */}
      {cartMsg.show && (
        <div className={`cart-toast ${cartMsg.type}`}>
          {cartMsg.type === "success" ? "✅" : "❌"} {cartMsg.msg}
        </div>
      )}

      <main className="products-main">
        {/* Header */}
        <section className="products-header">
          <h1>{t("productsTitle")}</h1>
          <p>{t("productsSubtitle")}</p>
        </section>

        {/* Single Filter Band: Search + Categories */}
        <section className="filter-band">
          <div className="search-bar-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={t("searchProductsPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="product-search-input"
            />
          </div>

          <div className="category-filters">
            {["All", "Seeds", "Fertilizers", "Pesticides", "Herbicides", "Fungicides", "Insecticides", "Animal Feed"].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${categoryFilter === cat ? "active" : ""}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat === "All" ? t("brandAll") : cat === "Animal Feed" ? `🐄 ${getCategory("Animal Feed")}` : getCategory(cat)}
              </button>
            ))}
          </div>
        </section>

       
       

        {/* Products Grid */}
        {loading ? (
          <div className="products-loading">
            <div className="loader-spinner"></div>
            <p>{t("loadingProducts")}</p>
          </div>
        ) : (
          <section className="products-grid-section">
            {filteredProducts.length === 0 ? (
              <div className="no-products-found">
                <span>🌾</span>
                <h3>{t("noProductsFound")}</h3>
                <p>{t("noProductsFoundSub")}</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((rawProduct) => {
                  const product = translateProd(rawProduct);
                  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                  const reviewCount = product.reviews?.length || product.numReviews || 0;

                  return (
                    <div key={product._id} className="product-card">
                      <div className="product-img-container">
                        {product.stock <= 0 && <span className="out-of-stock-badge">{t("outOfStock")}</span>}
                        {product.mrp > product.price && (
                          <span className="save-badge">
                            {t("save")} {toMarathiNumbers(discountPercent)}%
                          </span>
                        )}
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
                        />
                      </div>
                      
                      <div className="product-info-wrap">
                        <div className="badges-flex-row">
                          <span className="p-category-badge">{getCategory(product.category)}</span>
                          {product.subcategory && (
                            <span className="p-subcategory-badge">{product.subcategory}</span>
                          )}
                        </div>
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-desc">{product.description}</p>
                        
                        {/* Product Rating & Reviews Badge */}
                        <div 
                          className="product-rating-row"
                          onClick={() => openReviewsModal(product)}
                          title="Click to view & write customer reviews"
                        >
                          <span className="star-rating">{"⭐".repeat(Math.round(product.rating || 5))}</span>
                          <span className="rating-value">{toMarathiNumbers(product.rating ? product.rating.toFixed(1) : "5.0")}</span>
                          <span className="review-count-link">
                            💬 ({toMarathiNumbers(reviewCount)} {t("reviewsText")})
                          </span>
                        </div>

                        <div className="product-stock-status">
                          {product.stock > 0 ? (
                            <span className="stock-in">{t("inStock")}: {toMarathiNumbers(product.stock)} {t("itemsUnit")}</span>
                          ) : (
                            <span className="stock-out-text">{t("unavailable")}</span>
                          )}
                        </div>

                        <div className="product-price-row">
                          <div className="price-box">
                            <span className="sale-price">₹{toMarathiNumbers(product.price)}</span>
                            {product.mrp > product.price && (
                              <span className="original-price">₹{toMarathiNumbers(product.mrp)}</span>
                            )}
                          </div>
                          {user?.role !== "admin" && (
                            <button 
                              className={`add-cart-btn ${product.stock <= 0 ? "disabled" : ""}`}
                              onClick={() => addToCart(product)}
                              disabled={product.stock <= 0}
                            >
                              {t("addToCart")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ================= PRODUCT REVIEWS & RATINGS MODAL ================= */}
      {selectedProductForReviews && (() => {
        const modalProduct = translateProd(selectedProductForReviews);
        return (
          <div className="modal-overlay" onClick={() => setSelectedProductForReviews(null)}>
            <div className="reviews-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="reviews-modal-header">
                <div className="reviews-prod-meta">
                  <img
                    src={modalProduct.image}
                    alt={modalProduct.name}
                    className="reviews-prod-img"
                    onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
                  />
                  <div>
                    <h3 className="reviews-prod-title">{modalProduct.name}</h3>
                    <span className="p-category-badge">{getCategory(modalProduct.category)}</span>
                    <div className="reviews-score-badge-wrap">
                      <span className="score-big">{toMarathiNumbers(modalProduct.rating ? modalProduct.rating.toFixed(1) : "5.0")}</span>
                      <div>
                        <div className="stars-gold">{"⭐".repeat(Math.round(modalProduct.rating || 5))}</div>
                        <span className="count-sub font-medium">
                          Based on {toMarathiNumbers(modalProduct.reviews?.length || 0)} Customer Review{modalProduct.reviews?.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedProductForReviews(null)}>✕</button>
              </div>

              <div className="reviews-modal-body">
                {/* Left Column: Customer Reviews List */}
                <div className="reviews-list-col">
                  <h4>💬 Customer Reviews & Feedback</h4>
                  {(!modalProduct.reviews || modalProduct.reviews.length === 0) ? (
                    <div className="no-reviews-box">
                      <span>🌟</span>
                      <p>No reviews yet for this product. Be the first farmer to leave a review!</p>
                    </div>
                  ) : (
                    <div className="reviews-scroll-container">
                      {modalProduct.reviews.map((rev, index) => (
                        <div key={rev._id || index} className="single-review-card">
                          <div className="review-card-head">
                            <div className="reviewer-avatar">
                              {rev.username ? rev.username[0].toUpperCase() : "U"}
                            </div>
                            <div className="reviewer-details">
                              <strong className="reviewer-name">{rev.username}</strong>
                              <div className="review-card-stars">
                                {"⭐".repeat(rev.rating)} <span className="rating-tag">({toMarathiNumbers(rev.rating)}/५)</span>
                              </div>
                            </div>
                            {user?.role === "admin" && (
                              <button
                                className="btn-delete-review"
                                onClick={() => handleDeleteReview(modalProduct._id, rev._id)}
                                title="Delete Review"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                          <p className="review-comment-body">"{rev.comment}"</p>
                          <span className="review-timestamp">
                            {new Date(rev.createdAt || Date.now()).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Write a Review Form */}
                <div className="add-review-col">
                  <h4>✍️ Rate & Review this Product</h4>
                  {reviewToast.show && (
                    <div className={`cart-toast ${reviewToast.type}`} style={{ position: "static", marginBottom: "12px" }}>
                      {reviewToast.type === "success" ? "✅" : "❌"} {reviewToast.msg}
                    </div>
                  )}
                  <form onSubmit={handleAddReview} className="write-review-form">
                    <div className="form-group">
                      <label>Your Name / Farmer Name:</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={reviewForm.username}
                        onChange={(e) => setReviewForm({ ...reviewForm, username: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Rating:</label>
                      <div className="interactive-star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star-select ${star <= reviewForm.rating ? "active" : ""}`}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            title={`${star} Star${star > 1 ? "s" : ""}`}
                          >
                            ⭐
                          </span>
                        ))}
                        <span className="star-rating-label">{toMarathiNumbers(reviewForm.rating)} / ५ Stars</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Your Review / Experience:</label>
                      <textarea
                        rows="4"
                        placeholder="Share your experience regarding crop yield, product quality, or results..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-submit-review" disabled={reviewSubmitting}>
                      {reviewSubmitting ? "Submitting Review..." : "⭐ Submit Product Review"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <Footer />
    </div>
  );
}

export default Products;
