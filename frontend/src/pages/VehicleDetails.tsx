import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getVehicleById } from "../services/vehicleApi";

import {
  checkAvailability,
  createBooking,
} from "../services/bookingApi";

import type { Vehicle } from "../types/vehicle";
import { useAuth } from "../context/AuthContext";

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [pickupDate, setPickupDate] =
    useState("");

  const [returnDate, setReturnDate] =
    useState("");

  const [available, setAvailable] =
    useState<boolean | null>(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /*
   * Load vehicle details
   */
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        if (!id) {
          setMessage("Vehicle ID is missing");
          return;
        }

        const data = await getVehicleById(id);

        setVehicle(data);
      } catch (error: any) {
        console.error(
          "Vehicle loading error:",
          error
        );

        setMessage(
          error.response?.data?.message ||
            "Vehicle not found"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  /*
   * Check vehicle availability
   */
  const handleCheckAvailability = async () => {
    try {
      setMessage("");
      setAvailable(null);

      // Check vehicle ID
      if (!id) {
        setMessage("Vehicle ID is missing");
        return;
      }

      // Check dates
      if (!pickupDate || !returnDate) {
        setMessage(
          "Please select pickup and return dates"
        );
        return;
      }

      // Get today's date
      const today = new Date()
        .toISOString()
        .split("T")[0];

      // Pickup cannot be in the past
      if (pickupDate < today) {
        setMessage(
          "Pickup date cannot be in the past"
        );
        return;
      }

      // Return date must be after pickup
      if (returnDate <= pickupDate) {
        setMessage(
          "Return date must be after pickup date"
        );
        return;
      }

      // Call backend
      const data = await checkAvailability(
        id,
        pickupDate,
        returnDate
      );

      console.log(
        "Availability response:",
        data
      );

      setAvailable(data.available);

      if (data.available === true) {
        setMessage(
          "Vehicle is available!"
        );
      } else {
        setMessage(
          "Vehicle is not available for these dates."
        );
      }
    } catch (error: any) {
      console.error(
        "Availability check error:",
        error
      );

      setAvailable(false);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Availability check failed"
      );
    }
  };

  /*
   * Create booking
   */
  const handleBooking = async () => {
    try {
      // Check login
      if (!user) {
        navigate("/login");
        return;
      }

      // Check vehicle ID
      if (!id) {
        setMessage("Vehicle ID is missing");
        return;
      }

      // Check dates
      if (!pickupDate || !returnDate) {
        setMessage(
          "Please select pickup and return dates"
        );
        return;
      }

      // Check availability first
      if (available !== true) {
        setMessage(
          "Please check availability first."
        );
        return;
      }

      // Create booking
      const data = await createBooking({
        vehicleId: id,
        pickupDate,
        returnDate,
      });

      alert(
        `Booking created successfully!\nBooking Number: ${
          data.booking?.bookingNumber || "N/A"
        }`
      );

      navigate("/my-bookings");
    } catch (error: any) {
      console.error(
        "Booking creation error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Booking creation failed"
      );
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return <h2>Loading...</h2>;
  }

  /*
   * Vehicle not found
   */
  if (!vehicle) {
    return <h2>Vehicle not found</h2>;
  }

  /*
   * Today's date
   */
  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div style={{ padding: "30px" }}>
      {/* Vehicle details */}
      <h1>{vehicle.name}</h1>

      <h3>
        {vehicle.brand}{" "}
        {vehicle.vehicleModel}
      </h3>

      <p>
        Type: {vehicle.type}
      </p>

      <p>
        Price: ₹{vehicle.pricePerDay} / day
      </p>

      <p>
        Fuel: {vehicle.fuelType}
      </p>

      <p>
        Transmission:{" "}
        {vehicle.transmission}
      </p>

      <p>
        Seats: {vehicle.seatingCapacity}
      </p>

      <p>
        Location: {vehicle.location}
      </p>

      <p>
        {vehicle.description}
      </p>

      <hr />

      {/* Booking section */}
      <h2>Book this vehicle</h2>

      {/* Pickup date */}
      <div>
        <label>
          Pickup Date
        </label>

        <br />

        <input
          type="date"
          value={pickupDate}
          min={today}
          onChange={(e) => {
            setPickupDate(
              e.target.value
            );

            setAvailable(null);
            setMessage("");
          }}
        />
      </div>

      <br />

      {/* Return date */}
      <div>
        <label>
          Return Date
        </label>

        <br />

        <input
          type="date"
          value={returnDate}
          min={
            pickupDate || today
          }
          onChange={(e) => {
            setReturnDate(
              e.target.value
            );

            setAvailable(null);
            setMessage("");
          }}
        />
      </div>

      <br />

      {/* Availability button */}
      <button
        onClick={
          handleCheckAvailability
        }
      >
        Check Availability
      </button>

      <br />
      <br />

      {/* Message */}
      {message && (
        <p>{message}</p>
      )}

      {/* Book button */}
      {available === true && (
        <button
          onClick={handleBooking}
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default VehicleDetails;