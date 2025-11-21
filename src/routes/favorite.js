// src/routes/favorite.js
const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const auth = require("../middleware/auth");

// add favorite (providerId OR serviceId in body)
router.post("/", auth, favoriteController.addFavorite);
// get logged-in user's favorites
router.get("/", auth, favoriteController.getUserFavorites);
// check single favorite
router.get("/check", auth, favoriteController.isFavorite);

// remove favorite (providerId OR serviceId in body)
router.delete("/", auth, favoriteController.removeFavorite);

module.exports = router;
