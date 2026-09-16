import React from 'react';
import './ProductCard.css';

function ProductCard({ image, name, price, description }) {
  let user = null;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") user = JSON.parse(userStr);
  } catch (e) {}

  return (
    <div className="product-card">
      <div className="product-image">
        <span className="product-emoji">{image}</span>
      </div>
      <div className="product-details">
        <h3>{name}</h3>
        <p>{description}</p>
        <div className="product-footer">
          <span className="price">₹{price}</span>
          {user?.role !== "admin" && (
            <button className="btn-add">Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

