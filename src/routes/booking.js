const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const bookingController = require("../controllers/bookingController");

// Customer creates a booking
router.post("/", auth, bookingController.createBooking);

// Customer bookings
router.get("/user", auth, bookingController.getUserBookings);
router.get("/dashboard", auth, bookingController.getProviderDashboardStats);

router.get("/user/dashboard", auth, bookingController.getUserAcceptedBookingCount);

// Provider bookings
router.get("/provider/bookings", auth, bookingController.getProviderBookings);
router.put("/status/:bookingId", auth, bookingController.updateBookingStatus);



module.exports = router;
