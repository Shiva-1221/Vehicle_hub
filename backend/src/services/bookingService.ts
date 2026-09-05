import mongoose from "mongoose";

import Booking from "../models/Booking";
import Vehicle from "../models/Vehicle";
import { BookingStatus } from "../models/Booking";
import { validateBookingData } from "../validators/bookingValidator";

interface CreateBookingInput {
  userId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
}

export const checkAvailability = async (
  vehicleId: string,
  pickupDate: string,
  returnDate: string
) => {
  const pickup = new Date(pickupDate);
  const returnDateValue = new Date(returnDate);

  /*
    Phase 3:
    Block against confirmed/current rental bookings.

    Approved:
    customer has received approval.

    Active:
    vehicle is currently being rented.
  */
  const overlappingBooking = await Booking.findOne({
    vehicleId,
    status: {
      $in: ["Approved", "Active"],
    },
    pickupDate: {
      $lt: returnDateValue,
    },
    returnDate: {
      $gt: pickup,
    },
  });

  return !overlappingBooking;
};

export const createBookingService = async (
  data: CreateBookingInput
) => {
  const {
    userId,
    vehicleId,
    pickupDate,
    returnDate,
  } = data;

  const validationError = validateBookingData(
    vehicleId,
    pickupDate,
    returnDate
  );

  if (validationError) {
    throw new Error(validationError);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const vehicle = await Vehicle.findById(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (vehicle.pricePerDay < 0) {
    throw new Error("Vehicle price must be positive");
  }

  const available = await checkAvailability(
    vehicleId,
    pickupDate,
    returnDate
  );

  if (!available) {
    throw new Error(
      "Vehicle is already booked for these dates"
    );
  }

  const pickup = new Date(pickupDate);
  const returnValue = new Date(returnDate);

  const difference =
    returnValue.getTime() - pickup.getTime();

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const rentalDays = Math.ceil(
    difference / millisecondsPerDay
  );

  const totalAmount =
    rentalDays * vehicle.pricePerDay;

  const bookingNumber =
    `VR-${Date.now()}`;

  const booking = await Booking.create({
    bookingNumber,
    userId,
    vehicleId,
    pickupDate: pickup,
    returnDate: returnValue,
    rentalDays,
    pricePerDay: vehicle.pricePerDay,
    totalAmount,
    status: "Pending",
  });

  return booking;
};