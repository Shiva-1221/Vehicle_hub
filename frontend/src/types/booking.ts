export type BookingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Completed"
  | "Cancelled";

export interface Booking {
  _id: string;
  bookingNumber: string;
  userId: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  rentalDays: number;
  pricePerDay: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}