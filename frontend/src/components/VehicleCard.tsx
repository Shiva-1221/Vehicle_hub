import { Link } from "react-router-dom";
import type { Vehicle } from "../types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = ({
  vehicle,
}: VehicleCardProps) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "15px",
        margin: "10px",
        width: "280px",
      }}
    >
      {vehicle.images?.length > 0 ? (
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            height: "160px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Image
        </div>
      )}

      <h2>{vehicle.name}</h2>

      <p>
        {vehicle.brand} {vehicle.vehicleModel}
      </p>

      <p>Type: {vehicle.type}</p>

      <p>
        <strong>₹{vehicle.pricePerDay} / day</strong>
      </p>

      <p>Location: {vehicle.location}</p>

      <Link to={`/vehicles/${vehicle._id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default VehicleCard;