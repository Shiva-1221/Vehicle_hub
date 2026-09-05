import { Request, Response } from "express";

import Booking from "../models/Booking";

import {
  getDashboardStats,
} from "../services/dashboardService";

/*
========================================
GET ALL BOOKINGS
========================================
*/

export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      bookingNumber,
      status,
      userId,
      vehicleId,
      date,
    } = req.query;

    const filter: Record<
      string,
      unknown
    > = {};

    // Search by booking number
    if (
      typeof bookingNumber === "string"
    ) {
      filter.bookingNumber = {
        $regex: bookingNumber,
        $options: "i",
      };
    }

    // Filter by status
    if (
      typeof status === "string"
    ) {
      filter.status = status;
    }

    // Filter by user
    if (
      typeof userId === "string"
    ) {
      filter.userId = userId;
    }

    // Filter by vehicle
    if (
      typeof vehicleId === "string"
    ) {
      filter.vehicleId = vehicleId;
    }

    // Filter by pickup date
    if (
      typeof date === "string"
    ) {
      const start = new Date(date);

      const end = new Date(date);

      end.setDate(
        end.getDate() + 1
      );

      filter.pickupDate = {
        $gte: start,
        $lt: end,
      };
    }

    // Get bookings
    const bookings =
      await Booking.find(filter)
        .populate(
          "userId",
          "name email"
        )
        .populate(
          "vehicleId",
          "name brand vehicleModel"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch bookings",
    });
  }
};

/*
========================================
GET ADMIN DASHBOARD
========================================
*/

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats =
      await getDashboardStats();

    res.status(200).json({
      stats,
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load dashboard",
    });
  }
};