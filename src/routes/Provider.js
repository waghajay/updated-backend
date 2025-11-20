// src/routes/provider.js
const express = require("express");
const router = express.Router();
const { Service, Provider } = require("../models");

router.post("/services" , Provider);

module.exports = router;