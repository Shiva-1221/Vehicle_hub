import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// User pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import VehicleList from "../pages/VehicleList";
import VehicleDetails from "../pages/VehicleDetails";
import MyBookings from "../pages/MyBookings";

// Common components
import Navbar from "../components/Navbar";
import AdminRoute from "../components/AdminRoute";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminVehicles from "../pages/admin/AdminVehicles";
import AddVehicle from "../pages/admin/AddVehicle";
import AdminBookings from "../pages/admin/AdminBookings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      {/* Navbar appears on all pages */}
      <Navbar />

      <Routes>
        {/* ================================
            USER ROUTES
            ================================ */}

        {/* Home / Vehicle List */}
        <Route
          path="/"
          element={<VehicleList />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Vehicle Details */}
        <Route
          path="/vehicles/:id"
          element={<VehicleDetails />}
        />

        {/* My Bookings */}
        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        {/* ================================
            ADMIN ROUTES
            ================================ */}

        <Route element={<AdminRoute />}>
          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* Admin Vehicle List */}
          <Route
            path="/admin/vehicles"
            element={<AdminVehicles />}
          />

          {/* Add Vehicle */}
          <Route
            path="/admin/vehicles/add"
            element={<AddVehicle />}
          />

          {/* Admin Bookings */}
          <Route
            path="/admin/bookings"
            element={<AdminBookings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;