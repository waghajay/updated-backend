// src/controllers/providerController.js
const { Service, Provider } = require("../models");

exports.addService = async (req, res) => {
  try {
    const { providerId, title, category, description, price, duration, availableDays, locationRadius } = req.body;

    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    const service = await Service.create({
      title,
      category,
      description,
      price,
      duration,
      availableDays,
      locationRadius,
      providerId,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ error: "Failed to add service" });
  }
};



exports.getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Check if provider exists
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Fetch services of this provider
    const services = await Service.findAll({
      where: { providerId },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      providerId,
      totalServices: services.length,
      services,
    });
  } catch (error) {
    console.error("Fetch provider services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};



exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      title,
      category,
      description,
      price,
      duration,
      availableDays,
      locationRadius,
    } = req.body;

    // Find service
    const service = await Service.findByPk(serviceId);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Update service
    await service.update({
      title,
      category,
      description,
      price,
      duration,
      availableDays,
      locationRadius,
    });

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ error: "Failed to update service" });
  }
};
