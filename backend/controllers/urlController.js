const URL = require("../models/urlModel");
const shortid = require("shortid");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const isUrlHttp = require("is-url-http");

// @desc Genearate Short URL
// @route POST /url/
// @access private
const generateShortURL = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const shortID = shortid();

  const generateURL = await URL.create({
    user: req.user.id,
    shortId: shortID,
    redirectURL: url,
    visitHistory: [],
  });
  if (generateURL) {
    return res.status(200).json({ message: "Short URL Generated" });
  } else {
    throw new Error({ message: "Short URL not Created" });
  }
});

// @desc Redirect short URL
// @route GET /url/:shortid
// @access public
const redirect = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

// @desc Get all short urls
// @route GET /url/urls
// @access Private
const getURLs = asyncHandler(async (req, res) => {
  const data = await URL.find({ user: req.user.id });

  if (!data) {
    res.status(401);
    throw new Error("No Data found");
  }
  res.json(data);
});

// @desc Update short URL
// @route PUT /url/update/:shortid
// @access Private
const updateURL = asyncHandler(async (req, res) => {
  const { url } = req.body;
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  // Make user the logged in user matchest the shorturl owner
  if (result.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  result.redirectURL = url;
  result.save();

  res.status(200).json({ message: "URL Updated" });
});

// @desc Delete URL
// @route DELETE /url/analytics/:shortid
// @access Private
const deleteURL = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    res.status(400);
    throw new Error("URL not found");
  }

  // Make sure the logged in user matches the goal user
  if (result.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await result.deleteOne();
  res.status(200).json({ message: "Short URL Terminated" });
});

// @desc Get URL Analytics
// @route GET /url/analytics/:shortid
// @access Private
const getAnalytics = asyncHandler(async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  // Make user the logged in user matchest the shorturl owner
  if (result.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not Authorized");
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
});

module.exports = {
  generateShortURL,
  redirect,
  getAnalytics,
  updateURL,
  deleteURL,
  getURLs,
};
