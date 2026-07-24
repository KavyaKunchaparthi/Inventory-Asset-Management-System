const db = require("../config/db");

const addAsset = (req, res) => {

    const {
        asset_name,
        asset_type,
        serial_number,
        purchase_date,
        quantity,
        available_quantity,
        status
    } = req.body;

    const sql = `
        INSERT INTO assets
        (asset_name, asset_type, serial_number,
         purchase_date, quantity,
         available_quantity, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            asset_name,
            asset_type,
            serial_number,
            purchase_date,
            quantity,
            available_quantity,
            status
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Asset Added Successfully"
            });

        }
    );

};
const getAssets = (req, res) => {

    db.query("SELECT * FROM assets", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};
const updateAsset = (req, res) => {

    const { id } = req.params;

    const {
        asset_name,
        asset_type,
        serial_number,
        purchase_date,
        quantity,
        available_quantity,
        status
    } = req.body;

    const sql = `
        UPDATE assets
        SET
        asset_name = ?,
        asset_type = ?,
        serial_number = ?,
        purchase_date = ?,
        quantity = ?,
        available_quantity = ?,
        status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            asset_name,
            asset_type,
            serial_number,
            purchase_date,
            quantity,
            available_quantity,
            status,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Asset Not Found"
                });
            }

            res.json({
                message: "Asset Updated Successfully"
            });

        }
    );

};
const deleteAsset = (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM asset_assignments WHERE asset_id = ? AND status = 'Assigned'",
        [id],
        (err, assignmentResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (assignmentResult.length > 0) {
                return res.status(400).json({
                    message: "Asset is currently assigned and cannot be deleted"
                });
            }

            db.query(
                "DELETE FROM assets WHERE id = ?",
                [id],
                (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({
                            message: "Asset Not Found"
                        });
                    }

                    res.json({
                        message: "Asset Deleted Successfully"
                    });

                }
            );

        }
    );

};
const assignAsset = (req, res) => {
    const {
        employee_id,
        asset_id,
        assigned_date
    } = req.body;

    if (!employee_id || !asset_id || !assigned_date) {
        return res.status(400).json({
            message: "Employee, Asset and Assigned Date are required"
        });
    }

    // Check employee exists
    db.query(
        "SELECT id FROM employees WHERE id = ?",
        [employee_id],
        (err, employeeResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (employeeResult.length === 0) {
                return res.status(404).json({
                    message: "Employee Not Found"
                });
            }

            // Check asset availability
            db.query(
                "SELECT available_quantity FROM assets WHERE id = ?",
                [asset_id],
                (err, assetResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (assetResult.length === 0) {
                        return res.status(404).json({
                            message: "Asset Not Found"
                        });
                    }

                    if (assetResult[0].available_quantity <= 0) {
                        return res.status(400).json({
                            message: "Asset Not Available"
                        });
                    }

                    // Create assignment
                    db.query(
                        `INSERT INTO asset_assignments
                        (employee_id, asset_id, assigned_date, status)
                        VALUES (?, ?, ?, 'Assigned')`,
                        [
                            employee_id,
                            asset_id,
                            assigned_date
                        ],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            // Decrease available quantity
                            db.query(
                                `UPDATE assets
                                 SET available_quantity = available_quantity - 1
                                 WHERE id = ?`,
                                [asset_id],
                                (err) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    res.json({
                                        message: "Asset Assigned Successfully"
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

const getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalEmployees FROM employees",
        (err, employeeResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            stats.totalEmployees = employeeResult[0].totalEmployees;

            db.query(
                "SELECT COUNT(*) AS totalAssets FROM assets",
                (err, assetResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    stats.totalAssets = assetResult[0].totalAssets;

                    db.query(
                        "SELECT SUM(available_quantity) AS availableAssets FROM assets",
                        (err, availableResult) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            stats.availableAssets =
                                availableResult[0].availableAssets || 0;

                            db.query(
                                "SELECT COUNT(*) AS assignedAssets FROM asset_assignments WHERE status='Assigned'",
                                (err, assignedResult) => {

                                    if (err) {
                                        return res.status(500).json(err);
                                    }

                                    stats.assignedAssets =
                                        assignedResult[0].assignedAssets;

                                    res.json(stats);

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};
const getAssignments = (req, res) => {

    // ADMIN: See all assignment records
    if (req.user.role === "admin") {

        const sql = `
            SELECT
            aa.id,
            e.employee_id,
            e.name,
            e.email AS employee_email,
            a.asset_name,
            a.serial_number,
            aa.assigned_date,
            aa.return_date,
            aa.status
            FROM asset_assignments aa
            JOIN employees e ON aa.employee_id = e.id
            JOIN assets a ON aa.asset_id = a.id
            ORDER BY aa.id DESC
        `;

        db.query(sql, (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        });

    } else {

        // USER: See only their own assignment records
        // req.user.id is the users table ID
        const sql = `
            SELECT
                aa.id,
                e.employee_id,
                e.name,
                a.asset_name,
                a.serial_number,
                aa.assigned_date,
                aa.return_date,
                aa.status
            FROM asset_assignments aa
            JOIN employees e ON aa.employee_id = e.id
            JOIN assets a ON aa.asset_id = a.id
            JOIN users u ON u.email = e.email
            WHERE u.id = ?
            ORDER BY aa.id DESC
        `;

        db.query(sql, [req.user.id], (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);
        });
    }
};
const returnAsset = (req, res) => {

    const { id } = req.params;

    // Find assignment
    db.query(
        "SELECT * FROM asset_assignments WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Assignment Not Found"
                });
            }

            const assignment = result[0];

            // Prevent returning an already returned asset
            if (assignment.status === "Returned") {
                return res.status(400).json({
                    message: "Asset has already been returned"
                });
            }

            // Mark assignment as returned
            db.query(
                `UPDATE asset_assignments
                 SET status = 'Returned',
                     return_date = CURDATE()
                 WHERE id = ? AND status = 'Assigned'`,
                [id],
                (err, updateResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (updateResult.affectedRows === 0) {
                        return res.status(400).json({
                            message: "Asset has already been returned"
                        });
                    }

                    // Increase available quantity
                    db.query(
                        `UPDATE assets
                         SET available_quantity =
                             available_quantity + 1
                         WHERE id = ?`,
                        [assignment.asset_id],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }

                            res.json({
                                message: "Asset Returned Successfully"
                            });
                        }
                    );
                }
            );
        }
    );
};
module.exports = {
    addAsset,
    getAssets,
    updateAsset,
    deleteAsset,
    assignAsset,
    getDashboardStats,
    getAssignments,
    returnAsset
};