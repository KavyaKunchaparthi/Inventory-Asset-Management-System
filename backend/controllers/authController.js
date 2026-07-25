const jwt = require("jsonwebtoken");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

const register = async (req, res) => {
    // Role is intentionally NOT accepted from the client
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: "Invalid email"
        });
    }

    try {
        db.query(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, result) => {
                if (err) {
    console.error("Registration Database Error:", err);

    return res.status(500).json({
        message: "Database error",
        error: err.message
    });
}

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                // Every normal registration is automatically a user
                const role = "user";

                db.query(
                    "INSERT INTO users(name, email, password, role) VALUES(?,?,?,?)",
                    [
                        name,
                        email,
                        hashedPassword,
                        role
                    ],
                    (err) => {
    if (err) {
        console.error("INSERT USER ERROR:", err);

        return res.status(500).json({
            message: "Registration failed",
            error: err.message
        });
    }

    res.status(201).json({
        message: "User Registered Successfully"
    });
}
                );
            }
        );
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid Email"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                message: "Login Successful",
                token,
                role: user.role
            });
        }
    );
};


module.exports = {
    register,
    login
};