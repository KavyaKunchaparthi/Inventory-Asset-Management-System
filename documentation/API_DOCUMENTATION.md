# Inventory & Asset Management System — API Documentation

## 1. Overview

This document describes the REST APIs implemented for the **Inventory & Asset Management System**.

The system supports:

- User registration and login
- JWT-based authentication
- Role-based access control
- Employee management
- Asset inventory management
- Asset assignment and return tracking
- Dashboard inventory statistics

---

## 2. Base URL

For local development:

```text
http://localhost:5000/api
```

All protected endpoints require a JWT token obtained from the Login API.

Send the token in the request header:

```text
Authorization: Bearer <token>
```

### Role Legend

- 🟢 **User/Admin** — Any authenticated user
- 🔒 **Admin Only** — Only authenticated users with the `admin` role

---

# 3. Authentication APIs

## 3.1 Register User

### Endpoint

```http
POST /auth/register
```

### Access

Public — No token required.

### Description

Creates a new user account. New accounts are registered with the `user` role.

### Request Body

```json
{
  "name": "Priya",
  "email": "priya@gmail.com",
  "password": "SecurePass123"
}
```

### Actual Success Response

```json
{
  "message": "User Registered Successfully"
}
```

### Notes

The user role is assigned by the backend. The client cannot select the role during registration.

---

## 3.2 Login

### Endpoint

```http
POST /auth/login
```

### Access

Public — No token required.

### Description

Authenticates a registered user and returns a JWT token and the user's role.

### Request Body

```json
{
  "email": "priya@gmail.com",
  "password": "SecurePass123"
}
```

### Actual Success Response

```json
{
  "message": "Login Successful",
  "token": "<JWT_TOKEN>",
  "role": "user"
}
```

### Notes

The returned JWT token must be used to access protected APIs.

For an admin account, the response role will be:

```json
"role": "admin"
```

---

# 4. Employee APIs

## 4.1 Get All Employees

### Endpoint

```http
GET /employees
```

### Access

🟢 Authenticated users

### Description

Returns all employee records stored in the system.

### Actual Response Structure

```json
[
  {
    "id": 2,
    "employee_id": "EMP001",
    "name": "Rahul Sharma",
    "department": "HR",
    "designation": "Senior Software Engineer",
    "email": "rahul@company.com",
    "phone": "9876543211",
    "status": "Active",
    "created_at": "2026-07-13T14:25:10.000Z"
  }
]
```

---

## 4.2 Add Employee

### Endpoint

```http
POST /employees/add
```

### Access

🔒 Admin Only

### Description

Adds a new employee record to the system.

### Request Body

```json
{
  "employee_id": "EMP005",
  "name": "Test Employee",
  "department": "IT",
  "designation": "Software Engineer",
  "email": "testemployee@company.com",
  "phone": "9876543215",
  "status": "Active"
}
```

### Actual Success Response

```json
{
  "message": "Employee Added Successfully"
}
```

---

## 4.3 Update Employee

### Endpoint

```http
PUT /employees/:id
```

### Access

🔒 Admin Only

### Description

Updates an existing employee using the employee's numeric database ID.

### Example

```http
PUT /employees/13
```

### Request Body

```json
{
  "employee_id": "EMP005",
  "name": "Test Employee",
  "department": "IT",
  "designation": "Senior Software Engineer",
  "email": "testemployee@company.com",
  "phone": "9876543215",
  "status": "Active"
}
```

### Actual Success Response

```json
{
  "message": "Employee Updated Successfully"
}
```

### If Employee Does Not Exist

```json
{
  "message": "Employee Not Found"
}
```

---

## 4.4 Delete Employee

### Endpoint

```http
DELETE /employees/:id
```

### Access

🔒 Admin Only

### Description

Deletes an employee record using the employee's numeric database ID.

### Example

```http
DELETE /employees/13
```

### Actual Success Response

```json
{
  "message": "Employee Deleted Successfully"
}
```

---

# 5. Asset APIs

## 5.1 Get All Assets

### Endpoint

