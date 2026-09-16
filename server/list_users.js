const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    const users = await User.find({}, { password: 0 });
    console.log("ALL USERS IN DB:");
    users.forEach((u, i) => {
      console.log(`${i+1}. Username: ${u.username} | Email: ${u.email} | Role: ${u.role}`);
    });
    mongoose.disconnect();
  })
  .catch(err => console.error("DB Error:", err));
