import { useEffect, useState } from "react";

import {
  getMyBookings,
  cancelBooking,
} from "../services/bookingApi";

import type { Booking } from "../types/booking";

const MyBookings = () => {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Load bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setError("");

        const data = await getMyBookings();

        setBookings(data);
      } catch (error: any) {
        setError(
          error.response?.data?.message ||
            "Failed to load bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Cancel booking
  const handleCancel = async (
    bookingId: string
  ) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this booking?"
      );

      if (!confirmed) {
        return;
      }

      await cancelBooking(bookingId);

      // Reload bookings after cancellation
      const updatedBookings =
        await getMyBookings();

      setBookings(updatedBookings);

      alert(
        "Booking cancelled successfully"
      );
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Unable to cancel booking"
      );
    }
  };

  // Loading state
  if (loading) {
    return <h2>Loading bookings...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Bookings</h1>

      {/* Error message */}
      {error && <p>{error}</p>}

      {/* No bookings */}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>
              Booking:{" "}
              {booking.bookingNumber}
            </h3>

            <p>
              Pickup:{" "}
              {new Date(
                booking.pickupDate
              ).toLocaleDateString()}
            </p>

            <p>
              Return:{" "}
              {new Date(
                booking.returnDate
              ).toLocaleDateString()}
            </p>

            <p>
              Rental Days:{" "}
              {booking.rentalDays}
            </p>

            <p>
              Price/Day: ₹
              {booking.pricePerDay}
            </p>

            <p>
              Total: ₹
              {booking.totalAmount}
            </p>

            <p>
              Status:{" "}
              <strong>
                {booking.status}
              </strong>
            </p>

            {/* Cancel button */}
            {(booking.status === "Pending" ||
              booking.status === "Approved") && (
              <button
                onClick={() =>
                  handleCancel(
                    booking._id
                  )
                }
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;