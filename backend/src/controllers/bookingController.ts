import { Request, Response } from "express";

import Booking from "../models/Booking";

import {
  createBookingService,
  checkAvailability,
} from "../services/bookingService";

import { AuthRequest } from "../middleware/authMiddleware";

/*
====================================================
CHECK BOOKING AVAILABILITY
POST /api/bookings/check-availability
====================================================
*/
export const checkBookingAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      vehicleId,
      pickupDate,
      returnDate,
    } = req.body ?? {};

    // Validate request body
    if (
      typeof vehicleId !== "string" ||
      typeof pickupDate !== "string" ||
      typeof returnDate !== "string"
    ) {
      res.status(400).json({
        message:
          "Vehicle ID, pickup date and return date are required",
      });

      return;
    }

    // Check pickup date
    const pickup = new Date(pickupDate);
    const returnDateValue = new Date(returnDate);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returnDateValue.getTime())
    ) {
      res.status(400).json({
        message: "Invalid pickup or return date",
      });

      return;
    }

    // Return date must be after pickup date
    if (returnDateValue <= pickup) {
      res.status(400).json({
        message:
          "Return date must be after pickup date",
      });

      return;
    }

    // Check availability
    const available = await checkAvailability(
      vehicleId,
      pickupDate,
      returnDate
    );

    res.status(200).json({
      available,
    });
  } catch (error) {
    console.error(
      "Availability check failed:",
      error
    );

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Availability check failed",
    });
  }
};

/*
====================================================
CREATE BOOKING
POST /api/bookings
====================================================
*/
export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Check authentication
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const {
      vehicleId,
      pickupDate,
      returnDate,
    } = req.body ?? {};

    // Validate input
    if (
      typeof vehicleId !== "string" ||
      typeof pickupDate !== "string" ||
      typeof returnDate !== "string"
    ) {
      res.status(400).json({
        message:
          "Vehicle ID, pickup date and return date are required",
      });

      return;
    }

    // Validate dates
    const pickup = new Date(pickupDate);
    const returnDateValue = new Date(returnDate);

    if (
      Number.isNaN(pickup.getTime()) ||
      Number.isNaN(returnDateValue.getTime())
    ) {
      res.status(400).json({
        message: "Invalid pickup or return date",
      });

      return;
    }

    if (returnDateValue <= pickup) {
      res.status(400).json({
        message:
          "Return date must be after pickup date",
      });

      return;
    }

    // Create booking
    const booking = await createBookingService({
      userId: req.user.userId,
      vehicleId,
      pickupDate,
      returnDate,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Booking creation failed:",
      error
    );

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Booking creation failed",
    });
  }
};

/*
====================================================
GET MY BOOKINGS
GET /api/bookings/my-bookings
====================================================
*/
export const getMyBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const bookings = await Booking.find({
      userId: req.user.userId,
    })
      .populate(
        "vehicleId",
        "name brand vehicleModel pricePerDay"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error(
      "Failed to fetch bookings:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
};

/*
====================================================
GET BOOKING BY ID
GET /api/bookings/:id
====================================================
*/
export const getBookingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const booking = await Booking.findById(
      req.params.id
    ).populate(
      "vehicleId",
      "name brand vehicleModel pricePerDay"
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    // User can only view their own booking
    if (
      booking.userId.toString() !==
      req.user.userId
    ) {
      res.status(403).json({
        message:
          "You cannot view this booking",
      });

      return;
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to fetch booking:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
};

/*
====================================================
CANCEL BOOKING
PATCH /api/bookings/:id/cancel
====================================================
*/
export const cancelBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });

      return;
    }

    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    // Check booking ownership
    if (
      booking.userId.toString() !==
      req.user.userId
    ) {
      res.status(403).json({
        message:
          "You cannot cancel this booking",
      });

      return;
    }

    // Only Pending and Approved can be cancelled
    if (
      booking.status !== "Pending" &&
      booking.status !== "Approved"
    ) {
      res.status(400).json({
        message:
          `Booking cannot be cancelled from ${booking.status} status`,
      });

      return;
    }

    booking.status = "Cancelled";

    await booking.save();

    res.status(200).json({
      message:
        "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to cancel booking:",
      error
    );

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};

/*
====================================================
APPROVE BOOKING
PATCH /api/bookings/:id/approve
====================================================
*/
export const approveBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    if (booking.status !== "Pending") {
      res.status(400).json({
        message:
          "Only Pending bookings can be approved",
      });

      return;
    }

    // Check availability again before approval
    const available = await checkAvailability(
      booking.vehicleId.toString(),
      booking.pickupDate.toISOString(),
      booking.returnDate.toISOString()
    );

    if (!available) {
      res.status(409).json({
        message:
          "Vehicle is no longer available for these dates",
      });

      return;
    }

    booking.status = "Approved";

    await booking.save();

    res.status(200).json({
      message: "Booking approved",
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to approve booking:",
      error
    );

    res.status(500).json({
      message: "Failed to approve booking",
    });
  }
};

/*
====================================================
REJECT BOOKING
PATCH /api/bookings/:id/reject
====================================================
*/
export const rejectBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    if (booking.status !== "Pending") {
      res.status(400).json({
        message:
          "Only Pending bookings can be rejected",
      });

      return;
    }

    booking.status = "Rejected";

    await booking.save();

    res.status(200).json({
      message: "Booking rejected",
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to reject booking:",
      error
    );

    res.status(500).json({
      message: "Failed to reject booking",
    });
  }
};

/*
====================================================
ACTIVATE BOOKING
PATCH /api/bookings/:id/activate
====================================================
*/
export const activateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    if (booking.status !== "Approved") {
      res.status(400).json({
        message:
          "Only Approved bookings can become Active",
      });

      return;
    }

    booking.status = "Active";

    await booking.save();

    res.status(200).json({
      message: "Booking is now Active",
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to activate booking:",
      error
    );

    res.status(500).json({
      message: "Failed to activate booking",
    });
  }
};

/*
====================================================
COMPLETE BOOKING
PATCH /api/bookings/:id/complete
====================================================
*/
export const completeBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(
      req.params.id
    );

    if (!booking) {
      res.status(404).json({
        message: "Booking not found",
      });

      return;
    }

    if (booking.status !== "Active") {
      res.status(400).json({
        message:
          "Only Active bookings can be completed",
      });

      return;
    }

    booking.status = "Completed";

    await booking.save();

    res.status(200).json({
      message: "Booking completed",
      booking,
    });
  } catch (error) {
    console.error(
      "Failed to complete booking:",
      error
    );

    res.status(500).json({
      message: "Failed to complete booking",
    });
  }
};