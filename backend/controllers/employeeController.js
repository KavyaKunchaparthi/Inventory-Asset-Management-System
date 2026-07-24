const db = require("../config/db");

const addEmployee = (req, res) => {

    const {
        employee_id,
        name,
        department,
        designation,
        email,
        phone,
        status
    } = req.body;

    const sql = `
        INSERT INTO employees
        (employee_id, name, department, designation, email, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_id,
            name,
            department,
            designation,
            email,
            phone,
            status
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Employee Added Successfully"
            });
        }
    );
};

const getEmployees = (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
};
const updateEmployee = (req, res) => {

    const { id } = req.params;

    const {
        employee_id,
        name,
        department,
        designation,
        email,
        phone,
        status
    } = req.body;

    const sql = `
        UPDATE employees
        SET
        employee_id=?,
        name=?,
        department=?,
        designation=?,
        email=?,
        phone=?,
        status=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            employee_id,
            name,
            department,
            designation,
            email,
            phone,
            status,
            id
        ],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Employee Updated Successfully"
            });

        }
    );

};
const deleteEmployee = (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM employees WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Employee Not Found"
                });
            }

            res.json({
                message: "Employee Deleted Successfully"
            });

        }
    );

};
module.exports = {
    addEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
};