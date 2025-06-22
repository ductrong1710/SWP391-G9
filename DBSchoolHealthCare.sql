-- Tạo database nếu chưa có
CREATE DATABASE SchoolHealthcareDB;
GO

-- Sử dụng database
USE SchoolHealthcareDB;
GO

-- Tạo bảng Role
CREATE TABLE Role (
    RoleID INT PRIMARY KEY,
    RoleType NVARCHAR(50)
);

-- Thêm các loại vai trò cần thiết
INSERT INTO Role (RoleID, RoleType) VALUES
(1, N'Admin'),
(2, N'MedicalStaff'),
(3, N'Parent'),
(4, N'Student');

-- Tạo bảng User
CREATE TABLE [User] (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    Password NVARCHAR(100) NOT NULL,
    RoleID INT NOT NULL,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

-- 1 Admin
INSERT INTO [User] (Username, Password, RoleID) VALUES
(N'admin01', N'adminpass', 1);

-- 3 MedicalStaff
INSERT INTO [User] (Username, Password, RoleID) VALUES
(N'medstaff01', N'medpass1', 2),
(N'medstaff02', N'medpass2', 2),
(N'medstaff03', N'medpass3', 2);

-- 2 Parents
INSERT INTO [User] (Username, Password, RoleID) VALUES
(N'parent01', N'parentpass1', 3),
(N'parent02', N'parentpass2', 3);

-- 2 Students
INSERT INTO [User] (Username, Password, RoleID) VALUES
(N'student01', N'studentpass1', 4),
(N'student02', N'studentpass2', 4);

-- Tạo bảng Profile
CREATE TABLE Profile (
    ProfileID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Date_Of_Birth DATE,
    Sex NVARCHAR(10),
    Class NVARCHAR(50),
    Phone DECIMAL(15,0),
    UserID INT NOT NULL,
    Note NVARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Giả sử UserID 1 là admin, 2-4 là medical staff, 5-6 là parent, 7-8 là student

INSERT INTO Profile (Name, Date_Of_Birth, Sex, Class, Phone, UserID, Note) VALUES
(N'Nguyễn Văn A', '1990-01-01', N'Nam', NULL, 0987654321, 1, N'Admin chính'),
(N'Trần Thị B', '1985-05-15', N'Nữ', NULL, 0911222333, 2, N'Y tá trưởng'),
(N'Lê Văn C', '1980-03-22', N'Nam', NULL, 0933444555, 3, N'Bác sĩ nội khoa'),
(N'Phạm Thị D', '1987-07-30', N'Nữ', NULL, 0944555666, 4, N'Y tá hỗ trợ'),

(N'Ngô Văn E', '1975-08-10', N'Nam', NULL, 0966777888, 5, N'Phụ huynh học sinh 1'),
(N'Đỗ Thị F', '1978-12-05', N'Nữ', NULL, 0977888999, 6, N'Phụ huynh học sinh 2'),

(N'Học Sinh G', '2010-09-01', N'Nữ', N'6A', 0909123456, 7, N'Học sinh lớp 6'),
(N'Học Sinh H', '2011-03-10', N'Nam', N'6B', 0909988776, 8, N'Học sinh lớp 6');

CREATE TABLE Health_Record (
    HealthRecordID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    ParentID INT NOT NULL,
    Allergies NVARCHAR(255),
    Chronic_Diseases NVARCHAR(255),
    Treatment_History NVARCHAR(255),
    Eyesight INT,
    Hearing INT,
    Vaccination_History NVARCHAR(255),
    Note NVARCHAR(255),
    ParentContact NVARCHAR(100),

    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);

INSERT INTO Health_Record (
    StudentID,
    ParentID,
    Allergies,
    Chronic_Diseases,
    Treatment_History,
    Eyesight,
    Hearing,
    Vaccination_History,
    Note,
    ParentContact
)
VALUES
-- Học sinh 1
(7, 5, 
 N'Phấn hoa', 
 N'Suyễn', 
 N'Điều trị suyễn năm 2022', 
 10, 
 10, 
 N'Đã tiêm phòng đầy đủ', 
 N'Không có ghi chú thêm', 
 N'0909123456'),

-- Học sinh 2
(8, 6, 
 N'Không', 
 N'Không', 
 N'Từng bị thủy đậu năm 2021', 
 9, 
 10, 
 N'Thiếu mũi viêm gan B', 
 N'Cần tiêm bổ sung', 
 N'0909988776');

 CREATE TABLE Medication_Submission_Form (
    ID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    ParentID INT NOT NULL,
    Medication_Name NVARCHAR(255),
    Dosage NVARCHAR(100),
    Instructions NVARCHAR(255),
    Consumption_Time NVARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    Status NVARCHAR(50),
    Parents_Note NVARCHAR(255),

    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);
-- Đơn thuốc số 1: Phụ huynh 1 gửi thuốc cho học sinh 1
INSERT INTO Medication_Submission_Form (
    StudentID,
    ParentID,
    Medication_Name,
    Dosage,
    Instructions,
    Consumption_Time,
    StartDate,
    EndDate,
    Status,
    Parents_Note
)
VALUES (
    7, -- student01
    5, -- parent01
    N'Paracetamol',
    N'500mg, ngày 3 lần',
    N'Uống sau khi ăn',
    N'Sáng, Trưa, Tối',
    '2025-06-18',
    '2025-06-20',
    N'Chờ duyệt',
    N'Bé bị sốt nhẹ, xin nhà trường hỗ trợ cho uống thuốc'
);

-- Đơn thuốc số 2: Phụ huynh 2 gửi thuốc cho học sinh 2
INSERT INTO Medication_Submission_Form (
    StudentID,
    ParentID,
    Medication_Name,
    Dosage,
    Instructions,
    Consumption_Time,
    StartDate,
    EndDate,
    Status,
    Parents_Note
)
VALUES (
    8, -- student02
    6, -- parent02
    N'Zyrtec',
    N'10ml/ngày',
    N'Uống vào buổi sáng sau ăn',
    N'Sáng',
    '2025-06-18',
    '2025-06-25',
    N'Đã duyệt',
    N'Bé có dấu hiệu dị ứng thời tiết, cần dùng đều mỗi ngày'
);

CREATE TABLE Medication_Receipt (
    ReceiptID INT PRIMARY KEY IDENTITY(1,1),
    ParentID INT NOT NULL,
    MedicalStaffID INT NOT NULL,
    ReceiptDate DATE,
    MedicationNo INT,
    MedicationName NVARCHAR(255),
    Quantity INT,
    Dosage NVARCHAR(100),
    Instruction NVARCHAR(255),
    Notes NVARCHAR(255),
    Status BIT, -- dùng kiểu BIT thay cho Booleen

    FOREIGN KEY (ParentID) REFERENCES [User](UserID),
    FOREIGN KEY (MedicalStaffID) REFERENCES [User](UserID)
);

INSERT INTO Medication_Receipt (
    ParentID,
    MedicalStaffID,
    ReceiptDate,
    MedicationNo,
    MedicationName,
    Quantity,
    Dosage,
    Instruction,
    Notes,
    Status
)
VALUES (
    5,             -- ParentID
    3,             -- MedicalStaffID
    '2025-06-18',  -- ReceiptDate
    1,             -- MedicationNo
    N'Paracetamol',
    10,
    N'500mg, ngày 3 lần',
    N'Uống sau ăn',
    N'Dùng khi bé sốt',
    0              -- Status: false (chưa xác nhận)
);

INSERT INTO Medication_Receipt (
    ParentID,
    MedicalStaffID,
    ReceiptDate,
    MedicationNo,
    MedicationName,
    Quantity,
    Dosage,
    Instruction,
    Notes,
    Status
)
VALUES (
    6,
    4,
    '2025-06-17',
    2,
    N'Zyrtec',
    5,
    N'10ml/ngày',
    N'Uống vào sáng',
    N'Thuốc dị ứng cho bé',
    1              -- Status: true (đã xác nhận)
);
CREATE TABLE Medical_Incident (
    IncidentID INT PRIMARY KEY IDENTITY(1,1),
    RecordTime DATE,
    IncidentType NVARCHAR(100),
    IncidentDescription NVARCHAR(255),
    IncidentMeasures NVARCHAR(255),
    HandlingResults NVARCHAR(255),
    Note NVARCHAR(255),
    MedicalStaffID INT NOT NULL,

    FOREIGN KEY (MedicalStaffID) REFERENCES [User](UserID)
);
INSERT INTO Medical_Incident (
    RecordTime,
    IncidentType,
    IncidentDescription,
    IncidentMeasures,
    HandlingResults,
    Note,
    MedicalStaffID
)
VALUES (
    '2025-06-18',
    N'Tai nạn trong giờ chơi',
    N'Học sinh ngã khi chơi cầu trượt',
    N'Sát trùng vết thương, băng bó',
    N'Ổn định, không nghiêm trọng',
    N'Phụ huynh đã được thông báo',
    3
);
INSERT INTO Medical_Incident (
    RecordTime,
    IncidentType,
    IncidentDescription,
    IncidentMeasures,
    HandlingResults,
    Note,
    MedicalStaffID
)
VALUES (
    '2025-06-17',
    N'Dị ứng',
    N'Học sinh có biểu hiện nổi mẩn đỏ sau bữa ăn',
    N'Cho uống thuốc chống dị ứng',
    N'Hết triệu chứng sau 30 phút',
    N'Cần theo dõi thêm',
    4
);
CREATE TABLE Incident_Involvement (
    InvolvementID INT PRIMARY KEY IDENTITY(1,1),
    IncidentID INT NOT NULL,
    StudentID INT NOT NULL,
    InjuryDescription NVARCHAR(255),
    TreatmentGiven NVARCHAR(255),
    Notes NVARCHAR(255),

    FOREIGN KEY (IncidentID) REFERENCES Medical_Incident(IncidentID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID)
);
INSERT INTO Incident_Involvement (
    IncidentID,
    StudentID,
    InjuryDescription,
    TreatmentGiven,
    Notes
)
VALUES (
    1, -- ID của sự cố ngã khi chơi
    7, -- student01
    N'Trầy nhẹ ở đầu gối phải',
    N'Sát trùng và dán băng cá nhân',
    N'Tiếp tục theo dõi 1 ngày'
);
INSERT INTO Incident_Involvement (
    IncidentID,
    StudentID,
    InjuryDescription,
    TreatmentGiven,
    Notes
)
VALUES (
    2,
    8,
    N'Nổi mẩn đỏ ở tay và cổ',
    N'Uống thuốc dị ứng và nghỉ ngơi tại phòng y tế',
    N'Phụ huynh được liên hệ ngay sau đó'
);
CREATE TABLE Medication (
    MedicationID INT PRIMARY KEY IDENTITY(1,1),
    MedicationName NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50),
    CurrentStock INT,
    ExpiryDate DATE,
    Notes NVARCHAR(255)
);
INSERT INTO Medication (MedicationName, Unit, CurrentStock, ExpiryDate, Notes)
VALUES 
(N'Paracetamol', N'viên', 500, '2025-12-31', N'Thuốc hạ sốt, giảm đau cơ bản'),
(N'Gạc y tế', N'bịch', 200, '2026-01-01', N'Dùng sơ cứu vết thương'),
(N'Thuốc nhỏ mắt Natri Clorid 0.9%', N'chai', 150, '2025-09-30', N'Dùng sát trùng mắt'),
(N'Cồn 70 độ', N'chai', 100, '2027-01-01', N'Sát trùng vết thương ngoài da');
-- Tạo bảng Medical_Supply
CREATE TABLE Medical_Supply (
    SupplyID INT PRIMARY KEY,
    SupplyName NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50),
    CurrentStock INT,
    ExpiryDate DATE,
    Notes NVARCHAR(255)
);

