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
GO