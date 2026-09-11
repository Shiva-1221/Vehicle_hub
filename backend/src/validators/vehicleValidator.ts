export const validateVehicleData = (
  data: {
    name?: unknown;
    brand?: unknown;
    vehicleModel?: unknown;
    type?: unknown;
    category?: unknown;
    pricePerDay?: unknown;
    registrationNumber?: unknown;
  }
): string | null => {
  const {
    name,
    brand,
    vehicleModel,
    type,
    category,
    pricePerDay,
    registrationNumber,
  } = data;

  if (
    typeof name !== "string" ||
    !name.trim()
  ) {
    return "Vehicle name is required";
  }

  if (
    typeof brand !== "string" ||
    !brand.trim()
  ) {
    return "Brand is required";
  }

  if (
    typeof vehicleModel !== "string" ||
    !vehicleModel.trim()
  ) {
    return "Vehicle model is required";
  }

  if (
    typeof type !== "string" ||
    !type.trim()
  ) {
    return "Vehicle type is required";
  }

  if (
    typeof category !== "string" ||
    !category.trim()
  ) {
    return "Category is required";
  }

  const price =
    Number(pricePerDay);

  if (
    Number.isNaN(price) ||
    price <= 0
  ) {
    return "Price per day must be positive";
  }

  if (
    typeof registrationNumber !==
      "string" ||
    !registrationNumber.trim()
  ) {
    return "Registration number is required";
  }

  return null;
};