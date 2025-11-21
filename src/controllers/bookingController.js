const { Booking, Provider, Service, User } = require("../models");

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT
    const { serviceId, providerId, bookingDate, timeSlot, address } = req.body;

    const provider = await Provider.findByPk(providerId);
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(404).json({ error: "Service not found" });

    const booking = await Booking.create({
      serviceId,
      providerId,
      userId,
      bookingDate,
      timeSlot,
      address,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        { model: Service },
        { model: Provider }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(bookings);
  } catch (error) {
    console.error("User bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


exports.getProviderBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in USER ID from JWT

    // Get provider matching logged-in user
    const provider = await Provider.findOne({
      where: { userId }
    });

    if (!provider) {
      return res.status(404).json({ error: "Provider profile not found" });
    }

    const providerId = provider.id;

    // Now fetch bookings for this provider
    const bookings = await Booking.findAll({
      where: { providerId },
      include: [
        { model: Service },
        { model: User, attributes: ["name", "mobile"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(bookings);

  } catch (error) {
    console.error("Provider bookings error:", error);
    res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
};


exports.getUserAcceptedBookingCount = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in customer/user ID

    const acceptedCount = await Booking.count({
      where: {
        userId,
        status: "accepted"
      }
    });

    res.json({
      message: "Accepted bookings count fetched successfully",
      acceptedCount
    });

  } catch (error) {
    console.error("User accepted booking count error:", error);
    res.status(500).json({
      error: "Failed to get accepted booking count"
    });
  }
};



exports.getProviderDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user's ID

    // Find provider linked with this user
    const provider = await Provider.findOne({
      where: { userId }
    });

    if (!provider) {
      return res.status(404).json({ error: "Provider profile not found" });
    }

    const providerId = provider.id;

    // Fetch counts by status
    const totalBookings = await Booking.count({ where: { providerId } });
    const pendingCount = await Booking.count({ where: { providerId, status: "pending" } });
    const acceptedCount = await Booking.count({ where: { providerId, status: "accepted" } });
    const completedCount = await Booking.count({ where: { providerId, status: "completed" } });
    const rejectedCount = await Booking.count({ where: { providerId, status: "rejected" } });

    res.json({
      message: "Provider dashboard stats fetched successfully",
      stats: {
        totalBookings,
        pendingCount,
        acceptedCount,
        completedCount,
        rejectedCount
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch provider dashboard stats" });
  }
};





exports.updateBookingStatus = async (req, res) => {
  try {
    const providerUserId = req.user.id; // logged-in provider user ID
    const { bookingId } = req.params;
    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = ["pending", "accepted", "rejected", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Step 1: Find provider for logged-in user
    const provider = await Provider.findOne({
      where: { userId: providerUserId }
    });

    if (!provider) {
      return res.status(403).json({ error: "Only providers can update booking status" });
    }

    // Step 2: Fetch booking and check if it belongs to this provider
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.providerId !== provider.id) {
      return res.status(403).json({
        error: "You are not authorized to change this booking status"
      });
    }

    // Step 3: Update booking status
    await booking.update({ status });

    res.json({
      message: "Booking status updated successfully",
      booking
    });

  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};