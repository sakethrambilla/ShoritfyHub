const jwt = require("jsonwebtoken");

//Generate JWT
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = { generateToken };