```http
GET /assets
```

### Access

🟢 Authenticated users

### Description

Returns all assets available in the organization's inventory.

### Actual Response Structure

```json
[
  {
    "id": 4,
    "asset_name": "Dell Latitude Laptop",
    "asset_type": "laptop",
    "serial_number": "DELL-LAT-001",
    "purchase_date": "2026-07-19T18:30:00.000Z",
    "quantity": 10,
    "available_quantity": 8,
    "status": "Available",
    "created_at": "2026-07-20T15:30:56.000Z"
  }
]
```

### Quantity Behavior

- `quantity` = Total number of units owned by the organization.
- `available_quantity` = Number of units currently available for assignment.
- When an asset is assigned, `available_quantity` decreases by `1`.
- When an asset is returned, `available_quantity` increases by `1`.

---

## 5.2 Get Dashboard Statistics

### Endpoint

```http
GET /assets/dashboard
```

### Access

🔒 Admin Only

### Description

Returns organization-wide inventory statistics used by the Admin Dashboard.

### Actual Response

```json
{
  "totalEmployees": 4,
  "totalAssets": 5,
  "availableAssets": "53",
  "assignedAssets": 3
}
```

### Field Description

| Field | Description |
|---|---|
| `totalEmployees` | Total number of employee records |
| `totalAssets` | Total number of asset types/records |
| `availableAssets` | Total available asset units |
| `assignedAssets` | Total currently assigned asset units |

---

## 5.3 Add Asset

### Endpoint

```http
POST /assets/add
```

### Access

🔒 Admin Only

### Description

Adds a new asset record to the organization's inventory.

### Request Body

```json
{
  "asset_name": "Lenovo ThinkPad",
  "asset_type": "Laptop",
  "serial_number": "LEN-TEST-001",
  "purchase_date": "2026-07-21",
  "quantity": 5,
  "available_quantity": 5,
  "status": "Available"
}
```

### Actual Success Response

```json
{
  "message": "Asset Added Successfully"
}
```

---

## 5.4 Update Asset

### Endpoint

```http
PUT /assets/:id
```

### Access

🔒 Admin Only

### Description

Updates an existing asset using its numeric database ID.

### Example

```http
PUT /assets/16
```

### Request Body

```json
{
  "asset_name": "Lenovo ThinkPad",
  "asset_type": "Laptop",
  "serial_number": "LEN-TEST-001",
  "purchase_date": "2026-07-21",
  "quantity": 5,
  "available_quantity": 5,
  "status": "Available"
}
```

### Actual Success Response

```json
{
  "message": "Asset Updated Successfully"
}
```

---

## 5.5 Delete Asset

### Endpoint

```http
DELETE /assets/:id
```

### Access

🔒 Admin Only

### Description

Deletes an asset record from inventory.

The system prevents deletion when the asset is currently assigned.

### Example

```http
DELETE /assets/16
```

### Actual Success Response

```json
{
  "message": "Asset Deleted Successfully"
}
```

### Business Rule

An asset that is currently assigned should not be deleted until it has been returned.

---

# 6. Asset Assignment APIs

## 6.1 Get Assignments

### Endpoint

```http
GET /assets/assignments
```

### Access

🟢 Authenticated users

### Description

Returns asset assignment records.

### Admin Behavior

Admins can view all assignment records across the organization.

### User Behavior

Regular users can view assignment records associated with their own employee account.

The filtering is performed using the authenticated user's identity and employee email.

### Actual Response Structure

```json
[
  {
    "id": 18,
    "employee_id": "EMP002",
    "name": "priya",
    "employee_email": "priya@gmail.com",
    "asset_name": "Dell Latitude Laptop",
    "serial_number": "DELL-LAT-001",
    "assigned_date": "2026-07-21T18:30:00.000Z",
    "return_date": null,
    "status": "Assigned"
  }
]
```

---

## 6.2 Assign Asset

### Endpoint

```http
POST /assets/assign
```

### Access

🔒 Admin Only

### Description

