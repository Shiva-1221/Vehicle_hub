import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IVehicle extends Document {
  name: string;
  brand: string;
  vehicleModel: string;
  type: string;
  category: string;
  pricePerDay: number;
  fuelType?: string;
  transmission?: string;
  seatingCapacity?: number;
  location?: string;
  registrationNumber: string;
  images: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    fuelType: {
      type: String,
      trim: true,
    },

    transmission: {
      type: String,
      trim: true,
    },

    seatingCapacity: {
      type: Number,
      min: 1,
    },

    location: {
      type: String,
      trim: true,
    },

    // Registration number must be unique
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema
);

export default Vehicle;