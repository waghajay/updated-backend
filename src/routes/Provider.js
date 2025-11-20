// src/routes/provider.js
const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");

router.post("/services", providerController.addService);
router.get("/:providerId/services", providerController.getServicesByProvider);
router.put("/services/:serviceId", providerController.updateService);

module.exports = router;