import { Router } from "express";

import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController";

const router = Router();

router.get(
  "/",
  getVehicles
);

router.get(
  "/:id",
  getVehicleById
);

export default router;