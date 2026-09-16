import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const categoryTranslations = {
  en: {
    "Seeds": "SEEDS",
    "Fertilizers": "FERTILIZERS",
    "Pesticides": "PESTICIDES",
    "Pesticides & Seeds": "PESTICIDES & SEEDS",
    "Herbicides": "HERBICIDES",
    "Herbicides & Fungicides": "HERBICIDES & FUNGICIDES",
    "Fungicides": "FUNGICIDES",
    "Insecticides": "INSECTICIDES",
    "Animal Feed": "ANIMAL FEED",
    "Post-Harvest": "POST-HARVEST",
    "Organic": "ORGANIC"
  },
  mr: {
    "Seeds": "बियाणे",
    "Fertilizers": "खते",
    "Pesticides": "कीटकनाशके",
    "Pesticides & Seeds": "कीटकनाशके व बियाणे",
    "Herbicides": "तणनाशके",
    "Herbicides & Fungicides": "तणनाशके व बुरशीनाशके",
    "Fungicides": "बुरशीनाशके",
    "Insecticides": "कीटकनाशके",
    "Animal Feed": "पशुआहार",
    "Post-Harvest": "काढणीपश्चात",
    "Organic": "सेंद्रिय"
  }
};

export const productTranslations = {
  "Super Hybrid Wheat Seeds (SH-40)": {
    name: "सुपर हायब्रिड गव्हाचे बियाणे (SH-40)",
    description: "उत्कृष्ट उत्पादन देणारे संकरित गव्हाचे बियाणे. दुष्काळ सहन करण्याची क्षमता आणि तांबेरा रोगास प्रतिकारक. हिवाळी पेरणीसाठी अत्यंत योग्य."
  },
  "Premium Basmati Rice Seeds (Pusa-1121)": {
    name: "प्रीमियम बास्मती तांदूळ बियाणे (पुसा-११२१)",
    description: "सुगंधी आणि लांब दाण्याच्या तांदळाचे प्रमाणित बास्मती बियाणे. शिजण्यास अत्यंत उत्तम."
  },
  "Hybrid Cotton Seeds (BT-707)": {
    name: "संकरित कापूस बियाणे (BT-707)",
    description: "उत्कृष्ट धाग्याची लांबी आणि मजबूत धागा असलेले बोलगार्ड-२ कापूस बियाणे. अमेरिकन व गुलाबी बोंड अळीस उच्च प्रतिकारक."
  },
  "Organic Vermicompost Soil Booster": {
    name: "सेंद्रिय गांडूळ खत (सोल बूस्टर)",
    description: "१००% सेंद्रिय गांडूळ खत. जमिनीची सुपीकता वाढवते आणि मुळांची सशक्त वाढ करते."
  },
  "NPK 19-19-19 Soluble Plant Food": {
    name: "NPK १९-१९-१९ पाण्यात विरघळणारे खत",
    description: "नत्र, स्फुरद आणि पालाशचे संतुलित प्रमाण असलेले पाण्यात सहज विरघळणारे खत."
  },
  "DAP (Di-Ammonium Phosphate) 50kg": {
    name: "DAP (डी-अमोनिअम फॉस्फेट) ५० किलो",
    description: "जमिनीतील स्फुरदाचे प्रमाण वाढवण्यासाठी उच्च दर्जाचे DAP खत. सर्व पिकांसाठी उत्तम पायाभूत खत."
  },
  "Empala Broad-Spectrum Insecticide": {
    name: "एमपाला ब्रॉड-स्पेक्ट्रम कीटकनाशक",
    description: "इमामेक्टिन बेंझोएट आणि फिप्रोनिलचे प्रभावी मिश्रण. अळ्या, बोंड अळ्या आणि रस शोषणाऱ्या किडींवर प्रभावी."
  },
  "Katyayani Neem Shield Oil (10000 PPM)": {
    name: "कात्यायनी कडुनिंब संरक्षण तेल (१०,००० PPM)",
    description: "शुद्ध थंड पद्धतीने काढलेले कडुनिंब तेल. मावा, पांढरी माशी आणि तुडतुड्यांवर पर्यावरणपूरक उपाय."
  },
  "Glyphosate 41% SL Herbicide": {
    name: "ग्लायफोसेट ४१% SL तणनाशक",
    description: "वार्षिक आणि बहुवार्षिक तणांचा नायनाट करणारे प्रभावी तणनाशक."
  },
  "Atrazine 50% WP Weed Killer": {
    name: "ॲट्राझिन ५०% WP तणनाशक",
    description: "मका आणि उसासाठी पीकपूर्व आणि पीकपश्चात प्रभावी तणनाशक."
  },
  "Mancozeb 75% WP Fungicide": {
    name: "मँकोझेब ७५% WP बुरशीनाशक",
    description: "बटाटे व टोमॅटोवरील करपा रोगाविरुद्ध प्रभावी संरक्षणात्मक बुरशीनाशक."
  },
  "Propiconazole 25% EC Systemic Fungicide": {
    name: "प्रॉपिकोनाझोल २५% EC बुरशीनाशक",
    description: "तांबेरा, भुरी आणि पानांवरील ठिपक्यांवर अत्यंत प्रभावी सिस्टेमिक बुरशीनाशक."
  },
  "Chlorpyrifos 20% EC Insecticide": {
    name: "क्लोरपायरीफॉस २०% EC कीटकनाशक",
    description: "हुमणी आणि जमिनीतील कीटकांवर नियंत्रण मिळवणारे प्रभावी कीटकनाशक."
  },
  "Imidacloprid 17.8% SL Insecticide": {
    name: "इमिडाक्लोप्रिड १७.८% SL कीटकनाशक",
    description: "मावा, तुडतुडे व पांढऱ्या माशीवर अत्यंत प्रभावी सिस्टेमिक कीटकनाशक."
  },
  "Cattle Feed Pellets": {
    name: "जनावरांचे गोळी पशुआहार",
    description: "म्हशी व गाईंच्या दुधातील फॅट आणि पचनक्षमता वाढवणारा पोषक गोळी पशुआहार.",
    benefits: "उच्च ऊर्जेचा गोळी पशुआहार, दुधातील फॅट वाढवतो, पचन सुलभ करतो.",
    usage: "दररोज २ ते ४ किलो दर जनावराला गव्हाच्या भुश्श्यात मिसळून द्यावे."
  },
  "Oil Cakes": {
    name: "सरकी व मोहरीची पेंड",
    description: "प्रथिनांनी समृद्ध शुद्ध सरकी आणि मोहरीची पेंड, जी दुधाचे प्रमाण व SNF वाढवते.",
    benefits: "नैसर्गिक प्रथिने आणि स्निग्ध पदार्थांनी समृद्ध, दुधाचे प्रमाण व SNF वाढवते.",
    usage: "४ ते ६ तास पाण्यात भिजवून १ ते २ किलो पेंड पशुआहारात मिसळून द्यावी."
  },
  "High Protein Feed": {
    name: "उच्च प्रथिनांचा पशुआहार",
    description: "२२%+ बायपास प्रथिने असलेले दुधाळ जनावरांसाठी खास पशुआहार.",
    benefits: "२२%+ बायपास प्रथिने आणि आवश्यक ॲमिनो ॲसिडने भरपूर.",
    usage: "दररोज १.५ ते ३ किलो पशुआहार हिरव्या चाऱ्यासोबत द्यावा."
  },
  "Mineral Mixture Powder": {
    name: "मिनरल मिक्सचर पावडर",
    description: "जनावरांची रोगप्रतिकारशक्ती आणि प्रजनन क्षमता वाढवणारे खनिज मिश्रण.",
    benefits: "रोगप्रतिकारशक्ती आणि गाभण राहण्याची क्षमता सुधारते.",
    usage: "दररोज ५० ग्रॅम पावडर जनावराच्या आहारात मिसळावी."
  },
  "Calcium Supplements": {
    name: "कॅल्शियम सप्लीमेंट (द्रव)",
    description: "हाडे मजबूत करणारे आणि दुधाचे प्रमाण टिकवून ठेवणारे द्रव कॅल्शियम.",
    benefits: "हाडे मजबूत करते, दुधाची तीव्रता टिकवून ठेवते.",
    usage: "दररोज १०० मि.ली. तोंडावाटे किंवा सकाळी चाऱ्यामध्ये मिसळून द्यावे."
  },
  "Salt Lick Blocks": {
    name: "नॅचरल सॉल्ट लिक ब्लॉक",
    description: "जनावरांचे पचन सुधारणारा आणि इलेक्ट्रोलाइट्स संतुलित करणारा मिठाचा ब्लॉक.",
    benefits: "पचनक्रिया सुधारते आणि शरीरातील लवणांचे संतुलन राखते.",
    usage: "गोठ्यात जनावरांना चाटण्यासाठी सोयीस्कर उंचीवर बांधावे."
  },
  "Vitamin Tonics": {
    name: "मल्टी-व्हिटॅमिन टॉनिक",
    description: "जनावरांची कास निरोगी ठेवणारे आणि ताण कमी करणारे व्हिटॅमिन टॉनिक.",
    benefits: "कास निरोगी ठेवते, रोगप्रतिकारशक्ती वाढवते.",
    usage: "दररोज १० ते १५ मि.ली. पिण्याच्या पाण्यातून द्यावे."
  },
  "Animal Chana Churi Powder": {
    name: "जनावरांसाठी चणा चुरी पावडर",
    description: "महक इंडस्ट्रीजची उच्च दर्जाची जनावरांसाठी चणा चुरी पावडर. १८% ते २२% प्रथिने आणि १४% ते १८% फायबरयुक्त चणा साहित्यापासून तयार केलेली, जी दुधाळ जनावरांचे पोषण व आरोग्य वाढवते.",
    benefits: "१८-२२% प्रथिने व १४-१८% फायबर समृद्ध, जनावरांची पचनशक्ती, शारीरिक ताकद आणि दुधातील वाढ करण्यास उपयुक्त.",
    usage: "दररोज १ ते २ किलो चणा चुरी पावडर जनावरांच्या नेहमीच्या चाऱ्यामध्ये किंवा पशुआहारात मिसळून द्यावी."
  },
  "Rice DDGS Feed 40% Protein": {
    name: "राईस डीडीजीएस पशुआहार (४०% प्रोटीन)",
    description: "विजया एंटरप्रायझेसचे ४०% प्रथिनांनी समृद्ध राईस डीडीजीएस पशुआहार. दुधाळ जनावरांचे पोषण आणि दुधातील वाढ होण्यासाठी उत्कृष्ट.",
    benefits: "४०% प्रोटीन प्रमाण, जनावरांची पचनशक्ती वाढवते आणि दुधातील फॅट वाढवण्यास मदत करते.",
    usage: "दररोज जनावरांच्या आहारात आवश्यकतेनुसार मिसळून द्यावे."
  },
  "HAF Animal Feed Wheat Meal": {
    name: "HAF गव्हाचा भुस्सा पशुआहार (३९ किलो)",
    description: "हिंदुस्तान ॲनिमल फीड्सचे HAF गव्हाचा भुस्सा पशुआहार. ३९ किलो PP पॅकिंगमध्ये उपलब्ध, जनावरांच्या पचनासाठी उत्तम भरड पीठ.",
    benefits: "सुधारित पचनक्षमता, भुकेत वाढ आणि पशुआहारास संतुलित पोषण.",
    usage: "दररोज २ ते ३ किलो हिरव्या चाऱ्यासोबत किंवा पाण्यात भिजवून द्यावे."
  },
  "Buffalo Best Cattle Feed - Holstein Xtra Milk Buff": {
    name: "हॉल्स्टेन एक्स्ट्रा मिल्क बफ पशुआहार गोळ्या",
    description: "महाजन मोलासेस कंपनीचे हॉल्स्टेन एक्स्ट्रा मिल्क बफ गोळी पशुआहार. २२% प्रथिने आणि ६०% TDN ऊर्जेने समृद्ध, दुधाळ म्हशींसाठी उत्तम.",
    benefits: "२२% प्रोटीन व ६०% TDN ऊर्जा, दुधाळ काळात दूध उत्पादन आणि फॅट सर्वाधिक वाढवते.",
    usage: "दुधाळ म्हशींना दररोज ३ ते ५ किलो गोळी पशुआहार द्यावा."
  },
  "Soybean Meal Wheat Bran for Animal Feed": {
    name: "सोयाबीन मील आणि गव्हाचा भुस्सा पशुआहार (५०% प्रोटीन)",
    description: "मिडास ओव्हरसीजचे ५०% मिनीमम प्रथिनांनी समृद्ध सोयाबीन मील व गव्हाचा भुस्सा. दुधाळ जनावरांच्या स्नायूंच्या वाढीसाठी व आरोग्यासाठी उत्तम.",
    benefits: "५०% उच्च प्रथिने, जनावरांचे आरोग्य व शरीराची ताकद सुधारते.",
    usage: "दररोज नेहमीच्या पशुआहारात किंवा चाऱ्यामध्ये मिसळावे."
  },
  "Holstein Xtra Milk Prime - High Protein Cattle Feed": {
    name: "हॉल्स्टेन एक्स्ट्रा मिल्क प्राइम - हाय प्रोटीन पशुआहार (५० किलो)",
    description: "हॉल्स्टेनचे २४% प्रथिनांनी समृद्ध आणि ६०% TDN ऊर्जेने युक्त गोळी पशुआहार. दुधाळ गाईंसाठी आणि डेअरी फार्मसाठी खनिजांनी परिपूर्ण.",
    benefits: "२४% उच्च प्रथिने व ६०% TDN ऊर्जा, दुधाची फॅट आणि गाईंची शारीरिक ताकद वाढवते.",
    usage: "दुधाळ गाईंना दररोज ३ ते ५ किलो गोळी पशुआहार चाऱ्यासोबत द्यावा."
  },
  "Wheat Bran Animal Feed": {
    name: "गव्हाची भूसी पशुआहार (गेहूं का चोकर)",
    description: "उच्च दर्जाची गव्हाची भूसी (चोकर). १२-१५% प्रथिने, ५१-६५.२% कर्बोदके, नैसर्गिक फॉस्फरस व कॅल्शियमने समृद्ध, जी दुधाळ जनावरांचे पचन आणि दूध वाढवते.",
    benefits: "१२-१५% प्रथिने व भरपूर फायबर, नैसर्गिक फॉस्फरस आणि कॅल्शियम, जनावरांचे पचन व आरोग्य सुधारते.",
    usage: "दररोज २ ते ४ किलो गव्हाची भूसी हिरव्या चाऱ्यासोबत किंवा पाण्यात भिजवून द्यावी."
  }
};

