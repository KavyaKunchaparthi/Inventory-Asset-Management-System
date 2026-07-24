import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <h1>
            Inventory & Asset
            <br />
            Management
          </h1>

          <p>
            Sign in to manage your organization's
            assets and inventory
          </p>

        </div>

        {/* LOGIN FORM */}
        <form
          className="auth-form"
          onSubmit={handleLogin}
        >

          <div className="auth-form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          <div className="auth-form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="auth-primary-btn"
          >
            Login
          </button>

        </form>

        {/* REGISTER LINK */}
        <div className="auth-footer">

          <span>
            Don't have an account?
          </span>

          <button
            className="auth-link-btn"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;