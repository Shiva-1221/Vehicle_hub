import { Request, Response } from "express";
import Vehicle from "../models/Vehicle";

export const getVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicles = await Vehicle.find();

    res.status(200).json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicles",
    });
  }
};

export const getVehicleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await Vehicle.findById(
      req.params.id
    );

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    res.status(200).json({
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vehicle",
    });
  }
};

export const createVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      brand,
      vehicleModel,
      type,
      category,
      pricePerDay,
      fuelType,
      transmission,
      seatingCapacity,
      location,
      registrationNumber,
      description,
    } = req.body;

    if (
      !name ||
      !brand ||
      !vehicleModel ||
      !type ||
      !category ||
      pricePerDay === undefined ||
      !registrationNumber
    ) {
      res.status(400).json({
        message:
          "Required vehicle fields are missing",
      });
      return;
    }

    if (Number(pricePerDay) <= 0) {
      res.status(400).json({
        message:
          "Price per day must be positive",
      });
      return;
    }

    const existingVehicle =
      await Vehicle.findOne({
        registrationNumber,
      });

    if (existingVehicle) {
      res.status(409).json({
        message:
          "Registration number already exists",
      });
      return;
    }

    const images =
      req.files && Array.isArray(req.files)
        ? req.files.map(
            (file) =>
              `/uploads/${file.filename}`
          )
        : [];

    const vehicle =
      await Vehicle.create({
        name,
        brand,
        vehicleModel,
        type,
        category,
        pricePerDay: Number(pricePerDay),
        fuelType,
        transmission,
        seatingCapacity: Number(
          seatingCapacity
        ),
        location,
        registrationNumber,
        images,
        description,
      });

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create vehicle",
    });
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicle =
      await Vehicle.findById(req.params.id);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    const {
      name,
      brand,
      vehicleModel,
      type,
      category,
      pricePerDay,
      fuelType,
      transmission,
      seatingCapacity,
      location,
      registrationNumber,
      description,
    } = req.body;

    if (
      pricePerDay !== undefined &&
      Number(pricePerDay) <= 0
    ) {
      res.status(400).json({
        message:
          "Price per day must be positive",
      });
      return;
    }

    vehicle.name = name ?? vehicle.name;
    vehicle.brand =
      brand ?? vehicle.brand;
    vehicle.vehicleModel =
      vehicleModel ?? vehicle.vehicleModel;
    vehicle.type = type ?? vehicle.type;
    vehicle.category =
      category ?? vehicle.category;

    if (pricePerDay !== undefined) {
      vehicle.pricePerDay =
        Number(pricePerDay);
    }

    vehicle.fuelType =
      fuelType ?? vehicle.fuelType;

    vehicle.transmission =
      transmission ?? vehicle.transmission;

    if (seatingCapacity !== undefined) {
      vehicle.seatingCapacity =
        Number(seatingCapacity);
    }

    vehicle.location =
      location ?? vehicle.location;

    vehicle.registrationNumber =
      registrationNumber ??
      vehicle.registrationNumber;

    vehicle.description =
      description ?? vehicle.description;

    const newImages =
      req.files &&
      Array.isArray(req.files)
        ? req.files.map(
            (file) =>
              `/uploads/${file.filename}`
          )
        : [];

    if (newImages.length > 0) {
      vehicle.images = newImages;
    }

    await vehicle.save();

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update vehicle",
    });
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicle =
      await Vehicle.findById(req.params.id);

    if (!vehicle) {
      res.status(404).json({
        message: "Vehicle not found",
      });
      return;
    }

    await Vehicle.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete vehicle",
    });
  }
};

