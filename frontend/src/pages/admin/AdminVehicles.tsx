import { useEffect, useState } from "react";

import { getVehicles } from "../../services/vehicleApi";
import {
  deleteVehicle,
} from "../../services/adminApi";

import type { Vehicle } from "../../types/vehicle";

const AdminVehicles = () => {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const loadVehicles = async () => {
    try {
      const data =
        await getVehicles();

      setVehicles(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this vehicle?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteVehicle(id);

      await loadVehicles();
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Manage Vehicles</h1>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          style={{
            border:
              "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>
            {vehicle.name}
          </h3>

          <p>
            {vehicle.brand}{" "}
            {vehicle.vehicleModel}
          </p>

          <p>
            ₹{vehicle.pricePerDay}
          </p>

          <button
            onClick={() =>
              handleDelete(
                vehicle._id
              )
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminVehicles;