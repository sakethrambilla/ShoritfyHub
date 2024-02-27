const express = require("express");
const {
  registerUser,
  loginUser,
  getUserData,
  logoutUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getUserData);

module.exports = router;
