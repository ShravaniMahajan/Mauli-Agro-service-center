const express = require("express");
const router = express.Router();
const User = require("../models/User");

const authMiddleware =
require("../middleware/authMiddleware");

router.get(
"/profile",
authMiddleware,

async(req,res)=>{

const user =
await User.findById(req.user.id)
.select("-password");
res.json({
user

});

});

module.exports = router;