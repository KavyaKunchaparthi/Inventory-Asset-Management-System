import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");

      // Clear previous login session
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/");
    } catch (err) {
      console.log(err);
      console.log(err.response);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* HEADER */}
        <div className="auth-header">

          <h1>
            Create Account
          </h1>

          <p>
            Register to access the Inventory &
            Asset Management System
          </p>

        </div>

        {/* REGISTER FORM */}
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          <div className="auth-form-group">

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

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
              placeholder="Create a password"
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
            Register
          </button>

        </form>

        {/* LOGIN LINK */}
        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <button
            className="auth-link-btn"
            onClick={() =>
              navigate("/")
            }
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;