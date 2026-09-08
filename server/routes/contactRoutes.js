const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Default initial mock messages if DB is empty
const defaultMessages = [
  {
    name: "Ravi",
    email: "r@gmail.com",
    mobile: "98xxx",
    message: "Need seeds"
  },
  {
    name: "Amit",
    email: "a@gmail.com",
    mobile: "99xxx",
    message: "Price query"
  }
];

// GET all contact messages (Admin)
router.get("/", async (req, res) => {
  try {
    let messages = await Contact.find().sort({ createdAt: -1 });
    // Seed default messages if collection is empty
    if (messages.length === 0) {
      messages = await Contact.insertMany(defaultMessages);
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST send new contact message (User)
router.post("/", async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newMessage = new Contact({ name, email, mobile, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", contact: newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE contact message by ID (Admin)
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
