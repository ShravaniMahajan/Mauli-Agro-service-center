const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const products = await Product.find();
    console.log("TOTAL PRODUCTS IN DB:", products.length);
    products.forEach((p, i) => {
      console.log(`${i+1}: ${p.name} - ID: ${p._id}`);
    });
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB Error:", err);
  });