Assigns one available asset unit to an employee.

### Request Body

```json
{
  "employee_id": 4,
  "asset_id": 4,
  "assigned_date": "2026-07-21"
}
```

### Actual Success Response

```json
{
  "message": "Asset Assigned Successfully"
}
```

### Business Logic

When an asset is assigned:

1. A new assignment record is created.
2. Assignment status is set to `Assigned`.
3. `available_quantity` of the asset decreases by `1`.

### Example

Before assignment:

```text
Total Quantity: 10
Available Quantity: 9
```

After assignment:

```text
Total Quantity: 10
Available Quantity: 8
```

---

## 6.3 Return Asset

### Endpoint

```http
PUT /assets/return/:id
```

### Access

🔒 Admin Only

### Description

Marks an asset assignment as returned.

### Important

The `:id` parameter is the **assignment ID**, not the asset ID.

### Example

If the assignment ID is `18`:

```http
PUT /assets/return/18
```

### Actual Success Response

```json
{
  "message": "Asset Returned Successfully"
}
```

### Business Logic

When an asset is returned:

1. The assignment status changes from `Assigned` to `Returned`.
2. The return date is recorded.
3. The asset's `available_quantity` increases by `1`.

### Example

Before return:

```text
Asset Quantity: 10
Available Quantity: 8
Assignment Status: Assigned
```

After return:

```text
Asset Quantity: 10
Available Quantity: 9
Assignment Status: Returned
```

---

# 7. Authentication and Authorization

The system uses **JWT (JSON Web Tokens)** for authentication.

### Authentication Flow

```text
User Registration
       ↓
User Login
       ↓
Backend verifies credentials
       ↓
JWT Token Generated
       ↓
Token stored by Frontend
       ↓
Token sent with protected API requests
       ↓
JWT Middleware verifies token
       ↓
Role checked where required
       ↓
Request allowed or rejected
```

### Authentication Middleware

Protected requests require:

```text
Authorization: Bearer <JWT_TOKEN>
```

If no token is provided:

```json
{
  "message": "Access Denied. No Token Provided."
}
```

If the token is invalid or expired:

```json
{
  "message": "Invalid or Expired Token"
}
```

### Admin Authorization

Admin-only operations are protected by role-based authorization.

If a regular user attempts an admin-only operation:

```json
{
  "message": "Access Denied. Admins only."
}
```

---

# 8. API Endpoint Summary

The system currently exposes **14 API endpoints**.

| # | Method | Endpoint | Access | Purpose |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | Public | Register user |
| 2 | POST | `/auth/login` | Public | Login and receive JWT |
| 3 | GET | `/employees` | User/Admin | View employees |
| 4 | POST | `/employees/add` | Admin | Add employee |
| 5 | PUT | `/employees/:id` | Admin | Update employee |
| 6 | DELETE | `/employees/:id` | Admin | Delete employee |
| 7 | GET | `/assets` | User/Admin | View inventory |
| 8 | GET | `/assets/dashboard` | Admin | View dashboard statistics |
| 9 | POST | `/assets/add` | Admin | Add asset |
| 10 | PUT | `/assets/:id` | Admin | Update asset |
| 11 | DELETE | `/assets/:id` | Admin | Delete asset |
| 12 | GET | `/assets/assignments` | User/Admin | View assignment records |
| 13 | POST | `/assets/assign` | Admin | Assign asset |
| 14 | PUT | `/assets/return/:id` | Admin | Return asset |

---

# 9. System Workflow

The overall inventory management workflow is:

```text
Admin Login
    ↓
Add Employees
    ↓
Add Assets to Inventory
    ↓
Employee Accounts Register/Login
    ↓
Admin Assigns Assets to Employees
    ↓
Available Quantity Decreases
    ↓
Employee Views Assigned Assets
    ↓
Employee Requests/Returns Asset
    ↓
Admin Records Return
    ↓
Assignment Status = Returned
    ↓
Available Quantity Increases
```

This API layer provides the backend functionality required for the Inventory & Asset Management System frontend and database.
