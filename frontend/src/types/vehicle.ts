export interface Vehicle {
  _id: string;
  name: string;
  brand: string;
  vehicleModel: string;
  type: string;
  pricePerDay: number;
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  location?: string;
  registrationNumber: string;
  images: string[];
  description?: string;
}