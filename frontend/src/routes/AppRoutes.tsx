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
      <Navbar />

      <Routes>
        {/* ================================
            USER ROUTES
            ================================ */}

        <Route
          path="/"
          element={<VehicleList />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/vehicles/:id"
          element={<VehicleDetails />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        {/* ================================
            ADMIN ROUTES
            ================================ */}

        <Route element={<AdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/vehicles"
            element={<AdminVehicles />}
          />

          <Route
            path="/admin/vehicles/add"
            element={<AddVehicle />}
          />

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