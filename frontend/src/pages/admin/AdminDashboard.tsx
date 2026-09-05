import { useEffect, useState } from "react";

import {
  getDashboard,
} from "../../services/adminApi";

interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  activeRentals: number;
  pendingBookings: number;
  approvedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalBookings: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] =
    useState<DashboardStats | null>(
      null
    );

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          const data =
            await getDashboard();

          setStats(data);
        } catch (error) {
          console.error(error);
        }
      };

    loadDashboard();
  }, []);

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Dashboard</h1>

      <p>
        Customers:{" "}
        {stats.totalCustomers}
      </p>

      <p>
        Vehicles:{" "}
        {stats.totalVehicles}
      </p>

      <p>
        Active Rentals:{" "}
        {stats.activeRentals}
      </p>

      <p>
        Total Bookings:{" "}
        {stats.totalBookings}
      </p>

      <p>
        Pending:{" "}
        {stats.pendingBookings}
      </p>

      <p>
        Approved:{" "}
        {stats.approvedBookings}
      </p>

      <p>
        Completed:{" "}
        {stats.completedBookings}
      </p>

      <p>
        Cancelled:{" "}
        {stats.cancelledBookings}
      </p>

      <p>
        Revenue: ₹
        {stats.totalRevenue}
      </p>
    </div>
  );
};

export default AdminDashboard;