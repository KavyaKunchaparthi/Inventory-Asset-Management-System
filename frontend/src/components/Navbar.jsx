import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get logged-in user's role
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav
      style={{
        background: "#1976d2",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
      }}
    >
      <h2>Inventory System</h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        {/* Dashboard - Everyone */}
        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>

        {/* Admin Only */}
        {isAdmin && (
          <>
            <Link
              to="/employees"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Employees
            </Link>

            <Link
              to="/assets"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Assets
            </Link>
          </>
        )}

        {/* Everyone */}
        <Link
          to="/assignments"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Assignments
        </Link>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            background: "white",
            color: "#1976d2",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;