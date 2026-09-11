import { useEffect, useState } from "react";

import { getDashboard } from "../../services/adminApi";

interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  activeRentals: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const data = await getDashboard();

        setStats(data);
      } catch (error: any) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    };

    loadDashboard();
  }, []);

  // Show error
  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>{error}</h2>
      </div>
    );
  }

  // Show loading
  if (!stats) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // Show dashboard
  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div>
          <h3>Total Customers</h3>
          <p>{stats.totalCustomers}</p>
        </div>

        <div>
          <h3>Total Vehicles</h3>
          <p>{stats.totalVehicles}</p>
        </div>

        <div>
          <h3>Active Rentals</h3>
          <p>{stats.activeRentals}</p>
        </div>

        <div>
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>

        <div>
          <h3>Pending</h3>
          <p>{stats.pendingBookings}</p>
        </div>

        <div>
          <h3>Approved</h3>
          <p>{stats.approvedBookings}</p>
        </div>

        <div>
          <h3>Completed</h3>
          <p>{stats.completedBookings}</p>
        </div>

        <div>
          <h3>Cancelled</h3>
          <p>{stats.cancelledBookings}</p>
        </div>

        <div>
          <h3>Total Revenue</h3>
          <p>₹{stats.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;