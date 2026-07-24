-- ============================================
-- INVENTORY & ASSET MANAGEMENT SYSTEM
-- DATABASE SCHEMA
-- ============================================

CREATE DATABASE IF NOT EXISTS inventory_management;

USE inventory_management;


-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- EMPLOYEES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- ASSETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(150) NOT NULL,
    asset_type VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    purchase_date DATE NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    available_quantity INT NOT NULL DEFAULT 1,
    status ENUM('Available', 'Assigned', 'Maintenance') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- ASSET ASSIGNMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS asset_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    employee_id INT NOT NULL,
    asset_id INT NOT NULL,

    assigned_date DATE NOT NULL,
    return_date DATE DEFAULT NULL,

    status ENUM('Assigned', 'Returned') NOT NULL DEFAULT 'Assigned',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assignment_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_assignment_asset
        FOREIGN KEY (asset_id)
        REFERENCES assets(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


-- ============================================
-- INDEXES
-- ============================================



CREATE INDEX idx_asset_name
ON assets(asset_name);

CREATE INDEX idx_assignment_employee
ON asset_assignments(employee_id);

CREATE INDEX idx_assignment_asset
ON asset_assignments(asset_id);


-- ============================================
-- SAMPLE ADMIN USER
-- ============================================
-- DO NOT INSERT A PLAIN-TEXT PASSWORD HERE.
-- Admin user should be created through the
-- secure registration/admin creation process.