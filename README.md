# IBM Client Project – Inventory & Asset Management System

## 📌 Project Overview

The **Inventory & Asset Management System** is a full-stack web application developed to help organizations manage company assets and track their allocation to employees.

The system provides a centralized platform where administrators can manage employees, maintain the organization's asset inventory, assign assets to employees, track asset returns, and monitor inventory statistics through a dashboard.

Regular employees can securely log in and view the assets assigned to them and their assignment history.

This project is designed as an **IBM client-based internal asset management application**.

---

## 🎯 Objectives

The main objectives of this system are:

- Secure user authentication and authorization
- Role-based access control for Admin and User accounts
- Employee management
- Asset and inventory management
- Asset assignment and return tracking
- Real-time inventory quantity updates
- Dashboard with inventory statistics
- REST API-based backend
- MySQL database integration
- Responsive and user-friendly interface

---

## ✨ Key Features

### 🔐 Authentication

- User registration
- User login
- Password authentication using bcrypt
- JWT-based authentication
- Secure logout
- Token-based protected API access

### 👤 Role-Based Access Control

The system supports two roles:

#### Admin

Administrators can:

- View employees
- Add employees
- Update employees
- Delete employees
- View assets
- Add assets
- Update assets
- Delete assets
- Assign assets to employees
- Return assigned assets
- View all asset assignments
- View organization-wide dashboard statistics

#### Employee / Regular User

Regular users can:
- Register an account
- Login to the system
- View available assets
- View employee information
- View their own assigned asset history
- View currently assigned assets
- View returned assets

Regular users cannot directly assign or return assets. These operations are managed by administrators.
---

## 💻 Technology Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt

### Database

- MySQL

### Development Tools

- Visual Studio Code
- MySQL Workbench
- Postman
- Git
- GitHub

---

## 🔄 System Workflow

The application follows the following workflow:

```text
User Registration
       ↓
User Login
       ↓
JWT Authentication
       ↓
Role Verification
       ↓
Admin / Employee Dashboard
       ↓
Employee & Asset Management
       ↓
Asset Assignment
       ↓
Available Quantity Decreases
       ↓
Employee Uses Assigned Asset
       ↓
Asset Returned
       ↓
Available Quantity Increases
       ↓
Assignment History Updated
```

## Project Structure

Inventory-Asset-Management-System/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── assetController.js
│   │   ├── authController.js
│   │   └── employeeController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── assetRoutes.js
│   │   ├── authRoutes.js
│   │   └── employeeRoutes.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Assets.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── inventory_management.sql
│
├── documentation/
│   └── API_DOCUMENTATION.md
│
├── postman/
│
├── screenshots/
│
├── .gitignore
└── README.md

---

## 🔐 Environment Variables

The backend uses environment variables to securely store sensitive configuration details such as database credentials and the JWT secret.

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_management
JWT_SECRET=your_secret_key
```
---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Inventory-Asset-Management-System.git
cd Inventory-Asset-Management-System