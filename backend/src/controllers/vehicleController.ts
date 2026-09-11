import { Request, Response } from "express";
import mongoose from "mongoose";

import Vehicle from "../models/Vehicle";

/*
==================================================
GET ALL VEHICLES
==================================================
*/

export const getVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      type,
      minPrice,
      maxPrice,
      fuelType,
      transmission,
      seats,
      location,
      sort = "newest",
      page = "1",
      limit = "6",
    } = req.query;

    const filter: Record<string, any> = {};

    // Search by name, brand or model
    if (
      typeof search === "string" &&
      search.trim() !== ""
    ) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { vehicleModel: searchRegex },
      ];
    }

    // Vehicle type
    if (
      typeof type === "string" &&
      type.trim() !== ""
    ) {
      filter.type = type.trim();
    }

    // Fuel type
    if (
      typeof fuelType === "string" &&
      fuelType.trim() !== ""
    ) {
      filter.fuelType = fuelType.trim();
    }

    // Transmission
    if (
      typeof transmission === "string" &&
      transmission.trim() !== ""
    ) {
      filter.transmission =
        transmission.trim();
    }

    // Seating capacity
    if (
      typeof seats === "string" &&
      seats.trim() !== ""
    ) {
      const seatsNumber = Number(seats);

      if (
        !Number.isInteger(seatsNumber) ||
        seatsNumber <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Seats must be a positive number",
        });

        return;
      }

      filter.seatingCapacity =
        seatsNumber;
    }

    // Location
    if (
      typeof location === "string" &&
      location.trim() !== ""
    ) {
      filter.location = new RegExp(
        location.trim(),
        "i"
      );
    }

    // Price filter
    const priceFilter: {
      $gte?: number;
      $lte?: number;
    } = {};

    if (
      typeof minPrice === "string" &&
      minPrice.trim() !== ""
    ) {
      const minimumPrice =
        Number(minPrice);

      if (
        Number.isNaN(minimumPrice) ||
        minimumPrice < 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid minimum price",
        });

        return;
      }

      priceFilter.$gte = minimumPrice;
    }

    if (
      typeof maxPrice === "string" &&
      maxPrice.trim() !== ""
    ) {
      const maximumPrice =
        Number(maxPrice);

      if (
        Number.isNaN(maximumPrice) ||
        maximumPrice < 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Invalid maximum price",
        });

        return;
      }

      priceFilter.$lte = maximumPrice;
    }

    if (
      priceFilter.$gte !== undefined &&
      priceFilter.$lte !== undefined &&
      priceFilter.$gte >
        priceFilter.$lte
    ) {
      res.status(400).json({
        success: false,
        message:
          "Minimum price cannot be greater than maximum price",
      });

      return;
    }

    if (
      priceFilter.$gte !== undefined ||
      priceFilter.$lte !== undefined
    ) {
      filter.pricePerDay =
        priceFilter;
    }

    // Pagination
    const pageNumber = Math.max(
      1,
      Number(page) || 1
    );

    const limitNumber = Math.min(
      50,
      Math.max(
        1,
        Number(limit) || 6
      )
    );

    const skip =
      (pageNumber - 1) *
      limitNumber;

    // Sorting
    let sortOption:
      Record<string, 1 | -1> = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        sortOption = {
          pricePerDay: 1,
        };
        break;

      case "price_desc":
        sortOption = {
          pricePerDay: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      default:
        res.status(400).json({
          success: false,
          message:
            "Invalid sort option",
        });

        return;
    }

    // Database query
    const [vehicles, total] =
      await Promise.all([
        Vehicle.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limitNumber),

        Vehicle.countDocuments(filter),
      ]);

    const totalPages =
      Math.ceil(
        total / limitNumber
      );

    res.status(200).json({
      success: true,
      vehicles,
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
      "Get vehicles error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch vehicles",
    });
  }
};


/*
==================================================
GET VEHICLE BY ID
==================================================
*/

export const getVehicleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get ID from URL
    const id = String(req.params.id);

    // Validate MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });

      return;
    }

    // Find vehicle
    const vehicle =
      await Vehicle.findById(id);

    // Vehicle not found
    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error(
      "Get vehicle by ID error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch vehicle",
    });
  }
};


