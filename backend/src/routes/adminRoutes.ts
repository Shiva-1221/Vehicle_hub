import { Router } from "express";

import protect from "../middleware/authMiddleware";
import adminOnly from "../middleware/adminMiddleware";
import upload from "../middleware/uploadMiddleware";

import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";

import {
  approveBooking,
  rejectBooking,
  activateBooking,
  completeBooking,
} from "../controllers/bookingController";

import {
  getAllBookings,
} from "../controllers/adminController";

const router = Router();

/*
========================================
ADMIN VEHICLE ROUTES
========================================
*/

// Create vehicle
router.post(
  "/vehicles",
  protect,
  adminOnly,
  upload.array("images", 5),
  createVehicle
);

// Update vehicle
router.put(
  "/vehicles/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateVehicle
);

// Delete vehicle
router.delete(
  "/vehicles/:id",
  protect,
  adminOnly,
  deleteVehicle
);

/*
========================================
ADMIN BOOKING ROUTES
========================================
*/

// Get all bookings
router.get(
  "/bookings",
  protect,
  adminOnly,
  getAllBookings
);

// Approve booking
router.patch(
  "/bookings/:id/approve",
  protect,
  adminOnly,
  approveBooking
);

// Reject booking
router.patch(
  "/bookings/:id/reject",
  protect,
  adminOnly,
  rejectBooking
);

// Activate booking
router.patch(
  "/bookings/:id/activate",
  protect,
  adminOnly,
  activateBooking
);

// Complete booking
router.patch(
  "/bookings/:id/complete",
  protect,
  adminOnly,
  completeBooking
);

export default router;