const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    await Product.deleteMany({});
    console.log("SUCCESS: All products deleted from database.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB Error:", err);
  });
