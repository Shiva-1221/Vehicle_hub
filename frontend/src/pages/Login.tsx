import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setError("");

      const data = await loginUser({
        email,
        password,
      });

      login(data.token, data.user);

      navigate("/");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Login</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
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
          Login
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;