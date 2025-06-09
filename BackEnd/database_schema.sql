-- School Medical Management System Database Schema
-- SQL Server Script

-- Create Database
CREATE DATABASE SchoolMedicalDB;
GO

USE SchoolMedicalDB;
GO

-- Create Users Table
CREATE TABLE Users (
    userId INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    phone NVARCHAR(20),
    userType NVARCHAR(20) NOT NULL CHECK (userType IN ('student', 'parent', 'teacher', 'medical', 'admin')),
    createdDate DATETIME2 DEFAULT GETDATE(),
    isActive BIT DEFAULT 1
);

-- Create Health Declarations Table
CREATE TABLE HealthDeclarations (
    declarationId INT IDENTITY(1,1) PRIMARY KEY,
    studentId INT NOT NULL,
    studentName NVARCHAR(200) NOT NULL,
    studentClass NVARCHAR(50) NOT NULL,
    disease NVARCHAR(500),
    allergy NVARCHAR(500),
    medication NVARCHAR(500),
    emergencyContact NVARCHAR(200),
    emergencyPhone NVARCHAR(20),
    additionalInfo NVARCHAR(1000),
    declarationDate DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create Vaccinations Table
CREATE TABLE Vaccinations (
    vaccinationId INT IDENTITY(1,1) PRIMARY KEY,
    studentId INT NOT NULL,
    studentName NVARCHAR(200) NOT NULL,
    studentClass NVARCHAR(50) NOT NULL,
    vaccineName NVARCHAR(200) NOT NULL,
    vaccinationDate DATETIME2 NOT NULL,
    location NVARCHAR(200),
    batchNumber NVARCHAR(100),
    notes NVARCHAR(1000),
    status NVARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed'))
);

-- Create Medicine Records Table
CREATE TABLE MedicineRecords (
    recordId INT IDENTITY(1,1) PRIMARY KEY,
    studentId INT NOT NULL,
    studentName NVARCHAR(200) NOT NULL,
    studentClass NVARCHAR(50) NOT NULL,
    medicineName NVARCHAR(200) NOT NULL,
    dosage NVARCHAR(100) NOT NULL,
    frequency NVARCHAR(100) NOT NULL,
    startDate DATETIME2 NOT NULL,
    endDate DATETIME2,
    prescribedBy NVARCHAR(200),
    notes NVARCHAR(1000),
    status NVARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued'))
);

-- Create Indexes for better performance
CREATE INDEX IX_Users_Username ON Users(username);
CREATE INDEX IX_Users_Email ON Users(email);
CREATE INDEX IX_Users_UserType ON Users(userType);

CREATE INDEX IX_HealthDeclarations_StudentId ON HealthDeclarations(studentId);
CREATE INDEX IX_HealthDeclarations_Status ON HealthDeclarations(status);
CREATE INDEX IX_HealthDeclarations_Date ON HealthDeclarations(declarationDate);

CREATE INDEX IX_Vaccinations_StudentId ON Vaccinations(studentId);
CREATE INDEX IX_Vaccinations_VaccineName ON Vaccinations(vaccineName);
CREATE INDEX IX_Vaccinations_Status ON Vaccinations(status);
CREATE INDEX IX_Vaccinations_Date ON Vaccinations(vaccinationDate);

CREATE INDEX IX_MedicineRecords_StudentId ON MedicineRecords(studentId);
CREATE INDEX IX_MedicineRecords_Status ON MedicineRecords(status);
CREATE INDEX IX_MedicineRecords_StartDate ON MedicineRecords(startDate);

-- Insert sample data for testing

-- Sample Users
INSERT INTO Users (username, password, firstName, lastName, email, phone, userType) VALUES
('admin', '123456', 'Admin', 'System', 'admin@school.edu.vn', '0123456789', 'admin'),
('doctor01', '123456', 'Nguyen', 'Van Duc', 'doctor@school.edu.vn', '0123456790', 'medical'),
('teacher01', '123456', 'Tran', 'Thi Mai', 'teacher@school.edu.vn', '0123456791', 'teacher'),
('parent01', '123456', 'Le', 'Van Nam', 'parent@gmail.com', '0123456792', 'parent'),
('student01', '123456', 'Nguyen', 'Van An', 'student@school.edu.vn', '0123456793', 'student');

-- Sample Health Declarations
INSERT INTO HealthDeclarations (studentId, studentName, studentClass, disease, allergy, medication, emergencyContact, emergencyPhone, additionalInfo) VALUES
(1, 'Nguyen Van A', '3A', '', 'Khong co', '', 'Le Thi B (Me)', '0987654321', 'Khong co thong tin bo sung'),
(2, 'Tran Thi B', '4B', 'Hen suyen nhe', 'Bui', 'Ventolin khi can', 'Tran Van C (Bo)', '0987654322', 'Can theo doi khi co trieu chung ho');

-- Sample Vaccinations
INSERT INTO Vaccinations (studentId, studentName, studentClass, vaccineName, vaccinationDate, location, batchNumber, notes) VALUES
(1, 'Nguyen Van A', '3A', 'Vac-xin cum', '2025-01-15', 'Phong y te truong', 'FLU2025001', 'Tiem thanh cong, khong co phan ung'),
(2, 'Tran Thi B', '4B', 'Vac-xin COVID-19', '2025-02-10', 'Trung tam y te', 'COV2025001', 'Mui tiem thu 2');

-- Sample Medicine Records
INSERT INTO MedicineRecords (studentId, studentName, studentClass, medicineName, dosage, frequency, startDate, endDate, prescribedBy, notes) VALUES
(2, 'Tran Thi B', '4B', 'Ventolin', '2 puff', 'Khi co trieu chung', '2025-01-01', '2025-12-31', 'BS. Nguyen Van Duc', 'Su dung khi kho tho, ho'),
(1, 'Nguyen Van A', '3A', 'Vitamin C', '1 vien', 'Moi ngay', '2025-01-01', '2025-03-01', 'BS. Nguyen Van Duc', 'Tang cuong suc de khang');

GO

-- Create views for reporting
CREATE VIEW vw_StudentHealthSummary AS
SELECT 
    u.userId,
    u.firstName + ' ' + u.lastName AS fullName,
    u.email,
    u.phone,
    COUNT(hd.declarationId) AS totalDeclarations,
    COUNT(v.vaccinationId) AS totalVaccinations,
    COUNT(mr.recordId) AS totalMedicineRecords
FROM Users u
LEFT JOIN HealthDeclarations hd ON u.userId = hd.studentId
LEFT JOIN Vaccinations v ON u.userId = v.studentId
LEFT JOIN MedicineRecords mr ON u.userId = mr.studentId
WHERE u.userType = 'student'
GROUP BY u.userId, u.firstName, u.lastName, u.email, u.phone;

GO

CREATE VIEW vw_PendingHealthDeclarations AS
SELECT 
    hd.*,
    u.email AS studentEmail,
    u.phone AS studentPhone
FROM HealthDeclarations hd
LEFT JOIN Users u ON hd.studentId = u.userId
WHERE hd.status = 'pending';

GO

CREATE VIEW vw_UpcomingVaccinations AS
SELECT 
    v.*,
    u.email AS studentEmail,
    u.phone AS studentPhone
FROM Vaccinations v
LEFT JOIN Users u ON v.studentId = u.userId
WHERE v.status = 'scheduled' AND v.vaccinationDate >= GETDATE();

GO

PRINT 'Database schema created successfully!';
PRINT 'Sample data inserted successfully!';
PRINT 'Views created successfully!';
