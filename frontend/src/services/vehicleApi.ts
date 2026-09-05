import axios from "axios";
import type { Vehicle } from "../types/vehicle";

const API_URL = "http://localhost:5000/api/vehicles";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get(API_URL);

  return response.data.vehicles;
};

export const getVehicleById = async (
  id: string
): Promise<Vehicle> => {
  const response = await axios.get(`${API_URL}/${id}`);

  return response.data.vehicle || response.data;
};