import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      await registerUser({
        name,
        email,
        password,
      });

      alert("Registration successful");

      navigate("/login");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Register</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <br />

        <button type="submit">
          Register
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;