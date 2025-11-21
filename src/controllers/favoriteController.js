// src/controllers/favoriteController.js
const { Favorite, Provider, Service, User } = require("../models");
const { Op } = require("sequelize");

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, serviceId } = req.body;

    if (!providerId && !serviceId) {
      return res.status(400).json({ error: "providerId or serviceId is required" });
    }

    // If providerId provided, ensure provider exists
    if (providerId) {
      const provider = await Provider.findByPk(providerId);
      if (!provider) return res.status(404).json({ error: "Provider not found" });

      // Prevent duplicate
      const [fav, created] = await Favorite.findOrCreate({
        where: { userId, providerId },
        defaults: { userId, providerId }
      });

      if (!created) return res.status(200).json({ message: "Provider already in favorites", favorite: fav });

      return res.status(201).json({ message: "Provider added to favorites", favorite: fav });
    }

    // If serviceId provided, ensure service exists
    if (serviceId) {
      const service = await Service.findByPk(serviceId);
      if (!service) return res.status(404).json({ error: "Service not found" });

      const [fav, created] = await Favorite.findOrCreate({
        where: { userId, serviceId },
        defaults: { userId, serviceId }
      });

      if (!created) return res.status(200).json({ message: "Service already in favorites", favorite: fav });

      return res.status(201).json({ message: "Service added to favorites", favorite: fav });
    }
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, serviceId } = req.body;

    if (!providerId && !serviceId) {
      return res.status(400).json({ error: "providerId or serviceId is required" });
    }

    const where = { userId };
    if (providerId) where.providerId = providerId;
    if (serviceId) where.serviceId = serviceId;

    const deleted = await Favorite.destroy({ where });

    if (!deleted) return res.status(404).json({ message: "Favorite not found" });

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};

// Return favorites separated into providers and services
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Provider,
          include: [{ model: User, attributes: ["name", "mobile"] }]
        },
        {
          model: Service,
          include: [
            {
              model: Provider,
              include: [{ model: User, attributes: ["name", "mobile"] }]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Split into providers & services
    const providerFavorites = [];
    const serviceFavorites = [];

    favorites.forEach(f => {
      if (f.providerId && f.Provider) {
        providerFavorites.push({
          favoriteId: f.id,
          providerId: f.providerId,
          providerName: f.Provider.User?.name,
          providerMobile: f.Provider.User?.mobile,
          providerCategory: f.Provider.category,
          providerOverview: f.Provider.overview,
          createdAt: f.createdAt
        });
      } else if (f.serviceId && f.Service) {
        serviceFavorites.push({
          favoriteId: f.id,
          serviceId: f.serviceId,
          title: f.Service.title,
          price: f.Service.price,
          duration: f.Service.duration,
          providerId: f.Service.providerId,
          providerName: f.Service.Provider?.User?.name,
          providerMobile: f.Service.Provider?.User?.mobile,
          createdAt: f.createdAt
        });
      }
    });

    res.json({
      message: "Favorites fetched successfully",
      providers: providerFavorites,
      services: serviceFavorites
    });

  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// Optional: Check if a specific provider/service is already favorited by user
exports.isFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, serviceId } = req.query;

    if (!providerId && !serviceId) {
      return res.status(400).json({ error: "providerId or serviceId is required" });
    }

    const where = { userId };
    if (providerId) where.providerId = providerId;
    if (serviceId) where.serviceId = serviceId;

    const fav = await Favorite.findOne({ where });

    res.json({ isFavorite: !!fav, favoriteId: fav?.id || null });
  } catch (error) {
    console.error("isFavorite error:", error);
    res.status(500).json({ error: "Failed to check favorite" });
  }
};
