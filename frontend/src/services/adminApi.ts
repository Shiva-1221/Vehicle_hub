import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

// Get authentication headers
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ================================
// ADMIN DASHBOARD
// ================================

export const getDashboard = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard`,
    {
      headers: getHeaders(),
    }
  );

  return response.data.stats;
};

// ================================
// ADMIN BOOKINGS
// ================================

// Get all bookings
export const getAdminBookings = async (
  params: Record<string, string> = {}
) => {
  const response = await axios.get(
    `${API_URL}/bookings`,
    {
      params,
      headers: getHeaders(),
    }
  );

  return response.data.bookings;
};

// Approve booking
export const approveBooking = async (
  id: string
) => {
  const response = await axios.patch(
    `${API_URL}/bookings/${id}/approve`,
    {},
    {
      headers: getHeaders(),
    }
  );

  return response.data;
};

// Reject booking
export const rejectBooking = async (
  id: string
) => {
  const response = await axios.patch(
    `${API_URL}/bookings/${id}/reject`,
    {},
    {
      headers: getHeaders(),
    }
  );

  return response.data;
};

// Activate booking
export const activateBooking = async (
  id: string
) => {
  const response = await axios.patch(
    `${API_URL}/bookings/${id}/activate`,
    {},
    {
      headers: getHeaders(),
    }
  );

  return response.data;
};

// Complete booking
export const completeBooking = async (
  id: string
) => {
  const response = await axios.patch(
    `${API_URL}/bookings/${id}/complete`,
    {},
    {
      headers: getHeaders(),
    }
  );

  return response.data;
};

// ================================
// ADMIN VEHICLES
// ================================

// Create vehicle
export const createVehicle = async (
  formData: FormData
) => {
  const response = await axios.post(
    `${API_URL}/vehicles`,
    formData,
    {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Update vehicle
export const updateVehicle = async (
  id: string,
  formData: FormData
) => {
  const response = await axios.put(
    `${API_URL}/vehicles/${id}`,
    formData,
    {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Delete vehicle
export const deleteVehicle = async (
  id: string
) => {
  const response = await axios.delete(
    `${API_URL}/vehicles/${id}`,
    {
      headers: getHeaders(),
    }
  );

  return response.data;
};