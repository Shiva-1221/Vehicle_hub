import mongoose from "mongoose";

export const validateBookingData = (
  vehicleId: unknown,
  pickupDate: unknown,
  returnDate: unknown
): string | null => {
  // Validate Vehicle ID
  if (
    typeof vehicleId !== "string" ||
    vehicleId.trim() === ""
  ) {
    return "Vehicle ID is required";
  }

  if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
    return "Invalid vehicle ID";
  }

  // Validate pickup date
  if (
    typeof pickupDate !== "string" ||
    pickupDate.trim() === ""
  ) {
    return "Pickup date is required";
  }

  // Validate return date
  if (
    typeof returnDate !== "string" ||
    returnDate.trim() === ""
  ) {
    return "Return date is required";
  }

  // Convert strings to Date objects
  const pickup = new Date(pickupDate);
  const returnValue = new Date(returnDate);

  // Check pickup date
  if (Number.isNaN(pickup.getTime())) {
    return "Invalid pickup date";
  }

  // Check return date
  if (Number.isNaN(returnValue.getTime())) {
    return "Invalid return date";
  }

  // Return date must be after pickup date
  if (returnValue <= pickup) {
    return "Return date must be after pickup date";
  }

  return null;
};