const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Seeds", "Fertilizers", "Pesticides", "Herbicides", "Fungicides", "Insecticides", "Animal Feed"]
  },
  subcategory: {
    type: String,
    default: ""
  },
  benefits: {
    type: String,
    default: ""
  },
  usage: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mrp: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: "https://mauliagroagency.in/images/shop-1.jpg"
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      username: { type: String, required: true },
      userEmail: { type: String },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
