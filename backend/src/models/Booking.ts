import mongoose, { Document, Schema } from "mongoose";

export type BookingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Completed"
  | "Cancelled";

export interface IBooking extends Document {
  bookingNumber: string;

  userId: mongoose.Types.ObjectId;

  vehicleId: mongoose.Types.ObjectId;

  pickupDate: Date;

  returnDate: Date;

  rentalDays: number;

  pricePerDay: number;

  totalAmount: number;

  status: BookingStatus;

  createdAt: Date;

  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    rentalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Active",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);

export default Booking;