const express = require("express");
const router = express.Router();

const {
    addAsset,
    getAssets,
    updateAsset,
    deleteAsset,
    assignAsset,
    getDashboardStats,
    getAssignments,
    returnAsset
} = require("../controllers/assetController");

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// View assets - Admin + User
router.get(
    "/",
    verifyToken,
    getAssets
);

// Dashboard - Admin + User
router.get(
    "/dashboard",
    verifyToken,
    adminOnly,
    getDashboardStats
);

// View assignments - Admin + User
router.get(
    "/assignments",
    verifyToken,
    getAssignments
);

// Add asset - Admin only
router.post(
    "/add",
    verifyToken,
    adminOnly,
    addAsset
);

// Update asset - Admin only
router.put(
    "/:id",
    verifyToken,
    adminOnly,
    updateAsset
);

// Delete asset - Admin only
router.delete(
    "/:id",
    verifyToken,
    adminOnly,
    deleteAsset
);

// Assign asset - Admin only
router.post(
    "/assign",
    verifyToken,
    adminOnly,
    assignAsset
);

// Return asset - Admin only
router.put(
    "/return/:id",
    verifyToken,
    adminOnly,
    returnAsset
);

module.exports = router;