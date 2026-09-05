import mongoose from "mongoose";

export const validateBookingData = (
  vehicleId: string,
  pickupDate: string,
  returnDate: string
): string | null => {
  if (!vehicleId) {
    return "Vehicle ID is required";
  }

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return "Invalid vehicle ID";
  }

  if (!pickupDate || !returnDate) {
    return "Pickup date and return date are required";
  }

  const pickup = new Date(pickupDate);
  const returnDateValue = new Date(returnDate);

  if (isNaN(pickup.getTime())) {
    return "Invalid pickup date";
  }

  if (isNaN(returnDateValue.getTime())) {
    return "Invalid return date";
  }

  if (returnDateValue <= pickup) {
    return "Return date must be after pickup date";
  }

  return null;
};