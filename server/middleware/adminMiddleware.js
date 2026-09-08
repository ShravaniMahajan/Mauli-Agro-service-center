const authMiddleware = require("./authMiddleware");

const adminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === "admin") {
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
    });
};

module.exports = adminMiddleware;
