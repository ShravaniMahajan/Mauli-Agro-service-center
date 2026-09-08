const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const newPassword = "Admin@123";
    const hashed = await bcrypt.hash(newPassword, 10);
    const result = await User.findOneAndUpdate(
      { username: "admin" },
      { password: hashed, role: "admin" }
    );
    if (result) {
      console.log("✅ Admin password reset successfully!");
      console.log("   Username : admin");
      console.log("   Password : Admin@123");
      console.log("   Role     : admin");
    } else {
      console.log("❌ Admin user not found.");
    }
    mongoose.disconnect();
  })
  .catch(err => console.error("Error:", err));
