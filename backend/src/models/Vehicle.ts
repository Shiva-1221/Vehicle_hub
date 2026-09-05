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

    category: {
  type: String,
  required: true,
    },

    vehicleModel: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    fuelType: String,

    transmission: String,

    seatingCapacity: Number,

    location: String,

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },

    images: {
      type: [String],
      default: [],
    },

    description: String,
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