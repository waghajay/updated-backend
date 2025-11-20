const { Rating, Provider } = require("../models");

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
