import { Router } from "express";

import protect from "../middleware/authMiddleware";

import {
  checkBookingAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  approveBooking,
  rejectBooking,
  activateBooking,
  completeBooking,
} from "../controllers/bookingController";

const router = Router();

/*
  Customer routes
*/

// Check vehicle availability
router.post(
  "/check-availability",
  protect,
  checkBookingAvailability
);

// Create booking
router.post(
  "/",
  protect,
  createBooking
);

// Get logged-in user's bookings
router.get(
  "/my-bookings",
  protect,
  getMyBookings
);

// Get booking by ID
router.get(
  "/:id",
  protect,
  getBookingById
);

// Cancel booking
router.patch(
  "/:id/cancel",
  protect,
  cancelBooking
);

/*
  Status routes
  These should later be protected
  by admin-role middleware.
*/

// Approve booking
router.patch(
  "/:id/approve",
  protect,
  approveBooking
);

// Reject booking
router.patch(
  "/:id/reject",
  protect,
  rejectBooking
);

// Activate booking
router.patch(
  "/:id/activate",
  protect,
  activateBooking
);

// Complete booking
router.patch(
  "/:id/complete",
  protect,
  completeBooking
);

export default router;