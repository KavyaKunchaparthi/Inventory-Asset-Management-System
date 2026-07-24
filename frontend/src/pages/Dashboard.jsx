import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
  });

  const [myAssignments, setMyAssignments] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminDashboard();
    } else {
      fetchMyAssignments();
    }
  }, [isAdmin]);

  // =========================
  // ADMIN DASHBOARD DATA
  // =========================

  const fetchAdminDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/assets/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  // =========================
  // EMPLOYEE DASHBOARD DATA
  // =========================

  const fetchMyAssignments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/assets/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyAssignments(res.data);
    } catch (error) {
      console.log("Assignment Error:", error);
    }
  };

  // =========================
  // ADMIN DASHBOARD
  // =========================

  if (isAdmin) {
    return (
      <>
        <Navbar />

        <div className="dashboard-container">

          {/* HEADER */}

          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>

            <p>
              Overview of your organization's employees and inventory.
            </p>
          </div>


          {/* SUMMARY CARDS */}

          <div className="stats-grid">

            {/* TOTAL EMPLOYEES */}

            <div
              className="stat-card"
              onClick={() => navigate("/employees")}
            >
              <div className="stat-icon">
                👥
              </div>

              <div className="stat-content">

                <p>Total Employees</p>

                <h2>
                  {stats.totalEmployees}
                </h2>

                <small>
                  Employees in the organization.
                </small>

                <span className="card-link">
                  View Employees →
                </span>

              </div>
            </div>


            {/* ASSET TYPES */}

            <div
              className="stat-card"
              onClick={() => navigate("/assets")}
            >
              <div className="stat-icon">
                💻
              </div>

              <div className="stat-content">

                <p>Asset Types</p>

                <h2>
                  {stats.totalAssets}
                </h2>

                <small>
                  Total asset types registered in inventory.
                </small>

                <span className="card-link">
                  View Assets →
                </span>

              </div>
            </div>


            {/* AVAILABLE UNITS */}

            <div
              className="stat-card"
              onClick={() => navigate("/assets")}
            >
              <div className="stat-icon">
                📦
              </div>

              <div className="stat-content">

                <p>Available Units</p>

                <h2>
                  {stats.availableAssets}
                </h2>

                <small>
                  Assets currently available for assignment.
                </small>

                <span className="card-link">
                  Check Inventory →
                </span>

              </div>
            </div>


            {/* ASSIGNED UNITS */}

            <div
              className="stat-card"
              onClick={() => navigate("/assignments")}
            >
              <div className="stat-icon">
                🔄
              </div>

              <div className="stat-content">

                <p>Assigned Units</p>

                <h2>
                  {stats.assignedAssets}
                </h2>

                <small>
                  Assets currently assigned to employees.
                </small>

                <span className="card-link">
                  View Assignments →
                </span>

              </div>
            </div>

          </div>

        </div>
      </>
    );
  }


  // =========================
  // EMPLOYEE DASHBOARD
  // =========================

  const currentlyAssigned = myAssignments.filter(
    (item) => item.status === "Assigned"
  ).length;

  const totalHistory = myAssignments.length;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <div className="dashboard-header">

          <h1>My Dashboard</h1>

          <p>
            Welcome! Below is a summary of your assigned assets.
          </p>

        </div>


        <div className="stats-grid">

          {/* MY ASSIGNED ASSETS */}

          <div
            className="stat-card"
            onClick={() => navigate("/assignments")}
          >
            <div className="stat-icon">
              💻
            </div>

            <div className="stat-content">

              <p>My Assigned Assets</p>

              <h2>
                {currentlyAssigned}
              </h2>

              <small>
                Assets currently assigned to you.
              </small>

              <span className="card-link">
                View My Assets →
              </span>

            </div>
          </div>


          {/* ASSIGNMENT HISTORY */}

          <div
            className="stat-card"
            onClick={() => navigate("/assignments")}
          >
            <div className="stat-icon">
              📋
            </div>

            <div className="stat-content">

              <p>Assignment History</p>

              <h2>
                {totalHistory}
              </h2>

              <small>
                Your complete asset assignment history.
              </small>

              <span className="card-link">
                View History →
              </span>

            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;