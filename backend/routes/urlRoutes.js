const express = require("express");
const {
  generateShortURL,
  redirect,
  getAnalytics,
  updateURL,
  deleteURL,
  getURLs,
} = require("../controllers/urlController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, generateShortURL);
router.get("/urls", protect, getURLs);
router
  .route("/:shortId")
  .get(redirect)
  .put(protect, updateURL)
  .delete(protect, deleteURL);
router.get("/analytics/:shortId", protect, getAnalytics);

module.exports = router;