export const translations = {
  en: {
    // Nav & Auth
    home: "HOME",
    aboutUs: "ABOUT US",
    products: "PRODUCTS",
    brands: "BRANDS",
    contactUs: "CONTACT US",
    enquiries: "ENQUIRIES",
    myPanel: "👤 My Panel",
    adminPanel: "🛡️ Admin Panel",
    cart: "🛒 Cart",
    signUp: "Sign Up",
    login: "Login",
    logout: "Logout",
    searchPlaceholder: "Search...",
    langName: "English",
    toggleLang: "मराठी",

    // Footer
    footerContactUs: "Contact Us",
    footerQuickLinks: "Quick Links",
    footerFollowUs: "Follow Us",

    // Dashboard / Hero
    heroTitlePrefix: "Cultivating Success With ",
    heroTitleSuffix: "Smart Krushi",
    heroSubtitle: "Empowering Indian farmers with certified seeds, balanced fertilizers, organic crop protection, and expert consultancy delivered directly to your farm gate.",
    shopProductsBtn: "Shop Products 🛒",
    ourStoryBtn: "Our Story 📖",
    shopByCategory: "Shop By Category",
    shopByCategorySub: "Explore our wide range of certified agricultural supplies",
    topRatedProducts: "Top Rated Products",
    topRatedSub: "Best-selling seeds and fertilizers recommended by agronomists",
    viewAllProducts: "View All Products →",
    viewDetails: "View Details",
    whyChooseTitle: "Empowering Farmers with Technology & Trust",
    whyChooseSub: "We bridge the gap between scientific innovation and traditional agriculture to ensure every farmer gets authentic inputs at honest prices.",
    faqTitle: "Frequently Asked Questions",
    faqSub: "Got questions? We've got clear answers for you.",
    newsletterTitle: "Join the Smart Krushi Community",
    newsletterSub: "Subscribe to receive weekly crop advisory, seasonal fertilizer tips, and exclusive discount alerts directly in your inbox.",
    subscribeBtn: "Subscribe Now 🚀",

    // Dashboard Why Choose Us
    wcu1Title: "Certified Hybrid & Bio Seeds",
    wcu1Desc: "Tested for maximum germination rate, vigor, and high climate resilience.",
    wcu2Title: "Balanced Soil & Crop Nutrition",
    wcu2Desc: "Enrich soil health and boost yield with bio-fertilizers and micronutrients.",
    wcu3Title: "Agronomist Guidance",
    wcu3Desc: "Direct support from agricultural experts on dosage, pest control, and seasonal planning.",
    wcu4Title: "Factory-Direct Transparent Rates",
    wcu4Desc: "No middlemen margins. Pay fair rates with verified invoice and fast delivery.",

    // Dashboard FAQs
    faq1Q: "Are all agricultural products on Smart Krushi 100% genuine?",
    faq1A: "Yes! All products are sourced directly from authorized manufacturers and verified distributors, ensuring 100% authentic inputs with full batch traceability.",
    faq2Q: "How fast will my order be delivered to my farm?",
    faq2A: "Most orders are dispatched within 24 hours. Delivery usually takes 2 to 4 business days depending on your village or city location.",
    faq3Q: "Can I consult an agricultural expert before purchasing?",
    faq3A: "Absolutely! You can interact with our AI Agri-Assistant chatbot anytime or contact our advisory team via the Contact page for crop-specific guidance.",
    faq4Q: "What payment methods do you support?",
    faq4A: "We support UPI, Net Banking, Debit/Credit Cards, and Cash on Delivery (COD) for selected postal codes.",

    // Product Categories
    catSeeds: "Seeds",
    catFertilizers: "Fertilizers",
    catPesticides: "Pesticides",
    catHerbicides: "Herbicides",
    catFungicides: "Fungicides",
    catInsecticides: "Insecticides",
    catAnimalFeed: "Animal Feed",

    // Common Actions / Product Info
    addToCart: "🛒 Add to Cart",
    inStock: "In Stock",
    outOfStock: "OUT OF STOCK",
    unavailable: "Unavailable",
    save: "Save",
    itemsUnit: "items",
    reviewsText: "reviews",
    benefits: "✨ Benefits:",
    usage: "📋 Usage:",

    // Products Page
    productsTitle: "Mauli Agro Agriculture Products",
    productsSubtitle: "Browse and buy high-quality seeds, fertilizers, and pesticides.",
    searchProductsPlaceholder: "Search products by name or description...",
    loadingProducts: "Loading premium products...",
    noProductsFound: "No Products Found",
    noProductsFoundSub: "We couldn't find any products matching your search criteria.",

    // About Page
    aboutHeroTitle: "Transforming Farming with Smart Tech & Genuine Inputs",
    aboutHeroDesc: "Smart Krushi bridges the gap between scientific innovation and traditional agriculture. We provide farmers across India with certified seeds, premium fertilizers, eco-friendly crop protection, and expert consultancy.",
    aboutStory: "Our Story",
    aboutStoryHeading: "Rooted in Passion, Driven by Agricultural Excellence",
    aboutStoryP1: "Founded in 2020 in Aitawade Budruk, Sangli (Maharashtra), Smart Krushi began with a singular mission: to eliminate fake agricultural inputs and empower rural farmers with genuine quality supplies at honest prices.",
    aboutStoryP2: "Over the years, we have evolved from a local consultancy into a comprehensive e-commerce marketplace. By sourcing directly from verified manufacturers, we ensure every bag of fertilizer, packet of seeds, and bottle of crop protection is 100% authentic and delivered straight to the farm gate.",
    aboutPromise: "Our Core Promise",
    aboutPromiseDesc: `"We commit to giving every farmer access to authentic, high-performing agricultural inputs backed by expert knowledge, fostering sustainable soil health and abundant harvests for generations to come."`,
    aboutTeam: "Smart Krushi Team",
    aboutLoc: "Sangli, Maharashtra",
    aboutMVV: "Our Mission, Vision & Core Values",
    missionTitle: "Our Mission",
    missionDesc: "To deliver top-tier seeds, fertilizers, pesticides, and modern farming solutions directly to farmers' doorsteps, maximizing crop yields and promoting sustainable agricultural practices.",
    visionTitle: "Our Vision",
    visionDesc: "To become India's most trusted digital agricultural ecosystem, bridging the gap between scientific innovation and traditional farming for a prosperous rural economy.",
    valuesTitle: "Core Values",
    valuesDesc: "Uncompromising quality, total transparency, farmer-first commitment, and relentless dedication to soil health and environmental sustainability.",
    aboutSolutions: "Complete Agriculture Solutions Under One Roof",
    whyChooseSeeds: "Certified Genuine Seeds",
    whyChooseSeedsDesc: "High-germination hybrid and organic seeds tested for maximum crop viability and climate resilience.",
    whyChooseFert: "Balanced Soil Fertilizers",
    whyChooseFertDesc: "Bio-fertilizers, micronutrients, and NPK formulas engineered to enrich soil structure and plant health.",
    whyChooseProt: "Targeted Crop Protection",
    whyChooseProtDesc: "Premium insecticides, fungicides, and herbicides to safeguard crops against pests and diseases.",
    whyChooseAdv: "Dedicated Expert Advisory",
    whyChooseAdvDesc: "Direct guidance from agricultural scientists on seasonal crop planning, dosage, and yield optimization.",
    aboutFarmerSays: "What Our Farmers Say",
    rameshQuote: "Smart Krushi delivered genuine sugarcane fertilizers right to my farm in Sangli. My crop yield increased by 25% this season!",
    rameshLoc: "Sangli, Maharashtra",
    sureshQuote: "Finding authentic pesticides used to be tough in our local market. Smart Krushi offers guaranteed products at transparent rates.",
    sureshLoc: "Kolhapur, Maharashtra",
    maheshQuote: "The agri-consultancy support helped me identify crop leaf infections early and saved my chili harvest from severe loss.",
    maheshLoc: "Satara, Maharashtra",
    aboutReadyTitle: "Ready to Elevate Your Farm’s Productivity?",
    aboutReadyDesc: "Explore certified seeds, fertilizers, and crop protection tools delivered right to your farm gate.",
    aboutCatalogBtn: "Browse Product Catalog",
    aboutExpertBtn: "Speak to an Expert",

    // Contact Page
    contactTitle: "CONTACT US",
    contactAdminTitle: "USER MESSAGES & ENQUIRIES",
    contactSuccessBanner: "Thank you! Your message has been sent successfully.",
    contactLabelName: "Name:",
    contactLabelMobile: "Mobile No. :",
    contactLabelEmail: "Email Address :",
    contactLabelMessage: "Message / Query :",
    contactPlaceholderName: "Enter your name",
    contactPlaceholderMobile: "Enter your Number",
    contactPlaceholderEmail: "name@example.com",
    contactPlaceholderMessage: "Enter Any Messages",
    contactBtnSend: "Send Message",
    contactAddressHeader: "ADDRESS",
    contactState: "State:",
    contactStateVal: "Maharashtra",
    contactDist: "Dist:",
    contactDistVal: "Sangli",
    contactPlace: "Place:",
    contactPlaceVal: "Aitawade Budruk",
    contactEmail: "Email:",
    contactMobile: "Mobile No:",

    // Brand Page
    brandHeroBadge: "Our Trusted Partners",
    brandHeroTitle: "World-Class Brands We Carry",
    brandHeroDesc: "We partner with globally recognized brands to bring you the most trusted, effective, and innovative agricultural products.",
    brandSearchPlaceholder: "Search brands or categories...",
    brandsFound: "brands found",
    brandCtaTitle: "Want to become a partner brand?",
    brandCtaDesc: "Join our growing network of trusted agricultural brands and reach thousands of farmers.",
    brandCtaBtn: "Get In Touch",
    brandAll: "All",
    brandPestSeeds: "Pesticides & Seeds",
    brandFert: "Fertilizers",
    brandHerbFung: "Herbicides & Fungicides",
    brandInsect: "Insecticides",
    brandSeedsTraits: "Seeds & Traits",
    brandPostHarvest: "Post-Harvest",

    // Cart Page
    cartShoppingTitle: "Shopping Cart",
    cartEmptyTitle: "Your Cart is Empty",
    cartEmptyDesc: "Looks like you haven't added any products to your cart yet.",
    cartGoToStore: "Go to Store",
    cartItemPriceUnit: "Price: ₹",
    cartItemRemove: "🗑️ Remove",
    cartOrderSummary: "Order Summary",
    cartSubtotal: "Subtotal",
    cartShipping: "Shipping",
    cartFree: "FREE",
    cartTotal: "Total",
    cartShippingPayment: "Shipping & Payment",
    cartDeliveryAddress: "Delivery Address",
    cartDeliveryAddressPlaceholder: "Enter full shipping address with pincode...",
    cartPaymentMethod: "Payment Method",
    cartCod: "Cash on Delivery (COD)",
    cartOnlinePayment: "Online Payment (Mock)",
    cartPlacingOrder: "Placing Order...",
    cartPlaceOrder: "Place Order",
    cartErrorStock: "Cannot exceed available stock.",
    cartItemRemovedToast: "Item removed from cart",
    cartLoginRequiredToast: "Please log in to place an order.",
    cartEmptyToast: "Your cart is empty.",
    cartAddressRequiredToast: "Please enter a valid shipping address.",
    cartOrderSuccessToast: "Order placed successfully! Redirecting...",
    cartOrderFailToast: "Failed to place order.",

    // Login & Register Pages
    loginTitle: "Welcome Back",
    loginSubtitle: "Sign in to your Smart Krushi account",
    usernameLabel: "Username or Email",
    passwordLabel: "Password",
    usernamePlaceholder: "Enter your username or email",
    passwordPlaceholder: "Enter your password",
    signingIn: "Signing in...",
    signInBtn: "Sign In",
    authOr: "or",
    noAccountText: "Don't have an account?",
    createAccountLink: "Create Account",
    secureLogin: "Secure Login",
    farmersCount: "50,000+ Farmers",
    trustedPlatform: "Trusted Platform",
    registerTitle: "Create Account",
    registerSubtitle: "Join the Smart Krushi community",
    fullNameLabel: "Full Name / Username",
    fullNamePlaceholder: "Enter your name",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordRegPlaceholder: "Create a strong password",
    roleLabel: "Role",
    roleUser: "User",
    roleAdmin: "Admin",
    creatingAccount: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    qualitySeeds: "Quality Seeds",
    fastDelivery: "Fast Delivery",
    bestPrices: "Best Prices"
  },
  mr: {
    // Nav & Auth
    home: "मुख्य पृष्ठ",
    aboutUs: "आमच्याबद्दल",
    products: "उत्पादने",
    brands: "ब्रँड्स",
    contactUs: "संपर्क करा",
    enquiries: "चौकशी",
    myPanel: "👤 माझे खाते",
    adminPanel: "🛡️ ॲडमिन पॅनेल",
    cart: "🛒 कार्ट",
    signUp: "नोंदणी करा",
    login: "लॉगिन",
    logout: "बाहेर पडा",
    searchPlaceholder: "शोधा...",
    langName: "मराठी",
    toggleLang: "English",

    // Footer
    footerContactUs: "संपर्क पत्ता",
    footerQuickLinks: "जलद लिंक्स",
    footerFollowUs: "सोशल मीडिया",

    // Dashboard / Hero
    heroTitlePrefix: "समृद्धीची शेती ",
    heroTitleSuffix: "स्मार्ट कृषी सोबत",
    heroSubtitle: "भारतीय शेतकऱ्यांना प्रमाणित बियाणे, संतुलित खते, सेंद्रिय पीक संरक्षण आणि तज्ज्ञ कृषी सल्ला थेट शेतापर्यंत पोहचवणे.",
    shopProductsBtn: "उत्पादने खरेदी करा 🛒",
    ourStoryBtn: "आमची माहिती 📖",
    shopByCategory: "श्रेणीनुसार खरेदी करा",
    shopByCategorySub: "आमच्या प्रमाणित कृषी साहित्याची विस्तृत श्रेणी शोधा",
    topRatedProducts: "सर्वोत्तम उत्पादने",
    topRatedSub: "कृषी तज्ज्ञांनी सुचवलेली सर्वोत्तम विक्री होणारी बियाणे व खते",
    viewAllProducts: "सर्व उत्पादने पहा →",
    viewDetails: "माहिती पहा",
    whyChooseTitle: "तंत्रज्ञान आणि विश्वासाने शेतकऱ्यांचे सक्षमीकरण",
    whyChooseSub: "आम्ही वैज्ञानिक संशोधन आणि पारंपारिक शेतीचा मेळ घालून प्रत्येक शेतकऱ्याला रास्त भावात अस्सल कृषी साहित्य उपलब्ध करून देतो.",
    faqTitle: "सतत विचारले जाणारे प्रश्न (FAQ)",
    faqSub: "काही प्रश्न आहेत? आमच्याकडे तुमच्या सर्व प्रश्नांची उत्तरे आहेत.",
    newsletterTitle: "स्मार्ट कृषी समुदायात सामील व्हा",
    newsletterSub: "दरमहा पीक सल्ला, खतांच्या टिप्स आणि खास सवलतींचे अलर्ट थेट मिळवण्यासाठी सबस्क्राईब करा.",
    subscribeBtn: "आत्ताच सबस्क्राईब करा 🚀",

    // Dashboard Why Choose Us
    wcu1Title: "प्रमाणित संकरित व सेंद्रिय बियाणे",
    wcu1Desc: "जास्त उगवण क्षमता आणि हवामान बदलांना तोंड देण्यासाठी तपासलेली बियाणे.",
    wcu2Title: "संतुलित जमीन आणि पीक पोषण",
    wcu2Desc: "सेंद्रिय खते आणि सूक्ष्म अन्नद्रव्यांनी जमिनीचे आरोग्य आणि उत्पादन वाढवा.",
    wcu3Title: "कृषी तज्ज्ञांचे मार्गदर्शन",
    wcu3Desc: "औषधांचे प्रमाण, कीड नियंत्रण आणि हंगामी नियोजनासाठी थेट तज्ज्ञांचे सहाय्य.",
    wcu4Title: "कारखान्यातून थेट पारदर्शक दर",
    wcu4Desc: "कोणतेही मध्यस्थ नाहीत. पक्क्या बिलासह वाजवी दरात जलद डिलिव्हरी मिळवा.",

    // Dashboard FAQs
    faq1Q: "स्मार्ट कृषीवरील सर्व उत्पादने १००% अस्सल आहेत का?",
    faq1A: "होय! सर्व उत्पादने थेट अधिकृत उत्पादक आणि मान्यताप्राप्त वितरकांकडून मिळवली जातात, ज्यामुळे १००% अस्सल साहित्याची हमी मिळते.",
    faq2Q: "माझ्या शेतापर्यंत ऑर्डर किती लवकर पोहोचेल?",
    faq2A: "बहुतेक ऑर्डर्स २४ तासांच्या आत पाठवल्या जातात. तुमच्या गावाच्या किंवा शहराच्या ठिकाणानुसार साधारण २ ते ४ दिवसांत डिलिव्हरी होते.",
    faq3Q: "मी खरेदी करण्यापूर्वी कृषी तज्ज्ञांचा सल्ला घेऊ शकतो का?",
    faq3A: "नक्कीच! तुम्ही आमच्या AI कृषी-सहाय्यक चॅटबॉटशी संवाद साधू शकता किंवा पिकांविषयी मार्गदर्शनासाठी संपर्क पानावरून आमच्या तज्ज्ञ टीमशी संपर्क साधू शकता.",
    faq4Q: "पेमेंटच्या कोणत्या पद्धती उपलब्ध आहेत?",
    faq4A: "आम्ही UPI, नेट बँकिंग, डेबिट/क्रेडिट कार्ड आणि निवडक पिनकोडवर कॅश ऑन डिलिव्हरी (COD) स्वीकारतो.",

    // Product Categories
    catSeeds: "बियाणे",
    catFertilizers: "खते",
    catPesticides: "कीटकनाशके",
    catHerbicides: "तणनाशके",
    catFungicides: "बुरशीनाशके",
    catInsecticides: "कीटकनाशके",
    catAnimalFeed: "पशुआहार",

    // Common Actions / Product Info
    addToCart: "🛒 कार्टमध्ये जोडा",
    inStock: "स्टॉकमध्ये उपलब्ध",
    outOfStock: "स्टॉक संपला",
    unavailable: "उपलब्ध नाही",
    save: "बचत",
    itemsUnit: "नग",
    reviewsText: "पुनरावलोकने",
    benefits: "✨ फायदे:",
    usage: "📋 वापर पद्धत:",

    // Products Page
    productsTitle: "माऊली ॲग्रो कृषी उत्पादने",
    productsSubtitle: "उच्च दर्जाची बियाणे, खते आणि कीटकनाशके शोधा आणि खरेदी करा.",
    searchProductsPlaceholder: "नाव किंवा वर्णनाद्वारे उत्पादने शोधा...",
    loadingProducts: "उत्कृष्ट उत्पादने लोड होत आहेत...",
    noProductsFound: "कोणतीही उत्पादने आढळली नाहीत",
    noProductsFoundSub: "आम्हाला तुमच्या शोधाशी जुळणारी उत्पादने सापडली नाहीत.",

    // About Page
    aboutHeroTitle: "स्मार्ट तंत्रज्ञान आणि अस्सल कृषी साहित्याने शेतीमध्ये क्रांती",
    aboutHeroDesc: "स्मार्ट कृषी वैज्ञानिक संशोधन आणि पारंपारिक शेतीमधील अंतर कमी करते. आम्ही भारतातील शेतकऱ्यांना प्रमाणित बियाणे, दर्जेदार खते, पर्यावरणपूरक पीक संरक्षण आणि तज्ज्ञांचा सल्ला पुरवतो.",
    aboutStory: "आमची कथा",
    aboutStoryHeading: "कृषी क्षेत्रातील उत्कृष्टतेसाठी समर्पित आणि कटिबद्ध",
    aboutStoryP1: "२०२० मध्ये ऐतवडे बुद्रुक, सांगली (महाराष्ट्र) येथे स्थापित, स्मार्ट कृषीची सुरुवात एका ध्येयाने झाली: बनावट कृषी साहित्यांचे समूळ उच्चाटन करणे आणि ग्रामीण शेतकऱ्यांना प्रामाणिक दरात अस्सल दर्जाचे साहित्य मिळवून देणे.",
    aboutStoryP2: "गेल्या काही वर्षांत, आम्ही एका स्थानिक सल्लागार केंद्रापासून एका डिजिटल ई-कॉमर्स बाजारपेठेत विकसित झालो आहोत. थेट उत्पादकांकडून माल मिळवून, आम्ही हे सुनिश्चित करतो की प्रत्येक खताची गोणी, बियाण्यांचे पाकीट आणि कीटकनाशकाची बाटली १००% अस्सल असेल.",
    aboutPromise: "आमचे मुख्य वचन",
    aboutPromiseDesc: `"आम्ही प्रत्येक शेतकऱ्याला तज्ज्ञांच्या सल्ल्यासह अस्सल आणि उच्च दर्जाचे कृषी साहित्य मिळवून देण्यास वचनबद्ध आहोत, जेणेकरून जमिनीचे आरोग्य आणि पुढील पिढ्यांसाठी उत्तम पीक उत्पादन टिकून राहील."`,
    aboutTeam: "स्मार्ट कृषी टीम",
    aboutLoc: "सांगली, महाराष्ट्र",
    aboutMVV: "आमचे ध्येय, दृष्टी आणि मूल्ये",
    missionTitle: "आमचे ध्येय",
    missionDesc: "शेतकऱ्यांच्या दारात सर्वोत्तम दर्जाचे बियाणे, खते, कीटकनाशके आणि आधुनिक शेतीचे उपाय पोहचवणे, पिकांचे उत्पादन वाढवणे आणि शाश्वत शेती पद्धतींना प्रोत्साहन देणे.",
    visionTitle: "आमची दृष्टी",
    visionDesc: "भारतातील सर्वात विश्वासू डिजिटल कृषी परिसंस्था बनणे, ग्रामीण अर्थव्यवस्थेच्या समृद्धीसाठी वैज्ञानिक संशोधन आणि पारंपारिक शेतीमधील दुवा साधणे.",
    valuesTitle: "आमची मूल्ये",
    valuesDesc: "दर्जाशी कोणतीही तडजोड न करणे, संपूर्ण पारदर्शकता, शेतकरी-प्रथम वचनबद्धता आणि जमिनीचे आरोग्य व पर्यावरण रक्षणासाठी निरंतर समर्पण.",
    aboutSolutions: "एकाच छताखाली शेतीचे संपूर्ण उपाय",
    whyChooseSeeds: "प्रमाणित अस्सल बियाणे",
    whyChooseSeedsDesc: "जास्त उगवण क्षमता असलेली संकरित आणि सेंद्रिय बियाणे, जी पिकांच्या चांगल्या वाढीसाठी आणि हवामान बदलांना तोंड देण्यासाठी उपयुक्त आहेत.",
    whyChooseFert: "संतुलित जमिनीची खते",
    whyChooseFertDesc: "जमिनीचे आरोग्य आणि झाडांची वाढ सुधारण्यासाठी डिझाइन केलेली सेंद्रिय खते, सूक्ष्म अन्नद्रव्ये आणि NPK फॉर्म्युले.",
    whyChooseProt: "लक्ष्यित पीक संरक्षण",
    whyChooseProtDesc: "पिकांना रोग आणि कीड यांपासून वाचवण्यासाठी दर्जेदार कीटकनाशके, बुरशीनाशके आणि तणनाशके.",
    whyChooseAdv: "समर्पित तज्ज्ञ सल्ला",
    whyChooseAdvDesc: "हंगामी पिकांचे नियोजन, औषधांचे प्रमाण आणि उत्पादन वाढीसाठी थेट कृषी शास्त्रज्ञांचे मार्गदर्शन.",
    aboutFarmerSays: "आमचे शेतकरी काय म्हणतात",
    rameshQuote: "स्मार्ट कृषीने माझ्या सांगली येथील शेतात थेट उसाचे अस्सल खत पोहोचवले. या हंगामात माझ्या उसाच्या उत्पादनात २५% वाढ झाली!",
    rameshLoc: "सांगली, महाराष्ट्र",
    sureshQuote: "आमच्या स्थानिक बाजारात अस्सल कीटकनाशके मिळणे कठीण होते. स्मार्ट कृषी अत्यंत वाजवी दरात हमी असलेली उत्पादने पुरवते.",
    sureshLoc: "कोल्हापूर, महाराष्ट्र",
    maheshQuote: "कृषी तज्ज्ञांच्या सल्ल्यामुळे मला मिरचीच्या पानांवरील रोगाची लागण लवकर समजली आणि माझे मोठे नुकसान टळले.",
    maheshLoc: "सातारा, महाराष्ट्र",
    aboutReadyTitle: "तुमच्या शेतीचे उत्पादन वाढवण्यासाठी तयार आहात का?",
    aboutReadyDesc: "थेट शेतापर्यंत पोहोचवले जाणारे प्रमाणित बियाणे, खते आणि पीक संरक्षण साधनांची माहिती मिळवा.",
    aboutCatalogBtn: "उत्पादन कॅटलॉग पहा",
    aboutExpertBtn: "तज्ज्ञांशी बोला",

    // Contact Page
    contactTitle: "संपर्क करा",
    contactAdminTitle: "वापरकर्त्यांचे संदेश आणि चौकशी",
    contactSuccessBanner: "धन्यवाद! आपला संदेश यशस्वीरित्या पाठवला गेला आहे.",
    contactLabelName: "नाव:",
    contactLabelMobile: "मोबाईल नंबर:",
    contactLabelEmail: "ईमेल पत्ता:",
    contactLabelMessage: "संदेश / प्रश्न:",
    contactPlaceholderName: "तुमचे नाव लिहा",
    contactPlaceholderMobile: "तुमचा नंबर लिहा",
    contactPlaceholderEmail: "नाव@उदाहरण.com",
    contactPlaceholderMessage: "तुमचा संदेश किंवा प्रश्न लिहा",
    contactBtnSend: "संदेश पाठवा",
    contactAddressHeader: "पत्ता",
    contactState: "राज्य:",
    contactStateVal: "महाराष्ट्र",
    contactDist: "जिल्हा:",
    contactDistVal: "सांगली",
    contactPlace: "ठिकाण:",
    contactPlaceVal: "ऐतवडे बुद्रुक",
    contactEmail: "ईमेल:",
    contactMobile: "मोबाईल नंबर:",

    // Brand Page
    brandHeroBadge: "आमचे विश्वासू भागीदार",
    brandHeroTitle: "आम्ही विक्री करत असलेले जागतिक ब्रँड्स",
    brandHeroDesc: "आम्ही तुम्हाला सर्वात विश्वासू, प्रभावी आणि नाविन्यपूर्ण कृषी उत्पादने देण्यासाठी जागतिक स्तरावर नामांकित ब्रँड्ससोबत भागीदारी करतो.",
    brandSearchPlaceholder: "ब्रँड किंवा श्रेणी शोधा...",
    brandsFound: "ब्रँड आढळले",
    brandCtaTitle: "तुम्हाला भागीदार ब्रँड बनायचे आहे का?",
    brandCtaDesc: "आमच्या वाढत्या विश्वासू कृषी ब्रँड्सच्या नेटवर्कमध्ये सामील व्हा आणि हजारो शेतकऱ्यांपर्यंत पोहोचा.",
    brandCtaBtn: "संपर्क साधा",
    brandAll: "सर्व",
    brandPestSeeds: "कीटकनाशके आणि बियाणे",
    brandFert: "खते",
    brandHerbFung: "तणनाशके आणि बुरशीनाशके",
    brandInsect: "कीटकनाशके",
    brandSeedsTraits: "बियाणे व गुणधर्म",
    brandPostHarvest: "काढणीपश्चात",

    // Cart Page
    cartShoppingTitle: "खरेदी कार्ट",
    cartEmptyTitle: "आपली कार्ट रिकामी आहे",
    cartEmptyDesc: "असे दिसते आहे की आपण अद्याप कार्टमध्ये कोणतीही उत्पादने जोडली नाहीत.",
    cartGoToStore: "खरेदी करा",
    cartItemPriceUnit: "किंमत: ₹",
    cartItemRemove: "🗑️ काढा",
    cartOrderSummary: "ऑर्डर सारांश",
    cartSubtotal: "एकूण रक्कम",
    cartShipping: "डिलिव्हरी शुल्क",
    cartFree: "मोफत",
    cartTotal: "एकूण देय",
    cartShippingPayment: "डिलिव्हरी आणि पेमेंट",
    cartDeliveryAddress: "डिलिव्हरी पत्ता",
    cartDeliveryAddressPlaceholder: "पिनकोडसह पूर्ण डिलिव्हरी पत्ता टाका...",
    cartPaymentMethod: "पेमेंट पद्धत",
    cartCod: "कॅश ऑन डिलिव्हरी (COD)",
    cartOnlinePayment: "ऑनलाईन पेमेंट (Mock)",
    cartPlacingOrder: "ऑर्डर दिली जात आहे...",
    cartPlaceOrder: "ऑर्डर करा",
    cartErrorStock: "उपलब्ध स्टॉकपेक्षा जास्त संख्या निवडता येणार नाही.",
    cartItemRemovedToast: "कार्टमधून उत्पादन काढले गेले",
    cartLoginRequiredToast: "ऑर्डर करण्यासाठी कृपया लॉगिन करा.",
    cartEmptyToast: "आपली कार्ट रिकामी आहे.",
    cartAddressRequiredToast: "कृपया वैध डिलिव्हरी पत्ता प्रविष्ट करा.",
    cartOrderSuccessToast: "ऑर्डर यशस्वीरित्या पूर्ण झाली! पुढे जात आहे...",
    cartOrderFailToast: "ऑर्डर पूर्ण करण्यात अपयश आले.",

    // Login & Register Pages
    loginTitle: "तुमचे स्वागत आहे",
    loginSubtitle: "तुमच्या स्मार्ट कृषी खात्यामध्ये साइन इन करा",
    usernameLabel: "वापरकर्तानाव किंवा ईमेल",
    passwordLabel: "पासवर्ड",
    usernamePlaceholder: "तुमचे वापरकर्तानाव किंवा ईमेल टाका",
    passwordPlaceholder: "तुमचा पासवर्ड टाका",
    signingIn: "साइन इन होत आहे...",
    signInBtn: "साइन इन करा",
    authOr: "किंवा",
    noAccountText: "खाते नाही का?",
    createAccountLink: "नवीन खाते तयार करा",
    secureLogin: "सुरक्षित लॉगिन",
    farmersCount: "५०,०००+ शेतकरी",
    trustedPlatform: "विश्वासू व्यासपीठ",
    registerTitle: "नवीन खाते तयार करा",
    registerSubtitle: "स्मार्ट कृषी समुदायात सामील व्हा",
    fullNameLabel: "पूर्ण नाव / वापरकर्तानाव",
    fullNamePlaceholder: "तुमचे पूर्ण नाव टाका",
    emailLabel: "ईमेल पत्ता",
    emailPlaceholder: "you@example.com",
    passwordRegPlaceholder: "एक मजबूत पासवर्ड तयार करा",
    roleLabel: "भूमिका",
    roleUser: "वापरकर्ता",
    roleAdmin: "ॲडमिन",
    creatingAccount: "खाते तयार होत आहे...",
    alreadyHaveAccount: "आधीपासूनच खाते आहे का?",
    qualitySeeds: "दर्जेदार बियाणे",
    fastDelivery: "जलद डिलिव्हरी",
    bestPrices: "उत्तम दर"
  }
};

