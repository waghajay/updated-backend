// src/routes/provider.js
const express = require("express");
const { Service, Provider } = require("../models");

exports.provider = async (req, res) => {
  try {
    const { providerId, title, category, description, price, duration, availableDays, locationRadius } = req.body;

    // Verify provider exists
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Create service
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
