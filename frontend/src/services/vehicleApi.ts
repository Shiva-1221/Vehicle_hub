import axios from "axios";
import type { Vehicle } from "../types/vehicle";

const API_URL =
  "http://localhost:5000/api/vehicles";

export interface VehicleQuery {
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  fuelType?: string;
  transmission?: string;
  seats?: string;
  location?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface VehicleResponse {
  vehicles: Vehicle[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getVehicles = async (
  params?: VehicleQuery
): Promise<VehicleResponse> => {
  const response =
    await axios.get(API_URL, {
      params,
    });

  return response.data;
};

export const getVehicleById = async (
  id: string
): Promise<Vehicle> => {
  const response =
    await axios.get(
      `${API_URL}/${id}`
    );

  return response.data.vehicle;
};