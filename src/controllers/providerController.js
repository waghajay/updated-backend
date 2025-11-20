// src/controllers/providerController.js
const { Service, Provider, User, Rating } = require("../models");

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


exports.getProviderFullDetails = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findOne({
      where: { id: providerId },
      include: [
        {
          model: User,
          attributes: ["name", "email", "mobile", "address"]
        }
      ]
    });

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.json({
      message: "Provider details fetched successfully",
      provider
    });
  } catch (error) {
    console.error("Get provider full details error:", error);
    res.status(500).json({ error: "Failed to fetch provider details" });
  }
};


exports.getTopProvidersByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Fetch providers of that category
    const providers = await Provider.findAll({
      where: { category },
      include: [
        {
          model: User,
          attributes: ["name", "mobile"]
        },
        {
          model: Rating,
          attributes: ["rating"]
        }
      ]
    });

    // Map providers and compute avg rating
    const result = providers
      .map(provider => {
        const ratings = provider.Ratings || [];

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        return {
          providerId: provider.id,
          name: provider.User?.name,
          mobile: provider.User?.mobile,
          category: provider.category,
          experience: provider.experience,
          price: provider.price,
          overview: provider.overview,
          avgRating: Number(avgRating.toFixed(1)),
          totalReviews: ratings.length
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating) // highest rated first
      .slice(0, 4); // top 4

    res.json({
      message: `Top providers for category: ${category}`,
      providers: result
    });

  } catch (error) {
    console.error("Top providers by category error:", error);
    res.status(500).json({ error: "Failed to fetch providers by category" });
  }
};



exports.getServicesForCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    // Fetch all services matching category and include provider + user
    const services = await Service.findAll({
      where: { category },
      include: [
        {
          model: Provider,
          include: [
            { model: User, attributes: ["name", "mobile"] }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Group services by provider
    const providerMap = {};

    services.forEach(service => {
      const provider = service.Provider;
      if (!provider) return;

      if (!providerMap[provider.id]) {
        providerMap[provider.id] = {
          providerId: provider.id,
          providerName: provider.User?.name,
          providerMobile: provider.User?.mobile,
          providerCategory: provider.category,
          providerExperience: provider.experience,
          providerOverview: provider.overview,
          services: []
        };
      }

      providerMap[provider.id].services.push({
        serviceId: service.id,
        title: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        availableDays: service.availableDays,
        locationRadius: service.locationRadius
      });
    });

    res.json({
      message: `All services grouped by provider for category: ${category}`,
      providers: Object.values(providerMap)
    });

  } catch (error) {
    console.error("Fetch category services error:", error);
    res.status(500).json({ 
      error: "Failed to fetch services by category",
      message: error.message
    });
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



exports.rateProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.id; // JWT USER ID

    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    const newRating = await Rating.create({
      providerId,
      userId,
      rating,
      review,
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ error: "Failed to add rating" });
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

exports.updateProviderFull = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Provider fields
    const {
      age,
      gender,
      category,
      experience,
      price,
      salaryRange,
      availabilityType,
      gpsRadius,
      skills,
      overview,
      workType,
      emergencyAvailable,
      idProof,

      // USER fields
      name,
      email,
      mobile,
      address,
    } = req.body;

    // Find provider
    const provider = await Provider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    // Fetch user for this provider
    const user = await User.findByPk(provider.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found for provider" });
    }

    // Update USER info
    await user.update({
      name,
      email,
      mobile,
      address,
    });

    // Update PROVIDER info
    await provider.update({
      age,
      gender,
      category,
      experience,
      price,
      salaryRange,
      availabilityType,
      gpsRadius,
      skills,
      overview,
      workType,
      emergencyAvailable,
      idProof,
    });

    res.json({
      message: "Profile updated successfully",
      user,
      provider,
    });
  } catch (error) {
    console.error("Update Provider + User error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
