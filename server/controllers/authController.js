const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= LOGIN =================
exports.login = async (req, res) => {

    console.log("LOGIN API HIT");
    console.log(req.body);

    try {

        const { username, password } = req.body;

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });

        console.log("USER FOUND:", user);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);

        console.log("PASSWORD MATCH:", match);

        if (!match) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }

};



// ================= REGISTER =================
exports.register = async (req, res) => {

    console.log("REGISTER API HIT");
    console.log(req.body);

    try {

        const { username, email, password, role } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        // save to database
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

};