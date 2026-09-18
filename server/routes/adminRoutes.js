const express = require("express");
const router = express.Router();
const User = require("../models/User");
const adminMiddleware = require("../middleware/adminMiddleware");

// GET all users (admin only)
router.get("/users", adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ lastLogin: -1, createdAt: -1 });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET stats (admin only)
router.get("/stats", adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalAdmins = await User.countDocuments({ role: "admin" });
        res.json({ totalUsers, totalAdmins, total: totalUsers + totalAdmins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE a user (admin only)
router.delete("/users/:id", adminMiddleware, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE user role (admin only)
router.patch("/users/:id/role", adminMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        if (!["admin", "user"].includes(role))
            return res.status(400).json({ message: "Invalid role" });
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select("-password");
        res.json({ user: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