-- Thêm dữ liệu mẫu vào bảng Medical_Supply
INSERT INTO Medical_Supply (SupplyID, SupplyName, Unit, CurrentStock, ExpiryDate, Notes) VALUES
(1, N'Băng gạc vô trùng', N'hộp', 150, '2026-06-30', N'Dùng để băng bó vết thương'),
(2, N'Băng keo y tế', N'cuộn', 200, '2025-12-31', N'Thích hợp cho các vết thương nhỏ'),
(3, N'Thuốc sát trùng Betadine', N'chai', 50, '2026-03-15', N'Sát trùng vết cắt và trầy xước'),
(4, N'Găng tay y tế', N'đôi', 300, '2025-10-01', N'Dùng trong các thủ thuật y tế');

-- Tạo bảng Supply_Med_Usage
CREATE TABLE Supply_Med_Usage (
    UsageID INT PRIMARY KEY,
    IncidentID INT,
    SupplyID INT,
    MedicationID INT,
    QuantityUsed INT,
    UsageTime DATE,
    FOREIGN KEY (IncidentID) REFERENCES Medical_Incident(IncidentID),
    FOREIGN KEY (SupplyID) REFERENCES Medical_Supply(SupplyID),
    FOREIGN KEY (MedicationID) REFERENCES Medication(MedicationID)
);

