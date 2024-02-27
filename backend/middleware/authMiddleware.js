const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.json({ message: "NO token" });
  }
});

module.exports = { protect };
