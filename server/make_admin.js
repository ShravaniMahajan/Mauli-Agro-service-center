const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    // Update the 'admin' username account to role: admin
    const result = await User.findOneAndUpdate(
      { username: "admin" },
      { role: "admin" },
      { new: true }
    );
    if (result) {
      console.log(`✅ User '${result.username}' (${result.email}) promoted to ADMIN role.`);
    } else {
      console.log("❌ No user with username 'admin' found.");
    }
    mongoose.disconnect();
  })
  .catch(err => console.error("DB Error:", err));
