import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "15px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/" style={{ marginRight: "20px" }}>
          VehicleRent
        </Link>

        <Link to="/" style={{ marginRight: "20px" }}>
          Vehicles
        </Link>

        {user && (
          <Link to="/my-bookings">
            My Bookings
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: "15px" }}>
              Hello, {user.name}
            </span>

            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: "15px" }}>
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;