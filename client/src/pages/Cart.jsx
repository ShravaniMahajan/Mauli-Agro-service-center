import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { t, getCategory, translateProd, toMarathiNumbers } = useLanguage();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  };

  const updateQuantity = (productId, delta) => {
    const updated = cartItems.map((item) => {
      if (item.product === productId) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        // Verify stock limit
        if (newQty > item.stock) {
          showToast(t("cartErrorStock"), "error");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (productId) => {
    const filtered = cartItems.filter((item) => item.product !== productId);
    setCartItems(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast(t("cartItemRemovedToast"));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast(t("cartLoginRequiredToast"), "error");
      return;
    }

    if (cartItems.length === 0) {
      showToast(t("cartEmptyToast"), "error");
      return;
    }

    if (!shippingAddress.trim()) {
      showToast(t("cartAddressRequiredToast"), "error");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        _id: "ord-" + Date.now(),
        items: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
        shippingAddress,
        paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      try {
        await API.post("/orders", orderData);
      } catch (e) {
        // Save to local orders
        const localOrders = JSON.parse(localStorage.getItem("mock_orders") || "[]");
        localOrders.push(orderData);
        localStorage.setItem("mock_orders", JSON.stringify(localOrders));
      }

      // Decrement local stock dynamically so UI is in sync without reload
      try {
        for (const item of cartItems) {
          await API.put(`/products/${item.product}/stock`, { quantitySold: item.quantity });
        }
      } catch (err) {
        // proceed
      }

      // Clear Cart
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));

      showToast(t("cartOrderSuccessToast"));
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Order error:", err);
      showToast(t("cartOrderFailToast"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      {toast.show && (
        <div className={`cart-toast ${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <main className="cart-main">
        <h1 className="cart-title">{t("cartShoppingTitle")}</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-box">
            <span>🛒</span>
            <h2>{t("cartEmptyTitle")}</h2>
            <p>{t("cartEmptyDesc")}</p>
            <button className="shop-now-btn" onClick={() => navigate("/products")}>
              {t("cartGoToStore")}
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Items List */}
            <div className="cart-items-panel">
              {cartItems.map((rawItem) => {
                const item = translateProd(rawItem);
                return (
                  <div key={item.product} className="cart-item-card">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = "https://mauliagroagency.in/images/shop-1.jpg"; }}
                    />
                    <div className="cart-item-details">
                      <span className="cart-item-cat">{getCategory(item.category)}</span>
                      <h3>{item.name}</h3>
                      <p className="cart-item-price-unit">{t("cartItemPriceUnit")}{toMarathiNumbers(item.price)}</p>
                      <button className="cart-item-remove" onClick={() => removeItem(item.product)}>
                        {t("cartItemRemove")}
                      </button>
                    </div>
                    
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.product, -1)}>-</button>
                        <span>{toMarathiNumbers(item.quantity)}</span>
                        <button onClick={() => updateQuantity(item.product, 1)}>+</button>
                      </div>
                      <p className="cart-item-total">₹{toMarathiNumbers(item.price * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout Form */}
            <div className="checkout-summary-panel">
              <div className="summary-card">
                <h2>{t("cartOrderSummary")}</h2>
                
                <div className="summary-row">
                  <span>{t("cartSubtotal")}</span>
                  <span>₹{toMarathiNumbers(calculateTotal())}</span>
                </div>
                <div className="summary-row">
                  <span>{t("cartShipping")}</span>
                  <span className="free-shipping">{t("cartFree")}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>{t("cartTotal")}</span>
                  <span>₹{toMarathiNumbers(calculateTotal())}</span>
                </div>

                <form onSubmit={handleCheckout} className="checkout-form">
                  <h3>{t("cartShippingPayment")}</h3>
                  
                  <div className="form-field">
                    <label htmlFor="address">{t("cartDeliveryAddress")}</label>
                    <textarea
                      id="address"
                      placeholder={t("cartDeliveryAddressPlaceholder")}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-field">
                    <label htmlFor="payment">{t("cartPaymentMethod")}</label>
                    <select
                      id="payment"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Cash on Delivery">{t("cartCod")}</option>
                      <option value="Online Payment">{t("cartOnlinePayment")}</option>
                    </select>
                  </div>

                  <button type="submit" className="place-order-btn" disabled={loading}>
                    {loading ? t("cartPlacingOrder") : `${t("cartPlaceOrder")} (₹${toMarathiNumbers(calculateTotal())})`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Cart;
