const express = require("express");
const router = express.Router();
const User = require("../models/User");

const authMiddleware =
require("../middleware/authMiddleware");

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json({ user });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const { username, email, phone, address } = req.body;
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateData },
        { new: true }
      ).select("-password");

      res.json({ success: true, user, msg: "Profile updated successfully!" });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ msg: "Failed to update profile" });
    }
  }
);

module.exports = router;