-- Thêm dữ liệu mẫu vào bảng Supply_Med_Usage
INSERT INTO Supply_Med_Usage (UsageID, IncidentID, SupplyID, MedicationID, QuantityUsed, UsageTime) VALUES
(1, 1, 1, 1, 2, '2025-06-18'), -- Sử dụng băng gạc và Paracetamol cho sự cố ngã
(2, 2, 3, 2, 1, '2025-06-17'); -- Sử dụng Betadine và Gạc y tế cho sự cố dị ứng

-- Tạo bảng Periodic_Health_Check_Plan
CREATE TABLE Periodic_Health_Check_Plan (
    ID INT PRIMARY KEY,
    PlanName NVARCHAR(100) NOT NULL,
    ScheduleDate DATE,
    CheckupContent NVARCHAR(255),
    Status NVARCHAR(50),
    CreatorID INT NOT NULL,
    FOREIGN KEY (CreatorID) REFERENCES [User](UserID)
);

-- Thêm dữ liệu mẫu vào bảng Periodic_Health_Check_Plan
INSERT INTO Periodic_Health_Check_Plan (ID, PlanName, ScheduleDate, CheckupContent, Status, CreatorID) VALUES
(1, N'Kiểm tra sức khỏe định kỳ tháng 6', '2025-06-20', N'Đo chiều cao, cân nặng, kiểm tra mắt', N'Đã phê duyệt', 2), -- medstaff01
(2, N'Kiểm tra sức khỏe định kỳ tháng 7', '2025-07-15', N'Khám tổng quát, tiêm phòng', N'Đang lên kế hoạch', 3); -- medstaff02

