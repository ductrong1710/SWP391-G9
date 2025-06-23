-- Tạo database nếu chưa có
CREATE DATABASE SchoolHealthcareDB;
GO

-- Sử dụng database
USE SchoolHealthcareDB;
GO

-- Bảng Role
CREATE TABLE Role (
    RoleID CHAR(6) PRIMARY KEY,
    RoleType NVARCHAR(50)
);

INSERT INTO Role (RoleID, RoleType) VALUES
('000001', N'Admin'),
('000002', N'MedicalStaff'),
('000003', N'Parent'),
('000004', N'Student');

-- Bảng User
CREATE TABLE [User] (
    UserID CHAR(6) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Password NVARCHAR(100) NOT NULL,
    RoleID CHAR(6) NOT NULL,
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

INSERT INTO [User] (UserID, Username, Password, RoleID) VALUES
('U00001', N'admin01', N'adminpass', '000001'),
('U00002', N'medstaff01', N'medpass1', '000002'),
('U00003', N'medstaff02', N'medpass2', '000002'),
('U00004', N'medstaff03', N'medpass3', '000002'),
('U00005', N'parent01', N'parentpass1', '000003'),
('U00006', N'parent02', N'parentpass2', '000003'),
('U00007', N'student01', N'studentpass1', '000004'),
('U00008', N'student02', N'studentpass2', '000004');

-- Bảng Profile
CREATE TABLE Profile (
    ProfileID CHAR(6) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Date_Of_Birth DATE,
    Sex NVARCHAR(10),
    Class NVARCHAR(50),
    Phone DECIMAL(15,0),
    UserID CHAR(6) NOT NULL,
    Note NVARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

INSERT INTO Profile (ProfileID, Name, Date_Of_Birth, Sex, Class, Phone, UserID, Note) VALUES
('P00001', N'Nguyễn Văn A', '1990-01-01', N'Nam', NULL, 0987654321, 'U00001', N'Admin chính'),
('P00002', N'Trần Thị B', '1985-05-15', N'Nữ', NULL, 0911222333, 'U00002', N'Y tá trưởng'),
('P00003', N'Lê Văn C', '1980-03-22', N'Nam', NULL, 0933444555, 'U00003', N'Bác sĩ nội khoa'),
('P00004', N'Phạm Thị D', '1987-07-30', N'Nữ', NULL, 0944555666, 'U00004', N'Y tá hỗ trợ'),
('P00005', N'Ngô Văn E', '1975-08-10', N'Nam', NULL, 0966777888, 'U00005', N'Phụ huynh học sinh 1'),
('P00006', N'Đỗ Thị F', '1978-12-05', N'Nữ', NULL, 0977888999, 'U00006', N'Phụ huynh học sinh 2'),
('P00007', N'Học Sinh G', '2010-09-01', N'Nữ', N'6A', 0909123456, 'U00007', N'Học sinh lớp 6'),
('P00008', N'Học Sinh H', '2011-03-10', N'Nam', N'6B', 0909988776, 'U00008', N'Học sinh lớp 6');

CREATE TABLE Health_Record (
    HealthRecordID CHAR(6) PRIMARY KEY,
    StudentID CHAR(6) NOT NULL,
    ParentID CHAR(6) NOT NULL,
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

INSERT INTO Health_Record VALUES
('HR0001', 'U00007', 'U00005', N'Phấn hoa', N'Suyễn', N'Điều trị suyễn năm 2022', 10, 10, N'Đã tiêm phòng đầy đủ', N'Không có ghi chú thêm', N'0909123456'),
('HR0002', 'U00008', 'U00006', N'Không', N'Không', N'Từng bị thủy đậu năm 2021', 9, 10, N'Thiếu mũi viêm gan B', N'Cần tiêm bổ sung', N'0909988776');

CREATE TABLE Medication_Submission_Form (
    ID CHAR(6) PRIMARY KEY,
    StudentID CHAR(6) NOT NULL,
    ParentID CHAR(6) NOT NULL,
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

INSERT INTO Medication_Submission_Form VALUES
('MSF001', 'U00007', 'U00005', N'Paracetamol', N'500mg, ngày 3 lần', N'Uống sau khi ăn', N'Sáng, Trưa, Tối', '2025-06-18', '2025-06-20', N'Chờ duyệt', N'Bé bị sốt nhẹ, xin nhà trường hỗ trợ cho uống thuốc'),
('MSF002', 'U00008', 'U00006', N'Zyrtec', N'10ml/ngày', N'Uống vào buổi sáng sau ăn', N'Sáng', '2025-06-18', '2025-06-25', N'Đã duyệt', N'Bé có dấu hiệu dị ứng thời tiết, cần dùng đều mỗi ngày');

CREATE TABLE Medication_Receipt (
    ReceiptID CHAR(6) PRIMARY KEY,
    ParentID CHAR(6) NOT NULL,
    MedicalStaffID CHAR(6) NOT NULL,
    ReceiptDate DATE,
    MedicationNo INT,
    MedicationName NVARCHAR(255),
    Quantity INT,
    Dosage NVARCHAR(100),
    Instruction NVARCHAR(255),
    Notes NVARCHAR(255),
    Status BIT,
    FOREIGN KEY (ParentID) REFERENCES [User](UserID),
    FOREIGN KEY (MedicalStaffID) REFERENCES [User](UserID)
);

INSERT INTO Medication_Receipt VALUES
('MR0001', 'U00005', 'U00003', '2025-06-18', 1, N'Paracetamol', 10, N'500mg, ngày 3 lần', N'Uống sau ăn', N'Dùng khi bé sốt', 0),
('MR0002', 'U00006', 'U00004', '2025-06-17', 2, N'Zyrtec', 5, N'10ml/ngày', N'Uống vào sáng', N'Thuốc dị ứng cho bé', 1);

CREATE TABLE Medical_Incident (
    IncidentID CHAR(6) PRIMARY KEY,
    RecordTime DATE,
    IncidentType NVARCHAR(100),
    IncidentDescription NVARCHAR(255),
    IncidentMeasures NVARCHAR(255),
    HandlingResults NVARCHAR(255),
    Note NVARCHAR(255),
    MedicalStaffID CHAR(6),
    FOREIGN KEY (MedicalStaffID) REFERENCES [User](UserID)
);

CREATE TABLE Incident_Involvement (
    InvolvementID CHAR(6) PRIMARY KEY,
    IncidentID CHAR(6),
    StudentID CHAR(6),
    InjuryDescription NVARCHAR(255),
    TreatmentGiven NVARCHAR(255),
    Notes NVARCHAR(255),
    FOREIGN KEY (IncidentID) REFERENCES Medical_Incident(IncidentID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID)
);

INSERT INTO Medical_Incident VALUES
('INC001', '2025-06-18', N'Tai nạn trong giờ chơi', N'Học sinh ngã khi chơi cầu trượt', N'Sát trùng vết thương, băng bó', N'Ổn định, không nghiêm trọng', N'Phụ huynh đã được thông báo', 'U00003'),
('INC002', '2025-06-17', N'Dị ứng', N'Học sinh có biểu hiện nổi mẩn đỏ sau bữa ăn', N'Cho uống thuốc chống dị ứng', N'Hết triệu chứng sau 30 phút', N'Cần theo dõi thêm', 'U00004');

INSERT INTO Incident_Involvement VALUES
('INV001', 'INC001', 'U00007', N'Trầy nhẹ ở đầu gối phải', N'Sát trùng và dán băng cá nhân', N'Tiếp tục theo dõi 1 ngày'),
('INV002', 'INC002', 'U00008', N'Nổi mẩn đỏ ở tay và cổ', N'Uống thuốc dị ứng và nghỉ ngơi tại phòng y tế', N'Phụ huynh được liên hệ ngay sau đó');


-- Bảng Medication
CREATE TABLE Medication (
    MedicationID CHAR(6) PRIMARY KEY,
    MedicationName NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50),
    CurrentStock INT,
    ExpiryDate DATE,
    Notes NVARCHAR(255)
);

INSERT INTO Medication VALUES 
('MD0001', N'Paracetamol', N'viên', 500, '2025-12-31', N'Thuốc hạ sốt, giảm đau cơ bản'),
('MD0002', N'Gạc y tế', N'bịch', 200, '2026-01-01', N'Dùng sơ cứu vết thương'),
('MD0003', N'Thuốc nhỏ mắt Natri Clorid 0.9%', N'chai', 150, '2025-09-30', N'Dùng sát trùng mắt'),
('MD0004', N'Cồn 70 độ', N'chai', 100, '2027-01-01', N'Sát trùng vết thương ngoài da');

-- Bảng Medical_Supply
CREATE TABLE Medical_Supply (
    SupplyID CHAR(6) PRIMARY KEY,
    SupplyName NVARCHAR(100) NOT NULL,
    Unit NVARCHAR(50),
    CurrentStock INT,
    ExpiryDate DATE,
    Notes NVARCHAR(255)
);

INSERT INTO Medical_Supply VALUES
('MS0001', N'Băng gạc vô trùng', N'hộp', 150, '2026-06-30', N'Dùng để băng bó vết thương'),
('MS0002', N'Băng keo y tế', N'cuộn', 200, '2025-12-31', N'Thích hợp cho các vết thương nhỏ'),
('MS0003', N'Thuốc sát trùng Betadine', N'chai', 50, '2026-03-15', N'Sát trùng vết cắt và trầy xước'),
('MS0004', N'Găng tay y tế', N'đôi', 300, '2025-10-01', N'Dùng trong các thủ thuật y tế');

-- Bảng Supply_Med_Usage
CREATE TABLE Supply_Med_Usage (
    UsageID CHAR(6) PRIMARY KEY,
    IncidentID CHAR(6),
    SupplyID CHAR(6),
    MedicationID CHAR(6),
    QuantityUsed INT,
    UsageTime DATE,
    FOREIGN KEY (IncidentID) REFERENCES Medical_Incident(IncidentID),
    FOREIGN KEY (SupplyID) REFERENCES Medical_Supply(SupplyID),
    FOREIGN KEY (MedicationID) REFERENCES Medication(MedicationID)
);

INSERT INTO Supply_Med_Usage VALUES
('SU0001', 'INC001', 'MS0001', 'MD0001', 2, '2025-06-18'),
('SU0002', 'INC002', 'MS0003', 'MD0002', 1, '2025-06-17');

-- Bảng Periodic_Health_Check_Plan
CREATE TABLE Periodic_Health_Check_Plan (
    ID CHAR(6) PRIMARY KEY,
    PlanName NVARCHAR(100) NOT NULL,
    ScheduleDate DATE,
    CheckupContent NVARCHAR(255),
    Status NVARCHAR(50),
    CreatorID CHAR(6) NOT NULL,
    FOREIGN KEY (CreatorID) REFERENCES [User](UserID)
);

INSERT INTO Periodic_Health_Check_Plan VALUES
('PH0001', N'Kiểm tra sức khỏe định kỳ tháng 6', '2025-06-20', N'Đo chiều cao, cân nặng, kiểm tra mắt', N'Đã phê duyệt', 'U00002'),
('PH0002', N'Kiểm tra sức khỏe định kỳ tháng 7', '2025-07-15', N'Khám tổng quát, tiêm phòng', N'Đang lên kế hoạch', 'U00003');

-- Bảng Health_Check_Consent_Form
CREATE TABLE Health_Check_Consent_Form (
    ID CHAR(6) PRIMARY KEY,
    HealthCheckPlanID CHAR(6),
    StudentID CHAR(6),
    ParentID CHAR(6),
    ConsentStatus NVARCHAR(50),
    ResponseTime DATE,
    ReasonForDenial NVARCHAR(255),
    FOREIGN KEY (HealthCheckPlanID) REFERENCES Periodic_Health_Check_Plan(ID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);

INSERT INTO Health_Check_Consent_Form VALUES
('HC0001', 'PH0001', 'U00007', 'U00005', N'Đồng ý', '2025-06-18', NULL),
('HC0002', 'PH0002', 'U00008', 'U00006', N'Từ chối', '2025-06-18', N'Phụ huynh bận không đưa học sinh đi kiểm tra');

-- Bảng Health_Check_Result
CREATE TABLE Health_Check_Result (
    ID CHAR(6) PRIMARY KEY,
    HealthCheckConsentID CHAR(6),
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

INSERT INTO Health_Check_Result VALUES
('HRR001', 'HC0001', 145, 40, 110, 80, N'Tốt', N'Bình thường', N'Khỏe mạnh', N'Bình thường', N'Sức khỏe tổng quát tốt', '2025-06-20', N'Trần Thị B', 0, NULL),
('HRR002', 'HC0002', 150, 45, 115, 85, N'Trung bình', N'Bình thường', N'Cần theo dõi', N'Bình thường', N'Cần kiểm tra thêm về mắt và răng', '2025-07-15', N'Lê Văn C', 1, '2025-07-20');

-- Bảng Vaccine_Type
CREATE TABLE Vaccine_Type (
    VaccinationID CHAR(6) PRIMARY KEY,
    VaccineName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);

INSERT INTO Vaccine_Type VALUES
('VC0001', N'Vắc-xin Viêm gan B', N'Bảo vệ chống lại virus viêm gan B'),
('VC0002', N'Vắc-xin Sởi - Quai bị - Rubella', N'Ngăn ngừa các bệnh sởi, quai bị và rubella'),
('VC0003', N'Vắc-xin DPT', N'Bảo vệ chống lại bạch hầu, ho gà và uốn ván');

-- Bảng Vaccination_Plan
CREATE TABLE Vaccination_Plan (
    ID CHAR(6) PRIMARY KEY,
    PlanName NVARCHAR(100) NOT NULL,
    ScheduledDate DATE,
    Description NVARCHAR(255),
    Status NVARCHAR(50),
    CreatorID CHAR(6),
    FOREIGN KEY (CreatorID) REFERENCES [User](UserID)
);

INSERT INTO Vaccination_Plan VALUES
('VP0001', N'Chiến dịch tiêm vắc-xin Viêm gan B', '2025-06-25', N'Tiêm cho học sinh lớp 6', N'Đang lên kế hoạch', 'U00002'),
('VP0002', N'Chiến dịch tiêm vắc-xin Sởi - Quai bị - Rubella', '2025-07-10', N'Tiêm cho học sinh lớp 7', N'Đã phê duyệt', 'U00003');

-- Bảng Vaccination_Consent_Form
CREATE TABLE Vaccination_Consent_Form (
    ID CHAR(6) PRIMARY KEY,
    VaccinationPlanID CHAR(6),
    StudentID CHAR(6),
    ParentID CHAR(6),
    ConsentStatus NVARCHAR(50),
    ResponseTime DATE,
    ReasonForDenial NVARCHAR(255),
    FOREIGN KEY (VaccinationPlanID) REFERENCES Vaccination_Plan(ID),
    FOREIGN KEY (StudentID) REFERENCES [User](UserID),
    FOREIGN KEY (ParentID) REFERENCES [User](UserID)
);

INSERT INTO Vaccination_Consent_Form VALUES
('VCF001', 'VP0001', 'U00007', 'U00005', N'Đồng ý', '2025-06-18', NULL),
('VCF002', 'VP0002', 'U00008', 'U00006', N'Từ chối', '2025-06-18', N'Phụ huynh lo ngại về phản ứng phụ');

-- Bảng Vaccination_Result
CREATE TABLE Vaccination_Result (
    ID CHAR(6) PRIMARY KEY,
    ConsentFormID CHAR(6),
    VaccineTypeID CHAR(6),
    ActualVaccinationDate DATE,
    Performer NVARCHAR(100),
    PostVaccinationReaction NVARCHAR(255),
    Notes NVARCHAR(255),
    FOREIGN KEY (ConsentFormID) REFERENCES Vaccination_Consent_Form(ID),
    FOREIGN KEY (VaccineTypeID) REFERENCES Vaccine_Type(VaccinationID)
);

INSERT INTO Vaccination_Result VALUES
('VR0001', 'VCF001', 'VC0001', '2025-06-25', N'Trần Thị B', N'Không có phản ứng', N'Tiêm thành công, theo dõi 24h'),
('VR0002', 'VCF002', 'VC0002', NULL, NULL, N'Sốt nhẹ', N'Phụ huynh từ chối, chưa tiêm');
