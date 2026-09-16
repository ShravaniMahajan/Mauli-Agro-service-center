const express = require("express");

const router = express.Router();

const { login, register } = require("../controllers/authController");

console.log("Auth route loaded");


router.post("/login", login);
router.post("/register", register);


module.exports = router;