export const toMarathiNumbers = (numStr) => {
  if (numStr === undefined || numStr === null) return "";
  const str = String(numStr);
  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return str.replace(/\d/g, (digit) => marathiDigits[digit]);
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_lang") || "en";
  });

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "mr" : "en";
    setLang(nextLang);
    localStorage.setItem("app_lang", nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  const formatNumber = (numStr) => {
    if (numStr === undefined || numStr === null) return "";
    const str = String(numStr);
    if (lang !== "mr") return str;
    const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return str.replace(/\d/g, (digit) => marathiDigits[digit]);
  };

  const getCategory = (cat) => {
    if (!cat) return "";
    const normalized = cat.trim();
    return categoryTranslations[lang]?.[normalized] || categoryTranslations["en"]?.[normalized] || cat;
  };

  const translateProd = (product) => {
    if (!product) return product;
    if (lang !== "mr") return product;
    const mrData = productTranslations[product.name];
    if (mrData) {
      return {
        ...product,
        name: mrData.name || product.name,
        description: mrData.description || product.description,
        benefits: mrData.benefits || product.benefits,
        usage: mrData.usage || product.usage
      };
    }
    return product;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, getCategory, translateProd, toMarathiNumbers: formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: "en",
      toggleLanguage: () => {},
      t: (key) => translations["en"]?.[key] || key,
      getCategory: (cat) => categoryTranslations["en"]?.[cat] || cat,
      translateProd: (p) => p,
      toMarathiNumbers: (n) => String(n)
    };
  }
  return context;
};
