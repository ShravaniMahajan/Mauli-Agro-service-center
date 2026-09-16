const Product = require("../models/Product");

const sampleProducts = [
  {
    name: "Super Hybrid Wheat Seeds (SH-40)",
    category: "Seeds",
    description: "High-yield hybrid wheat seeds. Tolerant to drought conditions and resistant to common rust diseases. Perfect for winter sowing.",
    price: 550,
    mrp: 800,
    stock: 120,
    image: "https://www.bing.com/th/id/OIP.nxqgA2cUEqCm3oDRgamihAHaI3?w=193&h=231&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2",
    rating: 4.8,
    numReviews: 2,
    reviews: [
      { username: "Rameshwar Patil", rating: 5, comment: "High germination rate! Harvest yield increased by 20% in Sangli.", createdAt: new Date() },
      { username: "Suresh Kulkarni", rating: 4, comment: "Quality wheat seeds with fast sprouting. Highly recommend.", createdAt: new Date() }
    ]
  },
  {
    name: "Premium Basmati Rice Seeds (Pusa-1121)",
    category: "Seeds",
    description: "Certified Basmati seeds yielding aromatic, long-grain rice. Excellent cooking quality and high elongation ratio.",
    price: 890,
    mrp: 1200,
    stock: 80,
    image: "https://images.unsplash.com/photo-1536630596251-b12ba0d7f7cf?w=600&q=80",
    rating: 4.7,
    numReviews: 2,
    reviews: [
      { username: "Mahesh Deshmukh", rating: 5, comment: "Aromatic basmati quality was top notch. Good resistance to leaf blast.", createdAt: new Date() },
      { username: "Anand Pawar", rating: 4, comment: "Pure seed quality, clean packaging.", createdAt: new Date() }
    ]
  },
  {
    name: "Organic Vermicompost Soil Booster",
    category: "Fertilizers",
    description: "100% organic earthworm castings fertilizer. Enriches soil structure, promotes root growth, and increases microbial activity.",
    price: 250,
    mrp: 400,
    stock: 200,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    rating: 4.6,
    numReviews: 1,
    reviews: [
      { username: "Ganesh Shinde", rating: 5, comment: "Softened soil and improved earthworm population in field.", createdAt: new Date() }
    ]
  },
  {
    name: "NPK 19-19-19 Soluble Plant Food",
    category: "Fertilizers",
    description: "Water-soluble fertilizer containing balanced nitrogen, phosphorus, and potassium. Enhances early crop establishment and vegetative growth.",
    price: 390,
    mrp: 600,
    stock: 150,
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80",
    rating: 4.5,
    numReviews: 1,
    reviews: [
      { username: "Vikram More", rating: 4, comment: "Dissolves completely in drip line. Excellent results.", createdAt: new Date() }
    ]
  },
  {
    name: "Empala Broad-Spectrum Insecticide",
    category: "Pesticides",
    description: "Combination of Emamectin Benzoate and Fipronil. Controls caterpillars, bollworms, leaf folders, and sucking pests efficiently.",
    price: 735,
    mrp: 1820,
    stock: 60,
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&q=80",
    rating: 4.4,
    numReviews: 1,
    reviews: [
      { username: "Nitin Bhosale", rating: 4, comment: "Effective control against sucking pests within 24 hours.", createdAt: new Date() }
    ]
  },
  {
    name: "Animal Chana Churi Powder",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "High-quality Animal Chana Churi Powder by Mahak Industries. Formulated with 18% to 22% protein and 14% to 18% fibre content from pure chana material, ideal for cattle & livestock nutrition.",
    benefits: "High protein (18-22%) & rich fibre content (14-18%) for cattle digestion, body strength and milk yield.",
    usage: "Mix 1-2 kg daily per animal with regular feed or cattle fodder.",
    price: 28,
    mrp: 40,
    stock: 150,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/8/333130131/MK/AW/AJ/15170914/chana-churi-500x500.jpg",
    rating: 4.1,
    numReviews: 385,
    reviews: [
      { username: "Mahak Industries Customer", rating: 4, comment: "Good quality chana churi powder for daily cattle feed.", createdAt: new Date() }
    ]
  }
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log("🌱 Default agricultural products seeded successfully.");
    } else {
      console.log(`🌾 Product database already has ${count} items. Skipping seeding.`);
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
};

module.exports = seedProducts;
