-- Create the database
CREATE DATABASE MeasureMateDB;
GO

-- Use the newly created database
USE MeasureMateDB;
GO

-- Create the Measurements table
CREATE TABLE Measurements (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TraceabilityCode VARCHAR(50) NOT NULL,
    InspectorName VARCHAR(100) NOT NULL,
    D1_1 FLOAT,
    D1_2 FLOAT,
    D1_3 FLOAT,
    D1_4 FLOAT,
    D1_avg FLOAT,
    D2_1 FLOAT,
    D2_2 FLOAT,
    D2_3 FLOAT,
    D2_4 FLOAT,
    D2_avg FLOAT,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create the Templates table
CREATE TABLE Templates (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create the Users table
CREATE TABLE Users (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Insert default admin user
INSERT INTO Users (Username, Password)
VALUES ('admin', '$2b$10$X7oAJvs/aaY5abXXXXXXXOzF6kRlUxQh6HbWa.j4BPUz9oztXXXXX');
GO

-- Insert sample templates
INSERT INTO Templates (Name) VALUES
('Template 1'),
('Template 2'),
('Template 3'),
('Template 4'),
('Template 5');
GO
