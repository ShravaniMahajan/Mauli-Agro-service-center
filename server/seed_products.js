const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const products = [
  // Seeds
  {
    name: "Super Hybrid Wheat Seeds (SH-40)",
    category: "Seeds",
    description: "High-yield hybrid wheat seeds. Tolerant to drought conditions and resistant to common rust diseases. Perfect for winter sowing.",
    price: 550, mrp: 800, stock: 120,
    image: "https://www.bing.com/th/id/OIP.nxqgA2cUEqCm3oDRgamihAHaI3?w=193&h=231&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2",
    rating: 4.8
  },
  {
    name: "Premium Basmati Rice Seeds (Pusa-1121)",
    category: "Seeds",
    description: "Certified Basmati seeds yielding aromatic, long-grain rice. Excellent cooking quality and high elongation ratio.",
    price: 890, mrp: 1200, stock: 80,
    image: "https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.7
  },
  {
    name: "Hybrid Cotton Seeds (BT-707)",
    category: "Seeds",
    description: "Bollgard-II cotton seeds with superior fiber length and strength. High resistance to American Bollworm and Pink Bollworm.",
    price: 750, mrp: 1100, stock: 100,
    image: "https://img2.exportersindia.com/product_images/bc-full/2023/9/8807686/pinnacle-bgii-bt-hybrid-cotton-seeds-1625723007-5888653.jpg",
    rating: 4.6
  },
  // Fertilizers
  {
    name: "Organic Vermicompost Soil Booster",
    category: "Fertilizers",
    description: "100% organic earthworm castings fertilizer. Enriches soil structure and promotes root growth.",
    price: 250, mrp: 400, stock: 200,
    image: "https://www.bing.com/th?id=OPAC.ylY7ZIqGhFsp4w474C474&o=5&pid=21.1&w=140&h=140&rs=1&qlt=100&dpr=1.3&o=2",
    rating: 4.6
  },
  {
    name: "NPK 19-19-19 Soluble Plant Food",
    category: "Fertilizers",
    description: "Water-soluble fertilizer containing balanced nitrogen, phosphorus, and potassium. Enhances crop establishment.",
    price: 390, mrp: 600, stock: 150,
    image: "https://m.media-amazon.com/images/I/41J7KsiPRIL._SX342_SY445_QL70_ML2_.jpg",
    rating: 4.5
  },
  {
    name: "DAP (Di-Ammonium Phosphate) 50kg",
    category: "Fertilizers",
    description: "Premium quality DAP fertilizer for soil phosphorus enrichment. Excellent starter fertilizer for all crops.",
    price: 1350, mrp: 1800, stock: 75,
    image: "https://th.bing.com/th/id/OIP.MMgyq6nLFlp3g1DxOzyQsQHaHa?w=179&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.4
  },
  // Pesticides
  {
    name: "Empala Broad-Spectrum Insecticide",
    category: "Pesticides",
    description: "Combination of Emamectin Benzoate and Fipronil. Controls caterpillars, bollworms, and sucking pests efficiently.",
    price: 735, mrp: 1820, stock: 60,
    image: "https://th.bing.com/th/id/OIP.DqaAf5X21adHcdk96JMoxAHaHa?w=156&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.4
  },
  {
    name: "Katyayani Neem Shield Oil (10000 PPM)",
    category: "Pesticides",
    description: "Pure cold-pressed neem oil formulation. Eco-friendly organic pest management for aphids and mites.",
    price: 690, mrp: 890, stock: 90,
    image: "https://th.bing.com/th/id/OIP.iXzLeDnafP1VE3cHMiey0AHaE8?w=296&h=197&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.9
  },
  // Herbicides
  {
    name: "Glyphosate 41% SL Herbicide",
    category: "Herbicides",
    description: "Systemic, broad-spectrum herbicide effective against annual and perennial weeds. Easy to apply with quick results.",
    price: 480, mrp: 700, stock: 110,
    image: "https://th.bing.com/th/id/OIP.yo6LTgX33igvWjAUe43fXQHaJa?w=208&h=264&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.5
  },
  {
    name: "Atrazine 50% WP Weed Killer",
    category: "Herbicides",
    description: "Pre and post-emergent selective herbicide for maize and sugarcane. Controls grass and broadleaf weeds effectively.",
    price: 320, mrp: 500, stock: 95,
    image: "https://th.bing.com/th/id/OIP._-5Mq8TcAuvljRT4DmxXbgHaHa?w=190&h=191&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.3
  },
  // Fungicides
  {
    name: "Mancozeb 75% WP Fungicide",
    category: "Fungicides",
    description: "Protective contact fungicide effective against early blight, late blight, and downy mildew in potatoes and tomatoes.",
    price: 290, mrp: 450, stock: 130,
    image: "https://tse2.mm.bing.net/th/id/OIP.lsNSLh5Lsqetz9eU9mtrsQHaKX?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.6
  },
  {
    name: "Propiconazole 25% EC Systemic Fungicide",
    category: "Fungicides",
    description: "Systemic fungicide with curative and protective action. Highly effective against rust, powdery mildew, and leaf spots.",
    price: 560, mrp: 800, stock: 70,
    image: "https://th.bing.com/th/id/OIP.OlRM4UyP78nsXy9TN6i55AAAAA?w=170&h=349&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.7
  },
  // Insecticides
  {
    name: "Chlorpyrifos 20% EC Insecticide",
    category: "Insecticides",
    description: "Broad-spectrum organophosphate insecticide for controlling cutworms, armyworms, and soil insects in multiple crops.",
    price: 420, mrp: 650, stock: 85,
    image: "https://www.kisanshop.in/uploads/gsp-chlorocil-chlorpyrifos-20-ec-insecticide.jpg",
    rating: 4.3
  },
  {
    name: "Imidacloprid 17.8% SL Insecticide",
    category: "Insecticides",
    description: "Systemic neonicotinoid insecticide. Highly effective against sucking insects like aphids, whiteflies, and thrips.",
    price: 650, mrp: 950, stock: 65,
    image: "https://th.bing.com/th/id/OIP.5jA84GRyPJKWj5-9vAkHLQHaM_?w=188&h=331&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.8
  },
  // Animal Feed -> Buffalo Feed
  // Section 1: Organic & Concentrate Animal Feed
  {
    name: "Organic Groundnut Cake",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "100% Organic Groundnut Cake cattle feed (Swadeshi, Madhugiri, Karnataka). Form: Cake | Color: Brown | Organic: Yes. High in protein and crude fat for optimal livestock nutrition.",
    benefits: "Swadeshi Organic Groundnut Cake. Boosts milk fat percentage, enhances digestion & overall cattle health.",
    usage: "Provide 1-2 kg daily per animal. Soak in clean water or mix directly with cattle feed mash.",
    price: 56, mrp: 80, stock: 100,
    image: "/organic_groundnut_cake.png",
    rating: 4.9
  },
  {
    name: "50Kg Mineral Mixture Powder for Cattle & Poultry",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Mineral Mixture & Supplements",
    description: "50Kg Mineral Mixture Powder for Cattle & Poultry (20% Calcium Content, Macro Mineral). Form: Powder. Enriched with essential macro minerals for cattle and poultry health.",
    benefits: "20% Calcium macro minerals, boosts immunity and overall livestock health.",
    usage: "Mix 50g daily in regular feed mash for cattle or poultry.",
    price: 60, mrp: 90, stock: 120,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/5/307670124/XR/SP/JT/68284511/mineral-mixture-powder-1000x1000.jpeg",
    rating: 4.3,
    numReviews: 47
  },
  {
    name: "Calcium 1200 mg with Vitamin D3 Supplements",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Mineral Mixture & Supplements",
    description: "Calcium 1200 mg with Vitamin D3 - Per Serving Bone Health & Strength Support Supplement. Enriched with Vitamin D & Calcium for bone strength support and overall livestock health.",
    benefits: "Bioavailable calcium 1200 mg with Vit D3, strengthens bones, prevents milk fever, and maintains peak livestock health.",
    usage: "Administer as per recommended daily dosage or mix into daily feed ration.",
    price: 450, mrp: 600, stock: 90,
    image: "https://www.bing.com/th/id/OIP.NxW8Wcj_JZLcjGOp2yOvRwHaMs?w=193&h=327&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=ImgAns&rm=2",
    rating: 4.6,
    numReviews: 84
  },
  {
    name: "Animal Chana Churi Powder",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "High-quality Animal Chana Churi Powder by Mahak Industries. Formulated with 18% to 22% protein and 14% to 18% fibre content from pure chana material, ideal for cattle & livestock nutrition.",
    benefits: "High protein (18-22%) & rich fibre content (14-18%) for cattle digestion, body strength and milk yield.",
    usage: "Mix 1-2 kg daily per animal with regular feed or cattle fodder.",
    price: 28, mrp: 40, stock: 150,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/8/333130131/MK/AW/AJ/15170914/chana-churi-500x500.jpg",
    rating: 4.1,
    numReviews: 385
  },
  },
  {
    name: "Soybean Meal Wheat Bran for Animal Feed",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "Soybean Meal Wheat Bran animal feed by Midas Overseas with 50% min protein content. Ideal for dairy cattle and livestock feed formulation.",
    benefits: "50% min high protein soybean meal, excellent amino acid profile for muscle & milk health.",
    usage: "Mix with coarse fodder or grain feed daily.",
    price: 24, mrp: 35, stock: 200,
    image: "https://th.bing.com/th/id/OIP.M5RnNiL3PLRAsfShqoYLmgHaHa?w=201&h=189&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    rating: 4.4,
    numReviews: 146
  },
  {
    name: "Holstein Xtra Milk Prime - High Protein Cattle Feed",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "Holstein Xtra Milk Prime high-protein cattle feed pellets (24% Protein & 60% TDN Energy) enriched with essential minerals for milking cows and dairy farm livestock.",
    benefits: "24% Protein & 60% TDN energy with minerals, maximizes milk production and improves cow stamina in milking stage.",
    usage: "Feed 3-5 kg daily per milking cow mixed with clean fodder or water.",
    price: 2040, mrp: 2500, stock: 80,
    image: "https://5.imimg.com/data5/SELLER/Default/2025/12/568694906/VC/ET/ZZ/1937530/holstein-xtra-milk-prime-pellet-cow-feed-50-kg-500x500.jpg",
    rating: 4.7,
    numReviews: 95
  },
  {
    name: "Wheat Bran Animal Feed",
    category: "Animal Feed",
    subcategory: "Buffalo Feed - Concentrate Feed (High Nutrition)",
    description: "Supreme quality Wheat Bran animal feed (गेहूं की भूसी / चोकर). Formulated with 12-15% crude protein, 51-65.2% carbohydrates, natural phosphorus (0.50-1.47%) and calcium for optimal digestion and milk production in cattle & livestock.",
    benefits: "12-15% Crude protein & rich fiber, natural phosphorus and calcium, promotes digestive health and milk yield.",
    usage: "Feed 2-4 kg daily per animal mixed with green fodder, water, or cattle mash.",
    price: 350, mrp: 480, stock: 120,
    image: "https://tse1.mm.bing.net/th/id/OIP.8-84pkoNZU2JdRFgs37yiQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    rating: 4.8,
    numReviews: 112
  }
];

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products across all categories!`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  });
