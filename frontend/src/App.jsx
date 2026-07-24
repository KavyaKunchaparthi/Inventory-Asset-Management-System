import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Assets from "./pages/Assets";
import Assignments from "./pages/Assignments";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Logged-in users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assignments"
        element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        }
      />

      {/* Admin-only pages */}
      <Route
        path="/employees"
        element={
          <ProtectedRoute adminOnly={true}>
            <Employees />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assets"
        element={
          <ProtectedRoute adminOnly={true}>
            <Assets />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;