-- Tạo bảng Health_Check_Consent_Form
CREATE TABLE Health_Check_Consent_Form (
    ID INT PRIMARY KEY,
    HealthCheckPlanID INT,
    StudentID INT,
    ParentID INT,
    ConsentStatus NVARCHAR(50),
    ResponseTime DATE,
    ReasonForDenial NVARCHAR(255),
    FOREIGN KEY (HealthCheckPlanID) REFERENCES Periodic_Health_Check_Plan(ID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);

-- Thêm dữ liệu mẫu vào bảng Health_Check_Consent_Form
INSERT INTO Health_Check_Consent_Form (ID, HealthCheckPlanID, StudentID, ParentID, ConsentStatus, ResponseTime, ReasonForDenial) VALUES
(1, 1, 7, 5, N'Đồng ý', '2025-06-18', NULL), -- student01, parent01, plan tháng 6
(2, 2, 8, 6, N'Từ chối', '2025-06-18', N'Phụ huynh bận không đưa học sinh đi kiểm tra'); -- student02, parent02, plan tháng 7

-- Tạo bảng Health_Check_Result
CREATE TABLE Health_Check_Result (
    ID INT PRIMARY KEY,
    HealthCheckConsentID INT,
    Height INT,
    Weight INT,
    BloodPressure INT,
    HeartRate INT,
    Eyesight NVARCHAR(50),
    Hearing NVARCHAR(50),
    OralHealth NVARCHAR(50),
    Spine NVARCHAR(50),
    Conclusion NVARCHAR(255),
    CheckUpDate DATE,
    Checker NVARCHAR(100),
    ConsultationRecommended BIT,
    ConsultationAppointmentDate DATE,
    FOREIGN KEY (HealthCheckConsentID) REFERENCES Health_Check_Consent_Form(ID)
);

-- Thêm dữ liệu mẫu vào bảng Health_Check_Result
INSERT INTO Health_Check_Result (ID, HealthCheckConsentID, Height, Weight, BloodPressure, HeartRate, Eyesight, Hearing, OralHealth, Spine, Conclusion, CheckUpDate, Checker, ConsultationRecommended, ConsultationAppointmentDate) VALUES
(1, 1, 145, 40, 110, 80, N'Tốt', N'Bình thường', N'Khỏe mạnh', N'Bình thường', N'Sức khỏe tổng quát tốt', '2025-06-20', N'Trần Thị B', 0, NULL), -- Consent ID 1 (student01)
(2, 2, 150, 45, 115, 85, N'Trung bình', N'Bình thường', N'Cần theo dõi', N'Bình thường', N'Cần kiểm tra thêm về mắt và răng', '2025-07-15', N'Lê Văn C', 1, '2025-07-20'); -- Consent ID 2 (student02)

-- Tạo bảng Vaccine_Type
CREATE TABLE Vaccine_Type (
    VaccinationID INT PRIMARY KEY,
    VaccineName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);

-- Thêm dữ liệu mẫu vào bảng Vaccine_Type
INSERT INTO Vaccine_Type (VaccinationID, VaccineName, Description) VALUES
(1, N'Vắc-xin Viêm gan B', N'Bảo vệ chống lại virus viêm gan B'),
(2, N'Vắc-xin Sởi - Quai bị - Rubella', N'Ngăn ngừa các bệnh sởi, quai bị và rubella'),
(3, N'Vắc-xin DPT', N'Bảo vệ chống lại bạch hầu, ho gà và uốn ván');

-- Tạo bảng Vaccination_Plan
CREATE TABLE Vaccination_Plan (
    ID INT PRIMARY KEY,
    PlanName NVARCHAR(100) NOT NULL,
    ScheduledDate DATE,
    Description NVARCHAR(255),
    Status NVARCHAR(50),
    CreatorID INT NOT NULL,
    FOREIGN KEY (CreatorID) REFERENCES [User](UserID)
);

-- Thêm dữ liệu mẫu vào bảng Vaccination_Plan
INSERT INTO Vaccination_Plan (ID, PlanName, ScheduledDate, Description, Status, CreatorID) VALUES
(1, N'Chiến dịch tiêm vắc-xin Viêm gan B', '2025-06-25', N'Tiêm cho học sinh lớp 6', N'Đang lên kế hoạch', 2), -- medstaff01
(2, N'Chiến dịch tiêm vắc-xin Sởi - Quai bị - Rubella', '2025-07-10', N'Tiêm cho học sinh lớp 7', N'Đã phê duyệt', 3); -- medstaff02

-- Tạo bảng Vaccination_Consent_Form
CREATE TABLE Vaccination_Consent_Form (
    ID INT PRIMARY KEY,
    VaccinationPlanID INT,
    StudentID INT,
    ParentID INT,
    ConsentStatus NVARCHAR(50),
    ResponseTime DATE,
    ReasonForDenial NVARCHAR(255),
    FOREIGN KEY (VaccinationPlanID) REFERENCES Vaccination_Plan(ID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);

-- Thêm dữ liệu mẫu vào bảng Vaccination_Consent_Form
INSERT INTO Vaccination_Consent_Form (ID, VaccinationPlanID, StudentID, ParentID, ConsentStatus, ResponseTime, ReasonForDenial) VALUES
(1, 1, 7, 5, N'Đồng ý', '2025-06-18', NULL), -- student01, parent01, plan Viêm gan B
(2, 2, 8, 6, N'Từ chối', '2025-06-18', N'Phụ huynh lo ngại về phản ứng phụ'); -- student02, parent02, plan Sởi - Quai bị - Rubella

-- Tạo bảng Vaccination_Result
CREATE TABLE Vaccination_Result (
    ID INT PRIMARY KEY,
    ConsentFormID INT,
    VaccineTypeID INT,
    ActualVaccinationDate DATE,
    Performer NVARCHAR(100),
    PostVaccinationReaction NVARCHAR(255),
    Notes NVARCHAR(255),
    FOREIGN KEY (ConsentFormID) REFERENCES Vaccination_Consent_Form(ID),
    FOREIGN KEY (VaccineTypeID) REFERENCES Vaccine_Type(VaccinationID)
);

-- Thêm dữ liệu mẫu vào bảng Vaccination_Result
INSERT INTO Vaccination_Result (ID, ConsentFormID, VaccineTypeID, ActualVaccinationDate, Performer, PostVaccinationReaction, Notes) VALUES
(1, 1, 1, '2025-06-25', N'Trần Thị B', N'Không có phản ứng', N'Tiêm thành công, theo dõi 24h'), -- Consent ID 1, Vaccine Viêm gan B
(2, 2, 2, NULL, NULL, N'Sốt nhẹ', N'Phụ huynh từ chối, chưa tiêm'); -- Consent ID 2, Vaccine Sởi - Quai bị - Rubella

-- Tạo bảng Login_History
CREATE TABLE Login_History (
    LoginID INT PRIMARY KEY,
    UserID INT,
    LoginTime DATE,
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- Thêm dữ liệu mẫu vào bảng Login_History
INSERT INTO Login_History (LoginID, UserID, LoginTime) VALUES
(1, 1, '2025-06-18 11:00'), -- admin01
(2, 2, '2025-06-18 11:05'), -- medstaff01
(3, 5, '2025-06-18 11:10'); -- parent01