import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Employees() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employees, setEmployees] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Active");

  const [editId, setEditId] = useState(null);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const clearForm = () => {
    setEditId(null);
    setEmployeeId("");
    setName("");
    setDepartment("");
    setDesignation("");
    setEmail("");
    setPhone("");
    setStatus("Active");
  };

  const saveEmployee = async () => {
    try {
      if (
        !employeeId ||
        !name ||
        !department ||
        !designation ||
        !email ||
        !phone
      ) {
        alert("Please fill all fields");
        return;
      }

      const token = localStorage.getItem("token");

      const data = {
        employee_id: employeeId,
        name,
        department,
        designation,
        email,
        phone,
        status,
      };

      if (editId) {
        await API.put(`/employees/${editId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Employee Updated Successfully");
      } else {
        await API.post("/employees/add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Employee Added Successfully");
      }

      clearForm();
      fetchEmployees();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Operation Failed"
      );
    }
  };

  const editEmployee = (employee) => {
    setEditId(employee.id);
    setEmployeeId(employee.employee_id);
    setName(employee.name);
    setDepartment(employee.department || "");
    setDesignation(employee.designation || "");
    setEmail(employee.email || "");
    setPhone(employee.phone || "");
    setStatus(employee.status || "Active");
  };

  const deleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Employee Deleted Successfully");

      fetchEmployees();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Error deleting employee"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="employees-container">

        {/* PAGE TITLE */}
        <h1 className="page-title">Employees</h1>

        {/* SEARCH AND FILTER */}
        <div className="search-filter-section">
          <h2>Search & Filter Employees</h2>

          <div className="filter-grid">

            <div className="filter-group search-group">
              <label>Search Employees</label>

              <input
                type="text"
                placeholder="Search by Employee ID, Name or Department"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="filter-group">
              <label>Department</label>

              <select
                value={departmentFilter}
                onChange={(e) =>
                  setDepartmentFilter(e.target.value)
                }
              >
                <option value="">
                  All Departments
                </option>

                {[
                  ...new Set(
                    employees
                      .map((emp) => emp.department)
                      .filter(Boolean)
                  ),
                ].map((department) => (
                  <option
                    key={department}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >
                <option value="">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* ADMIN ONLY */}
        {isAdmin && (
          <div className="employee-form-section">

            <h2>
              {editId
                ? "Update Employee"
                : "Add Employee"}
            </h2>

            <div className="employee-form-grid">

              <div className="form-group">
                <label>Employee ID</label>
                <input
                  placeholder="Enter Employee ID"
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  placeholder="Enter Department"
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <input
                  placeholder="Enter Designation"
                  value={designation}
                  onChange={(e) =>
                    setDesignation(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  placeholder="Enter Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            <div className="employee-form-actions">

              <button
                className="save-btn"
                onClick={saveEmployee}
              >
                {editId
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

              {editId && (
                <button
                  className="cancel-btn"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </div>
        )}

        {/* EMPLOYEE TABLE */}
        <div className="employee-table-section">

          <h2>Employee List</h2>

          <div className="table-wrapper">

            <table className="employee-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>

                  {isAdmin && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>

                {employees
                  .filter((emp) => {

                    const matchesSearch =
                      `${emp.employee_id} ${
                        emp.name
                      } ${
                        emp.department || ""
                      }`
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        );

                    const matchesDepartment =
                      departmentFilter === "" ||
                      emp.department ===
                        departmentFilter;

                    const matchesStatus =
                      statusFilter === "" ||
                      emp.status === statusFilter;

                    return (
                      matchesSearch &&
                      matchesDepartment &&
                      matchesStatus
                    );
                  })
                  .map((emp) => (

                    <tr key={emp.id}>

                      <td>{emp.id}</td>

                      <td>
                        {emp.employee_id}
                      </td>

                      <td>{emp.name}</td>

                      <td>
                        {emp.department}
                      </td>

                      <td>
                        {emp.designation}
                      </td>

                      <td>{emp.email}</td>

                      <td>{emp.phone}</td>

                      <td>
                        <span
                          className={
                            emp.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {emp.status}
                        </span>
                      </td>

                      {isAdmin && (
                        <td className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editEmployee(emp)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => {

                              if (
                                window.confirm(
                                  "Delete this employee?"
                                )
                              ) {
                                deleteEmployee(
                                  emp.id
                                );
                              }

                            }}
                          >
                            Delete
                          </button>

                        </td>
                      )}

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

export default Employees;