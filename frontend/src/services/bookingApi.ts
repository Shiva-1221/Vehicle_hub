import axios from "axios";

import type { Booking } from "../types/booking";

const API_URL =
  "http://localhost:5000/api/bookings";

/*
 * Get authentication headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

/*
 * Check vehicle availability
 */
export const checkAvailability = async (
  vehicleId: string,
  pickupDate: string,
  returnDate: string
) => {
  const response = await axios.post(
    `${API_URL}/check-availability`,
    {
      vehicleId,
      pickupDate,
      returnDate,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

/*
 * Create booking
 */
export const createBooking = async (data: {
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
}) => {
  const response = await axios.post(
    API_URL,
    data,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

/*
 * Get logged-in user's bookings
 */
export const getMyBookings =
  async (): Promise<Booking[]> => {
    const response = await axios.get(
      `${API_URL}/my-bookings`,
      {
        headers: getAuthHeaders(),
      }
    );

    return response.data.bookings;
  };

/*
 * Cancel booking
 */
export const cancelBooking = async (
  bookingId: string
) => {
  const response = await axios.patch(
    `${API_URL}/${bookingId}/cancel`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};