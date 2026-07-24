import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Assets() {
  const [search, setSearch] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assets, setAssets] = useState([]);

  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [status, setStatus] = useState("Available");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

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

  const clearForm = () => {
    setEditId(null);
    setAssetName("");
    setAssetType("");
    setSerialNumber("");
    setPurchaseDate("");
    setQuantity("");
    setAvailableQuantity("");
    setStatus("Available");
  };

  const saveAsset = async () => {
    try {
      if (
        !assetName ||
        !assetType ||
        !serialNumber ||
        !purchaseDate ||
        !quantity ||
        !availableQuantity
      ) {
        alert("Please fill all fields");
        return;
      }

      const token = localStorage.getItem("token");

      const data = {
        asset_name: assetName,
        asset_type: assetType,
        serial_number: serialNumber,
        purchase_date: purchaseDate,
        quantity,
        available_quantity: availableQuantity,
        status,
      };

      if (editId) {
        await API.put(`/assets/${editId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Asset Updated Successfully");
      } else {
        await API.post("/assets/add", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Asset Added Successfully");
      }

      clearForm();
      fetchAssets();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Operation Failed"
      );
    }
  };

  const editAsset = (asset) => {
    setEditId(asset.id);
    setAssetName(asset.asset_name);
    setAssetType(asset.asset_type);
    setSerialNumber(asset.serial_number);
    setPurchaseDate(
      asset.purchase_date?.substring(0, 10)
    );
    setQuantity(asset.quantity);
    setAvailableQuantity(asset.available_quantity);
    setStatus(asset.status);
  };

  const deleteAsset = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/assets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Asset Deleted Successfully");

      fetchAssets();
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Error deleting asset"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="assets-container">

        {/* PAGE TITLE */}
        <h1 className="page-title">
          Assets
        </h1>

        {/* SEARCH AND FILTER */}
        <div className="search-filter-section">

          <h2>
            Search & Filter Assets
          </h2>

          <div className="filter-grid">

            {/* SEARCH */}
            <div className="filter-group search-group">

              <label>
                Search Assets
              </label>

              <input
                type="text"
                placeholder="Search by Asset Name, Type or Serial Number"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* ASSET TYPE */}
            <div className="filter-group">

              <label>
                Asset Type
              </label>

              <select
                value={assetTypeFilter}
                onChange={(e) =>
                  setAssetTypeFilter(e.target.value)
                }
              >

                <option value="">
                  All Asset Types
                </option>

                {[
                  ...new Map(
                    assets
                      .filter(
                        (asset) =>
                          asset.asset_type
                      )
                      .map((asset) => [
                        asset.asset_type.toLowerCase(),
                        asset.asset_type,
                      ])
                  ).values(),
                ].map((type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).toLowerCase()}
                  </option>

                ))}

              </select>

            </div>

            {/* STATUS */}
            <div className="filter-group">

              <label>
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="">
                  All Status
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Assigned">
                  Assigned
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ADMIN ONLY - ADD / UPDATE ASSET */}
        {isAdmin && (

          <div className="asset-form-section">

            <h2>
              {editId
                ? "Update Asset"
                : "Add Asset"}
            </h2>

            <div className="asset-form-grid">

              <div className="form-group">

                <label>
                  Asset Name
                </label>

                <input
                  placeholder="Enter Asset Name"
                  value={assetName}
                  onChange={(e) =>
                    setAssetName(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Asset Type
                </label>

                <input
                  placeholder="Enter Asset Type"
                  value={assetType}
                  onChange={(e) =>
                    setAssetType(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Serial Number
                </label>

                <input
                  placeholder="Enter Serial Number"
                  value={serialNumber}
                  onChange={(e) =>
                    setSerialNumber(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Purchase Date
                </label>

                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) =>
                    setPurchaseDate(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  placeholder="Enter Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Available Quantity
                </label>

                <input
                  type="number"
                  placeholder="Enter Available Quantity"
                  value={availableQuantity}
                  onChange={(e) =>
                    setAvailableQuantity(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >

                  <option value="Available">
                    Available
                  </option>

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                </select>

              </div>

            </div>

            <div className="asset-form-actions">

              <button
                className="save-btn"
                onClick={saveAsset}
              >
                {editId
                  ? "Update Asset"
                  : "Add Asset"}
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

        {/* ASSET TABLE */}
        <div className="asset-table-section">

          <h2>
            Asset List
          </h2>

          <div className="table-wrapper">

            <table className="asset-table">

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Asset Name</th>
                  <th>Type</th>
                  <th>Serial Number</th>
                  <th>Purchase Date</th>
                  <th>Quantity</th>
                  <th>Available</th>
                  <th>Status</th>

                  {isAdmin && (
                    <th>Actions</th>
                  )}

                </tr>

              </thead>

              <tbody>

                {assets
                  .filter((asset) => {

                    const matchesSearch =
                      `${asset.asset_name}
                      ${asset.asset_type}
                      ${asset.serial_number}`
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        );

                    const matchesAssetType =
                      assetTypeFilter === "" ||
                      asset.asset_type ===
                        assetTypeFilter;

                    const matchesStatus =
                      statusFilter === "" ||
                      asset.status ===
                        statusFilter;

                    return (
                      matchesSearch &&
                      matchesAssetType &&
                      matchesStatus
                    );

                  })
                  .map((asset) => (

                    <tr key={asset.id}>

                      <td>
                        {asset.id}
                      </td>

                      <td>
                        {asset.asset_name}
                      </td>

                      <td>
                        {asset.asset_type}
                      </td>

                      <td>
                        {asset.serial_number}
                      </td>

                      <td>
                        {asset.purchase_date?.substring(
                          0,
                          10
                        )}
                      </td>

                      <td>
                        {asset.quantity}
                      </td>

                      <td>
                        {asset.available_quantity}
                      </td>

                      <td>

                        <span
                          className={
                            asset.status ===
                            "Available"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {asset.status}
                        </span>

                      </td>

                      {isAdmin && (

                        <td className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editAsset(asset)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => {

                              if (
                                window.confirm(
                                  "Delete this asset?"
                                )
                              ) {
                                deleteAsset(
                                  asset.id
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

export default Assets;