/*
==================================================
CREATE VEHICLE
==================================================
*/

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

    // Required fields
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
        success: false,
        message:
          "Required vehicle fields are missing",
      });

      return;
    }

    // Validate price
    const price =
      Number(pricePerDay);

    if (
      Number.isNaN(price) ||
      price <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Price per day must be greater than 0",
      });

      return;
    }

    // Clean registration number
    const cleanRegistrationNumber =
      String(
        registrationNumber
      ).trim();

    // Check registration number
    const existingVehicle =
      await Vehicle.findOne({
        registrationNumber:
          cleanRegistrationNumber,
      });

    if (existingVehicle) {
      res.status(409).json({
        success: false,
        message:
          "Registration number already exists",
      });

      return;
    }

    // Get uploaded files
    const files = Array.isArray(
      req.files
    )
      ? req.files
      : [];

    const images = files.map(
      (file) =>
        `/uploads/${file.filename}`
    );

    // Seating capacity
    let seatsValue:
      | number
      | undefined;

    if (
      seatingCapacity !== undefined &&
      seatingCapacity !== ""
    ) {
      const seats =
        Number(seatingCapacity);

      if (
        !Number.isInteger(seats) ||
        seats <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Seating capacity must be a positive number",
        });

        return;
      }

      seatsValue = seats;
    }

    // Create vehicle
    const vehicle =
      await Vehicle.create({
        name: String(name).trim(),

        brand: String(brand).trim(),

        vehicleModel:
          String(
            vehicleModel
          ).trim(),

        type: String(type).trim(),

        category:
          String(category).trim(),

        pricePerDay: price,

        fuelType:
          typeof fuelType === "string"
            ? fuelType.trim()
            : undefined,

        transmission:
          typeof transmission ===
          "string"
            ? transmission.trim()
            : undefined,

        seatingCapacity:
          seatsValue,

        location:
          typeof location === "string"
            ? location.trim()
            : undefined,

        registrationNumber:
          cleanRegistrationNumber,

        images,

        description:
          typeof description ===
          "string"
            ? description.trim()
            : undefined,
      });

    res.status(201).json({
      success: true,
      message:
        "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Create vehicle error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create vehicle",
    });
  }
};


/*
==================================================
UPDATE VEHICLE
==================================================
*/

export const updateVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get ID from URL
    const id = String(req.params.id);

    // Validate ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });

      return;
    }

    // Find vehicle
    const vehicle =
      await Vehicle.findById(id);

    if (!vehicle) {
      res.status(404).json({
        success: false,
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

    // Update price
    if (
      pricePerDay !== undefined &&
      pricePerDay !== ""
    ) {
      const price =
        Number(pricePerDay);

      if (
        Number.isNaN(price) ||
        price <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Price per day must be greater than 0",
        });

        return;
      }

      vehicle.pricePerDay = price;
    }

    // Update registration number
    if (
      registrationNumber !== undefined &&
      registrationNumber !== ""
    ) {
      const cleanRegistrationNumber =
        String(
          registrationNumber
        ).trim();

      // Check if another vehicle
      // already uses this registration number
      const existingVehicle =
        await Vehicle.findOne({
          registrationNumber:
            cleanRegistrationNumber,

          _id: {
            $ne: id,
          },
        });

      if (existingVehicle) {
        res.status(409).json({
          success: false,
          message:
            "Registration number already exists",
        });

        return;
      }

      vehicle.registrationNumber =
        cleanRegistrationNumber;
    }

    // Update name
    if (
      typeof name === "string"
    ) {
      vehicle.name =
        name.trim();
    }

    // Update brand
    if (
      typeof brand === "string"
    ) {
      vehicle.brand =
        brand.trim();
    }

    // Update model
    if (
      typeof vehicleModel ===
      "string"
    ) {
      vehicle.vehicleModel =
        vehicleModel.trim();
    }

    // Update type
    if (
      typeof type === "string"
    ) {
      vehicle.type =
        type.trim();
    }

    // Update category
    if (
      typeof category ===
      "string"
    ) {
      vehicle.category =
        category.trim();
    }

    // Update fuel type
    if (
      typeof fuelType ===
      "string"
    ) {
      vehicle.fuelType =
        fuelType.trim();
    }

    // Update transmission
    if (
      typeof transmission ===
      "string"
    ) {
      vehicle.transmission =
        transmission.trim();
    }

    // Update seating capacity
    if (
      seatingCapacity !==
        undefined &&
      seatingCapacity !== ""
    ) {
      const seats =
        Number(seatingCapacity);

      if (
        !Number.isInteger(seats) ||
        seats <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Seating capacity must be a positive number",
        });

        return;
      }

      vehicle.seatingCapacity =
        seats;
    }

    // Update location
    if (
      typeof location ===
      "string"
    ) {
      vehicle.location =
        location.trim();
    }

    // Update description
    if (
      typeof description ===
      "string"
    ) {
      vehicle.description =
        description.trim();
    }

    // Update images
    const files = Array.isArray(
      req.files
    )
      ? req.files
      : [];

    if (files.length > 0) {
      vehicle.images =
        files.map(
          (file) =>
            `/uploads/${file.filename}`
        );
    }

    // Save changes
    await vehicle.save();

    res.status(200).json({
      success: true,
      message:
        "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(
      "Update vehicle error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update vehicle",
    });
  }
};


/*
==================================================
DELETE VEHICLE
==================================================
*/

export const deleteVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get ID from URL
    const id = String(req.params.id);

    // Validate ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });

      return;
    }

    // Find vehicle
    const vehicle =
      await Vehicle.findById(id);

    if (!vehicle) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });

      return;
    }

    // Delete vehicle
    await Vehicle.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message:
        "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete vehicle error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete vehicle",
    });
  }
};