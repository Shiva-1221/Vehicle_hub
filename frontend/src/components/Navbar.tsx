import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <Link
          to="/"
          className="navbar-brand"
        >
          VehicleRent
        </Link>

        <Link
          to="/"
          className="navbar-link"
        >
          Vehicles
        </Link>

        {user && (
          <Link
            to="/my-bookings"
            className="navbar-link"
          >
            My Bookings
          </Link>
        )}

        {user?.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="navbar-link"
            >
              Admin Dashboard
            </Link>

            <Link
              to="/admin/vehicles"
              className="navbar-link"
            >
              Manage Vehicles
            </Link>

            <Link
              to="/admin/bookings"
              className="navbar-link"
            >
              Manage Bookings
            </Link>
          </>
        )}

      </div>

      <div className="navbar-right">

        {user ? (
          <>
            <span className="navbar-user">
              Hello, {user.name}
            </span>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="navbar-link"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="navbar-link"
            >
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
};

export default Navbar;