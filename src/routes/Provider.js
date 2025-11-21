// src/routes/provider.js
const express = require("express");
const router = express.Router();
const providerController = require("../controllers/providerController");

router.post("/services", providerController.addService);
router.post("/:providerId/rate", providerController.rateProvider);
router.get("/all-proviers-services", providerController.getAllProvidersWithServices);
router.get("/search", providerController.searchProvidersByName);
router.get("/category/services", providerController.getServicesForCategory);
router.get("/:providerId/services", providerController.getServicesByProvider);
router.get("/top/list", providerController.getTopProvidersByCategory);
router.get("/:providerId", providerController.getProviderFullDetails);
router.put("/services/:serviceId", providerController.updateService);
router.put("/:providerId", providerController.updateProviderFull);

module.exports = router; 