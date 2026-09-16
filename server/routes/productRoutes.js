const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET all products (with optional filtering by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create product (Admin only)
router.post("/", adminMiddleware, async (req, res) => {
  try {
    const { name, category, description, price, mrp, stock, image, rating } = req.body;
    
    if (!name || !category || !description || price === undefined || mrp === undefined || stock === undefined) {
      return res.status(400).json({ message: "Missing required product details" });
    }

    const newProduct = new Product({
      name,
      category,
      description,
      price,
      mrp,
      stock,
      image,
      rating: rating || 5.0
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update product (Admin only)
router.put("/:id", adminMiddleware, async (req, res) => {
  try {
    const { name, category, description, price, mrp, stock, image, rating } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (mrp !== undefined) product.mrp = mrp;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image;
    if (rating !== undefined) product.rating = rating;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product (Admin only)
router.delete("/:id", adminMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST Add product review
router.post("/:id/reviews", async (req, res) => {
  try {
    const { username, userEmail, rating, comment } = req.body;
    if (!username || !rating || !comment) {
      return res.status(400).json({ message: "Username, rating, and comment are required" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = {
      username,
      userEmail: userEmail || "",
      rating: Number(rating),
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    
    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
    product.rating = Number((totalRating / product.reviews.length).toFixed(1));

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product review (Admin only)
router.delete("/:id/reviews/:reviewId", adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );
    product.numReviews = product.reviews.length;

    if (product.numReviews > 0) {
      const totalRating = product.reviews.reduce((sum, item) => sum + item.rating, 0);
      product.rating = Number((totalRating / product.reviews.length).toFixed(1));
    } else {
      product.rating = 5.0;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
