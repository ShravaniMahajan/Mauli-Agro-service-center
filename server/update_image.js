const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    // Find the first product (Super Hybrid Wheat Seeds (SH-40)) and update its image
    const result = await Product.updateOne(
      { $or: [{ name: "Mineral Mixture Powder" }, { name: "50Kg Mineral Mixture Powder for Cattle & Poultry" }] },
      { 
        $set: { 
          name: "50Kg Mineral Mixture Powder for Cattle & Poultry",
          description: "50Kg Mineral Mixture Powder for Cattle & Poultry (20% Calcium Content, Macro Mineral). Form: Powder. Enriched with essential macro minerals for cattle and poultry health.",
          price: 60,
          mrp: 90,
          image: "https://5.imimg.com/data5/SELLER/Default/2023/5/307670124/XR/SP/JT/68284511/mineral-mixture-powder-1000x1000.jpeg",
          rating: 4.3,
          numReviews: 47
        } 
      }
    );
    
    console.log("DB Update Result:", result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("DB Error:", err);
  });
