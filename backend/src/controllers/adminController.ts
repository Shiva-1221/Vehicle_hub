import { Request, Response } from "express";

import Booking from "../models/Booking";

import {
  getDashboardStats,
} from "../services/dashboardService";

/*
========================================
GET ALL BOOKINGS - ADMIN
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

    // ========================================
    // FILTER
    // ========================================

    const filter: Record<
      string,
      unknown
    > = {};

    // Search by booking number
    if (
      typeof bookingNumber === "string" &&
      bookingNumber.trim() !== ""
    ) {
      filter.bookingNumber = {
        $regex: bookingNumber.trim(),
        $options: "i",
      };
    }

    // Filter by status
    if (
      typeof status === "string" &&
      status.trim() !== ""
    ) {
      filter.status = status;
    }

    // Filter by user
    if (
      typeof userId === "string" &&
      userId.trim() !== ""
    ) {
      filter.userId = userId;
    }

    // Filter by vehicle
    if (
      typeof vehicleId === "string" &&
      vehicleId.trim() !== ""
    ) {
      filter.vehicleId = vehicleId;
    }

    // Filter by pickup date
    if (
      typeof date === "string" &&
      date.trim() !== ""
    ) {
      const start = new Date(date);
      const end = new Date(date);

      if (
        Number.isNaN(start.getTime())
      ) {
        res.status(400).json({
          message: "Invalid date",
        });

        return;
      }

      end.setDate(
        end.getDate() + 1
      );

      filter.pickupDate = {
        $gte: start,
        $lt: end,
      };
    }

    // ========================================
    // PAGINATION
    // ========================================

    const pageNumber = Math.max(
      1,
      Number(req.query.page) || 1
    );

    const limitNumber = Math.min(
      50,
      Math.max(
        1,
        Number(req.query.limit) || 10
      )
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // ========================================
    // GET BOOKINGS + TOTAL COUNT
    // ========================================

    const [bookings, total] =
      await Promise.all([
        Booking.find(filter)
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
          })
          .skip(skip)
          .limit(limitNumber),

        Booking.countDocuments(filter),
      ]);

    // ========================================
    // PAGINATION INFORMATION
    // ========================================

    const totalPages = Math.ceil(
      total / limitNumber
    );

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      count: bookings.length,
      bookings,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
        hasNextPage:
          pageNumber < totalPages,
        hasPreviousPage:
          pageNumber > 1,
      },
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