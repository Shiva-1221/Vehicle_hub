import dotenv from "dotenv";

import connectDB from "../config/db";
import Vehicle from "../models/Vehicle";

dotenv.config();

const vehicles = [
  {
    name: "Creta",
    brand: "Hyundai",
    model: "Creta SX",
    type: "SUV",
    pricePerDay: 2000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    location: "Hyderabad",
    registrationNumber: "TS09AB1234",
    images: [],
    description: "Comfortable SUV for city and highway travel"
  },

  {
    name: "Swift",
    brand: "Maruti",
    model: "Swift VXI",
    type: "Car",
    pricePerDay: 1500,
    fuelType: "Petrol",
    transmission: "Manual",
    seatingCapacity: 5,
    location: "Hyderabad",
    registrationNumber: "TS09CD5678",
    images: [],
    description: "Affordable city car"
  },

  {
    name: "Activa",
    brand: "Honda",
    model: "Activa 6G",
    type: "Bike",
    pricePerDay: 700,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 2,
    location: "Hyderabad",
    registrationNumber: "TS09EF9012",
    images: [],
    description: "Easy scooter for city travel"
  }
];

const seedVehicles = async (): Promise<void> => {
  try {
    await connectDB();

    await Vehicle.deleteMany({});

    await Vehicle.insertMany(vehicles);

    console.log("Vehicles seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    process.exit(1);
  }
};

seedVehicles();