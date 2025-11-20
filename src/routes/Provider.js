// src/routes/provider.js
const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");

router.post("/services", providerController.addService);

module.exports = router;