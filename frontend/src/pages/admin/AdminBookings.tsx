import { useEffect, useState } from "react";

import {
  getAdminBookings,
  approveBooking,
  rejectBooking,
  activateBooking,
  completeBooking,
} from "../../services/adminApi";

interface AdminBooking {
  _id: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  pickupDate: string;
  returnDate: string;

  userId?: {
    name: string;
    email: string;
  };

  vehicleId?: {
    name: string;
    brand: string;
    vehicleModel: string;
  };
}

const AdminBookings = () => {
  const [bookings, setBookings] =
    useState<AdminBooking[]>([]);

  const loadBookings = async () => {
    try {
      const data =
        await getAdminBookings();

      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction =
    async (
      action: () => Promise<unknown>
    ) => {
      try {
        await action();

        await loadBookings();
      } catch (error: any) {
        alert(
          error.response?.data?.message ||
            "Action failed"
        );
      }
    };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Manage Bookings</h1>

      {bookings.map((booking) => (
        <div
          key={booking._id}
          style={{
            border:
              "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>
            {booking.bookingNumber}
          </h3>

          <p>
            Customer:{" "}
            {booking.userId?.name}
          </p>

          <p>
            Vehicle:{" "}
            {booking.vehicleId?.brand}{" "}
            {booking.vehicleId?.name}
          </p>

          <p>
            Total: ₹
            {booking.totalAmount}
          </p>

          <p>
            Status:{" "}
            {booking.status}
          </p>

          {booking.status ===
            "Pending" && (
            <>
              <button
                onClick={() =>
                  handleAction(
                    () =>
                      approveBooking(
                        booking._id
                      )
                  )
                }
              >
                Approve
              </button>

              {" "}

              <button
                onClick={() =>
                  handleAction(
                    () =>
                      rejectBooking(
                        booking._id
                      )
                  )
                }
              >
                Reject
              </button>
            </>
          )}

          {booking.status ===
            "Approved" && (
            <button
              onClick={() =>
                handleAction(
                  () =>
                    activateBooking(
                      booking._id
                    )
                )
              }
            >
              Activate
            </button>
          )}

          {booking.status ===
            "Active" && (
            <button
              onClick={() =>
                handleAction(
                  () =>
                    completeBooking(
                      booking._id
                    )
                )
              }
            >
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;