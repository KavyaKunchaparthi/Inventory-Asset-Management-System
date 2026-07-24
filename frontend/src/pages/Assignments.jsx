import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Assignments() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [employeeId, setEmployeeId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [assignedDate, setAssignedDate] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  useEffect(() => {
    fetchAssignments();

    if (isAdmin) {
      fetchEmployees();
      fetchAssets();
    }
  }, [isAdmin]);

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

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/assets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/assets/assignments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAssignments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const assignAsset = async () => {
    try {
      if (!employeeId || !assetId || !assignedDate) {
        alert("Please select Employee, Asset and Assigned Date");
        return;
      }

      const token = localStorage.getItem("token");

      await API.post(
        "/assets/assign",
        {
          employee_id: employeeId,
          asset_id: assetId,
          assigned_date: assignedDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Asset Assigned Successfully");

      setEmployeeId("");
      setAssetId("");
      setAssignedDate("");

      fetchAssets();
      fetchAssignments();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to Assign Asset"
      );
    }
  };

  const returnAsset = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/assets/return/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Asset Returned Successfully");

      fetchAssets();
      fetchAssignments();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to Return Asset"
      );
    }
  };

  const filteredAssignments = isAdmin
    ? assignments.filter((item) => {
        const searchText = search.toLowerCase();

        return (
          item.employee_id
            ?.toLowerCase()
            .includes(searchText) ||
          item.name
            ?.toLowerCase()
            .includes(searchText) ||
          item.asset_name
            ?.toLowerCase()
            .includes(searchText) ||
          item.status
            ?.toLowerCase()
            .includes(searchText)
        );
      })
    : assignments;

  return (
    <>
      <Navbar />

      <div className="assignments-container">

        {/* PAGE TITLE */}
        <h1 className="page-title">
          Asset Assignments
        </h1>

        {/* ADMIN SEARCH */}
        {isAdmin && (
          <div className="assignment-search-section">

            <h2>Search Assignments</h2>

            <div className="assignment-search-group">

              <label>Search Assignments</label>

              <input
                type="text"
                placeholder="Search by Employee ID, Name, Asset or Status"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>
        )}

        {/* ADMIN ASSIGN ASSET */}
        {isAdmin && (
          <div className="assignment-form-section">

            <h2>Assign Asset</h2>

            <div className="assignment-form-grid">

              {/* Employee */}
              <div className="form-group">

                <label>Employee</label>

                <select
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(e.target.value)
                  }
                >
                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((emp) => (
                    <option
                      key={emp.id}
                      value={emp.id}
                    >
                      {emp.employee_id} - {emp.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Asset */}
              <div className="form-group">

                <label>Asset</label>

                <select
                  value={assetId}
                  onChange={(e) =>
                    setAssetId(e.target.value)
                  }
                >
                  <option value="">
                    Select Asset
                  </option>

                  {assets.map((asset) => (
                    <option
                      key={asset.id}
                      value={asset.id}
                      disabled={
                        asset.available_quantity === 0
                      }
                    >
                      {asset.asset_name} -{" "}
                      {asset.serial_number}{" "}
                      (Available:{" "}
                      {asset.available_quantity})
                    </option>
                  ))}

                </select>

              </div>

              {/* Assigned Date */}
              <div className="form-group">

                <label>Assigned Date</label>

                <input
                  type="date"
                  max={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  value={assignedDate}
                  onChange={(e) =>
                    setAssignedDate(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="assignment-form-actions">

              <button
                className="save-btn"
                onClick={() => {
                  if (
                    window.confirm(
                      "Assign this asset?"
                    )
                  ) {
                    assignAsset();
                  }
                }}
              >
                Assign Asset
              </button>

            </div>

          </div>
        )}

        {/* EMPLOYEE MESSAGE */}
        {!isAdmin && (
          <div className="assignment-info-section">
            <p>
              Below are the assets currently assigned
              to you.
            </p>
          </div>
        )}

        {/* ASSIGNMENT TABLE */}
        <div className="assignment-table-section">

          <h2>Assigned Assets</h2>

          <div className="table-wrapper">

            <table className="assignment-table">

              <thead>
                <tr>

                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Asset</th>
                  <th>Assigned Date</th>
                  <th>Return Date</th>
                  <th>Status</th>

                  {isAdmin && (
                    <th>Action</th>
                  )}

                </tr>
              </thead>

              <tbody>

                {filteredAssignments.map(
                  (item) => (

                    <tr key={item.id}>

                      <td>
                        {item.employee_id}
                      </td>

                      <td>
                        {item.name}
                      </td>

                      <td>
                        {item.asset_name} -{" "}
                        {item.serial_number}
                      </td>

                      <td>
                        {item.assigned_date?.substring(
                          0,
                          10
                        )}
                      </td>

                      <td>
                        {item.return_date
                          ? item.return_date.substring(
                              0,
                              10
                            )
                          : "-"}
                      </td>

                      <td>

                        <span
                          className={
                            item.status ===
                            "Assigned"
                              ? "status-assigned"
                              : "status-returned"
                          }
                        >
                          {item.status}
                        </span>

                      </td>

                      {isAdmin && (
                        <td className="action-buttons">

                          {item.status ===
                            "Assigned" && (

                            <button
                              className="return-btn"
                              onClick={() => {

                                if (
                                  window.confirm(
                                    "Return this asset?"
                                  )
                                ) {
                                  returnAsset(
                                    item.id
                                  );
                                }

                              }}
                            >
                              Return
                            </button>

                          )}

                        </td>
                      )}

                    </tr>

                  )
                )}

                {!isAdmin &&
                  assignments.length === 0 && (

                    <tr>

                      <td
                        colSpan="6"
                        className="empty-message"
                      >
                        No assets assigned to you.
                      </td>

                    </tr>

                  )}

                {isAdmin &&
                  filteredAssignments.length === 0 && (

                    <tr>

                      <td
                        colSpan="7"
                        className="empty-message"
                      >
                        No assignments found.
                      </td>

                    </tr>

                  )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

export default Assignments;