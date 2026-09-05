import { useEffect, useState } from "react";

import VehicleCard from "../components/VehicleCard";
import { getVehicles } from "../services/vehicleApi";
import type { Vehicle } from "../types/vehicle";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await getVehicles();

        setVehicles(data);
      } catch (error) {
        setError("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, []);

  if (loading) {
    return <h2>Loading vehicles...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Available Vehicles</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
          />
        ))}
      </div>
    </div>
  );
};

export default VehicleList;