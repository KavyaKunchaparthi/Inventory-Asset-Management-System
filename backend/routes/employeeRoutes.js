const express = require("express");
const router = express.Router();

const {
    addEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ADMIN ONLY
router.post(
    "/add",
    verifyToken,
    adminOnly,
    addEmployee
);

// ADMIN + USER
router.get(
    "/",
    verifyToken,
    getEmployees
);

// ADMIN ONLY
router.put(
    "/:id",
    verifyToken,
    adminOnly,
    updateEmployee
);

// ADMIN ONLY
router.delete(
    "/:id",
    verifyToken,
    adminOnly,
    deleteEmployee
);

module.exports = router;