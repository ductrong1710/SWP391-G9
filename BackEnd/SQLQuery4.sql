﻿USE [master]
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SchoolHealthcareDB9')
BEGIN
    ALTER DATABASE SchoolHealthcareDB9 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SchoolHealthcareDB9;
END
Go
/****** Object:  Database [SchoolHealthcareDB9]    Script Date: 7/1/2025 1:05:13 PM ******/
CREATE DATABASE [SchoolHealthcareDB9]

GO


USE [SchoolHealthcareDB9]
GO
/****** Object:  Table [dbo].[BlogDocument]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BlogDocument](
	[DocumentID] [int] NOT NULL,
	[Title] [nvarchar](255) NULL,
	[Category] [nvarchar](100) NULL,
	[Author] [nvarchar](100) NULL,
	[PublishDate] [date] NULL,
	[Summary] [nvarchar](500) NULL,
	[Content] [nvarchar](max) NULL,
	[ImageURL] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[DocumentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Health_Check_Consent_Form]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE Status (
    StatusID INT PRIMARY KEY,
    StatusName VARCHAR(50)
);

INSERT INTO Status (StatusID, StatusName) VALUES
    (1, 'Accept'),
    (2, 'Deny'),
    (3, 'Waiting');
GO
CREATE TABLE [dbo].[Health_Check_Consent_Form](
	[ID] [char](6) NOT NULL,
	[HealthCheckPlanID] [char](6) NULL,
	[StudentID] [char](6) NULL,
	[ParentID] [char](6) NULL,
	[StatusID] [int] NULL,
	[ResponseTime] [date] NULL,
	[ReasonForDenial] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Health_Check_Result]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
CREATE TABLE [dbo].[Health_Check_Result]( 
	[ID] [char](6) NOT NULL,
	[HealthCheckConsentID] [char](6) NULL,
	[Height] [int] NULL,
	[Weight] [int] NULL,
	[BloodPressure] [int] NULL,
	[HeartRate] [int] NULL,
	[Eyesight] [nvarchar](50) NULL,
	[Hearing] [nvarchar](50) NULL,
	[OralHealth] [nvarchar](50) NULL,
	[Spine] [nvarchar](50) NULL,
	[Conclusion] [nvarchar](255) NULL,
	[CheckUpDate] [date] NULL,
	[Checker] [nvarchar](100) NULL,
	[NeedToContactParent] [bit] NULL,
	[FollowUpDate] [date] NULL,
	[Status] [nvarchar](50) NULL,
	[HealthFacility] [nvarchar](100) NULL,
	[CheckupType] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Health_Record]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Health_Record](
	[HealthRecordID] [char](6) NOT NULL,
	[StudentID] [char](6) NOT NULL,
	[ParentID] [char](6) NOT NULL,
	[Allergies] [nvarchar](255) NULL,
	[Chronic_Diseases] [nvarchar](255) NULL,
	[Treatment_History] [nvarchar](255) NULL,
	[Eyesight] [int] NULL,
	[Hearing] [int] NULL,
	[Vaccination_History] [nvarchar](255) NULL,
	[Note] [nvarchar](255) NULL,
	[ParentContact] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[HealthRecordID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Incident_Involvement]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IncidentInvolvements](
    [InvolvementID] [char](6) NOT NULL,
    [IncidentID] [char](6) NULL,
    [StudentID] [char](6) NULL,
    [InjuryDescription] [nvarchar](255) NULL,
    [TreatmentGiven] [nvarchar](255) NULL,
    [Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[InvolvementID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medical_Incident]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MedicalIncidents](
    [IncidentID] [char](6) NOT NULL,
    [RecordTime] [date] NULL,
    [IncidentType] [nvarchar](100) NULL,
    [IncidentDescription] [nvarchar](255) NULL,
    [IncidentMeasures] [nvarchar](255) NULL,
    [HandlingResults] [nvarchar](255) NULL,
    [Note] [nvarchar](255) NULL,
    [MedicalStaffID] [char](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[IncidentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medical_Supply]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medical_Supply](
	[SupplyID] [char](6) NOT NULL,
	[SupplyName] [nvarchar](100) NOT NULL,
	[Unit] [nvarchar](50) NULL,
	[CurrentStock] [int] NULL,
	[ExpiryDate] [date] NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[SupplyID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medication]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medication](
	[MedicationID] [char](6) NOT NULL,
	[MedicationName] [nvarchar](100) NOT NULL,
	[Unit] [nvarchar](50) NULL,
	[CurrentStock] [int] NULL,
	[ExpiryDate] [date] NULL,
	[Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[MedicationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medication_Receipt]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medication_Receipt](
	[ReceiptID] [char](6) NOT NULL,
	[ParentID] [char](6) NOT NULL,
	[MedicalStaffID] [char](6) NOT NULL,
	[ReceiptDate] [date] NULL,
	[MedicationNo] [int] NULL,
	[MedicationName] [nvarchar](255) NULL,
	[Quantity] [int] NULL,
	[Dosage] [nvarchar](100) NULL,
	[Instruction] [nvarchar](255) NULL,
	[Notes] [nvarchar](255) NULL,
	[Status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReceiptID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Medication_Submission_Form]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Medication_Submission_Form](
	[ID] [char](6) NOT NULL,
	[StudentID] [char](6) NOT NULL,
	[ParentID] [char](6) NOT NULL,
	[Medication_Name] [nvarchar](255) NULL,
	[Dosage] [nvarchar](100) NULL,
	[Instructions] [nvarchar](255) NULL,
	[Consumption_Time] [nvarchar](100) NULL,
	[StartDate] [date] NULL,
	[EndDate] [date] NULL,
	[Status] [nvarchar](50) NULL,
	[Parents_Note] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[NotificationID] [nvarchar](100) NOT NULL,
	[UserID] [nvarchar](100) NOT NULL,
	[Title] [nvarchar](255) NOT NULL,
	[Message] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[IsRead] [bit] NOT NULL,
	[ConsentFormID] [char](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[NotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Periodic_Health_Check_Plan]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Periodic_Health_Check_Plan](
    [ID] [char] (6)  NOT NULL, 
    [PlanName] [nvarchar](100) NOT NULL, 
    [ScheduleDate] [date] NULL,
    [CheckupContent] [nvarchar](255)  NULL,
    [Status] [nvarchar](50)  NULL,
    [CreatorID] [char](6)  NOT NULL,
    [ClassID] [nvarchar](50)  NULL,
    [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
PRIMARY KEY CLUSTERED 
(
    [ID] ASC
) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, 
        ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY];
GO
/****** Object:  Table [dbo].[Profile]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Profile](
	[ProfileID] [char](6) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Date_Of_Birth] [date] NULL,
	[Sex] [nvarchar](10) NULL,
	[Phone] [nvarchar](15) NULL,
	[Email] [nvarchar](100) NULL, -- Added Email column
	[UserID] [char](6) NOT NULL,
	[Note] [nvarchar](255) NULL,
	[ClassID] [char](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[ProfileID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[RoleID] [char](6) NOT NULL,
	[RoleType] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SchoolClass]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SchoolClass](
	[ClassID] [char](6) NOT NULL,
	[ClassName] [nvarchar](50) NOT NULL,
	[Grade] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ClassID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Supply_Med_Usage]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SupplyMedUsages](
    [UsageID] [char](6) NOT NULL,
    [IncidentID] [char](6) NULL,
    [SupplyID] [char](6) NULL,
    [MedicationID] [char](6) NULL,
    [QuantityUsed] [int] NULL,
    [UsageTime] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[UsageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [char](6) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](100) NOT NULL,
	[RoleID] [char](6) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccination_Consent_Form]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vaccination_Consent_Form](
	[ID] [char](6) NOT NULL,
	[VaccinationPlanID] [char](6) NULL,
	[StudentID] [char](6) NULL,
	[ParentID] [char](6) NULL,
	[ConsentStatus] [nvarchar](50) NULL,
	[ResponseTime] [date] NULL,
	[ReasonForDenial] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccination_Plan]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vaccination_Plan](
	[ID] [char](6) NOT NULL,
	[PlanName] [nvarchar](100) NOT NULL,
	[ScheduledDate] [date] NULL,
	[Description] [nvarchar](255) NULL,
	[Status] [nvarchar](50) NULL,
	[CreatorID] [char](6) NULL,
	[Grade] [nvarchar](50) NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccination_Result]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
	CREATE TABLE [dbo].[Vaccination_Result](
    [ID] [char](6) NOT NULL,
    [ConsentFormID] [char](6) NULL,
    [VaccineTypeID] [char](6) NULL,
    [ActualVaccinationDate] [date] NULL,        -- Ngày thực tế tiêm (chỉ khi Completed)
    [Performer] [nvarchar](100) NULL,           -- Người thực hiện tiêm
    [PostVaccinationReaction] [nvarchar](255) NULL,  -- Phản ứng sau tiêm
    [Notes] [nvarchar](255) NULL,               -- Ghi chú chung
    [NeedToContactParent] [bit] NULL,           -- Cần liên hệ phụ huynh
    [VaccinationStatus] [nvarchar](50) NULL,    -- Trạng thái tiêm chủng
    [PostponementReason] [nvarchar](255) NULL,  -- Lý do hoãn
    [FailureReason] [nvarchar](255) NULL,       -- Lý do thất bại
    [RefusalReason] [nvarchar](255) NULL,       -- Lý do từ chối
    [RecordedDate] [datetime] NOT NULL DEFAULT(GETDATE()),  -- Ngày ghi nhận
    [RecordedBy] [nvarchar](100) NULL,          -- Người ghi nhận
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Vaccine_Type]    Script Date: 7/1/2025 1:05:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vaccine_Type](
	[VaccinationID] [char](6) NOT NULL,
	[VaccineName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[VaccinationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[BlogDocument] ([DocumentID], [Title], [Category], [Author], [PublishDate], [Summary], [Content], [ImageURL]) VALUES (1, N'Understanding COVID-19 Vaccination', N'vaccination', N'Dr. Rebecca Simmons', CAST(N'2025-05-15' AS Date), N'Hướng dẫn toàn diện về vắc-xin COVID-19, bao gồm các loại vắc-xin, hiệu quả và tác dụng phụ.', N'<h2>Hướng dẫn tiêm chủng COVID-19</h2>... (trích nội dung)', N'https://example.com/images/covid-vaccination.jpg')
INSERT [dbo].[BlogDocument] ([DocumentID], [Title], [Category], [Author], [PublishDate], [Summary], [Content], [ImageURL]) VALUES (2, N'Heart Health: Prevention and Management', N'health', N'Dr. Michael Garcia', CAST(N'2025-06-01' AS Date), N'Tìm hiểu về phòng ngừa bệnh tim, các yếu tố nguy cơ và thay đổi lối sống để cải thiện sức khỏe tim mạch.', N'<h2>Sức khỏe tim mạch: Phòng ngừa và Quản lý</h2>... (trích nội dung)', N'https://example.com/images/heart-health.jpg')
INSERT [dbo].[BlogDocument] ([DocumentID], [Title], [Category], [Author], [PublishDate], [Summary], [Content], [ImageURL]) VALUES (3, N'Mental Health During a Pandemic', N'mental health', N'Dr. Jennifer Lee', CAST(N'2025-04-10' AS Date), N'Các chiến lược duy trì sức khỏe tâm thần trong những thời điểm khó khăn như đại dịch.', N'<h2>Sức khỏe tâm thần trong đại dịch</h2>... (trích nội dung)', N'https://example.com/images/mental-health.jpg')
INSERT [dbo].[BlogDocument] ([DocumentID], [Title], [Category], [Author], [PublishDate], [Summary], [Content], [ImageURL]) VALUES (4, N'Nutrition Basics: Eating for Health', N'nutrition', N'Dr. Sarah Thompson', CAST(N'2025-03-20' AS Date), N'Hướng dẫn về các nguyên tắc dinh dưỡng cơ bản để duy trì sức khỏe tốt và phòng ngừa bệnh tật.', N'<h2>Nguyên tắc dinh dưỡng: Ăn uống vì sức khỏe</h2>... (trích nội dung)', N'https://example.com/images/nutrition.jpg')
GO
INSERT [dbo].[Periodic_Health_Check_Plan] 
([ID], [PlanName], [ScheduleDate], [CheckupContent], [Status], [CreatorID], [ClassID], [CreatedDate]) 
VALUES 
('PH0001', N'Kiểm tra sức khỏe định kì', '2025-06-20', N'Đo chiều cao, cân nặng, kiểm tra mắt', N'Đã phê duyệt', 'U00002', 'CL0001', GETDATE());

INSERT [dbo].[Periodic_Health_Check_Plan] 
([ID], [PlanName], [ScheduleDate], [CheckupContent], [Status], [CreatorID], [ClassID], [CreatedDate]) 
VALUES 
('PH0002', N'Kiểm tra sức khỏe định kì', '2025-07-15', N'Khám tổng quát, tiêm phòng', N'Đang lên kế hoạch', 'U00003', 'CL0002', GETDATE());

INSERT [dbo].[Periodic_Health_Check_Plan] 
([ID], [PlanName], [ScheduleDate], [CheckupContent], [Status], [CreatorID], [ClassID], [CreatedDate]) 
VALUES 
('PH0003', N'Kiểm tra sức khỏe định kì', '2025-09-01', N'Khám tổng quát, đo thị lực, thính lực, răng miệng', N'Đang chờ phê duyệt', 'U00002', 'CL0003', GETDATE());
Go
INSERT [dbo].[Health_Check_Consent_Form] ([ID],[HealthCheckPlanID],[StudentID],[ParentID],[StatusID],[ResponseTime],[ReasonForDenial]) VALUES ('HC0001', 'PH0001', 'U20001', 'U10001', 1, '2025-06-18', NULL)
INSERT [dbo].[Health_Check_Consent_Form] ([ID],[HealthCheckPlanID],[StudentID],[ParentID],[StatusID],[ResponseTime],[ReasonForDenial]) VALUES ('HC0004', 'PH0001', 'U20002', 'U10002',2, '2025-06-18', 'Đã cho kiểm tra vào tháng trước')
INSERT [dbo].[Health_Check_Consent_Form] ([ID],[HealthCheckPlanID],[StudentID],[ParentID],[StatusID],[ResponseTime],[ReasonForDenial]) VALUES ('HC0005', 'PH0001', 'U20003', 'U10003',3, '2025-06-18', NULL)

INSERT [dbo].[Health_Check_Consent_Form] ([ID],[HealthCheckPlanID],[StudentID],[ParentID],[StatusID],[ResponseTime],[ReasonForDenial]) VALUES ('HC0002', 'PH0002', 'U20002', 'U10002', 1, '2025-06-18', N'Phụ huynh bận không đưa học sinh đi kiểm tra')
INSERT [dbo].[Health_Check_Consent_Form] ([ID],[HealthCheckPlanID],[StudentID],[ParentID],[StatusID],[ResponseTime],[ReasonForDenial]) VALUES ('HC0003', 'PH0003', 'U20003', 'U10003', 2, '2025-06-25', NULL)
Go
INSERT [dbo].[Health_Record] ([HealthRecordID], [StudentID], [ParentID], [Allergies], [Chronic_Diseases], [Treatment_History], [Eyesight], [Hearing], [Vaccination_History], [Note], [ParentContact]) VALUES (N'HR0001', N'U20001', N'U10001', N'Phấn hoa', N'Suyễn', N'Điều trị suyễn năm 2022', 10, 10, N'Đã tiêm phòng đầy đủ', N'Không có ghi chú thêm', N'0901111111')
INSERT [dbo].[Health_Record] ([HealthRecordID], [StudentID], [ParentID], [Allergies], [Chronic_Diseases], [Treatment_History], [Eyesight], [Hearing], [Vaccination_History], [Note], [ParentContact]) VALUES (N'HR0002', N'U20002', N'U10002', N'Không', N'Không', N'Từng bị thủy đậu năm 2021', 9, 10, N'Thiếu mũi viêm gan B', N'Cần tiêm bổ sung', N'0902222222')
INSERT [dbo].[Health_Record] ([HealthRecordID], [StudentID], [ParentID], [Allergies], [Chronic_Diseases], [Treatment_History], [Eyesight], [Hearing], [Vaccination_History], [Note], [ParentContact]) VALUES (N'HR0003', N'U20003', N'U10003', N'Không', N'Viêm họng mãn tính', N'Không có tiền sử bệnh nghiêm trọng', 9, 9, N'Đã tiêm 2 mũi COVID-19', N'Thường xuyên đau họng', N'0903333333')
GO
INSERT [dbo].[Medical_Supply] ([SupplyID], [SupplyName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MS0001', N'Băng gạc vô trùng', N'hộp', 150, CAST(N'2026-06-30' AS Date), N'Dùng để băng bó vết thương')
INSERT [dbo].[Medical_Supply] ([SupplyID], [SupplyName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MS0002', N'Băng keo y tế', N'cuộn', 200, CAST(N'2025-12-31' AS Date), N'Thích hợp cho các vết thương nhỏ')
INSERT [dbo].[Medical_Supply] ([SupplyID], [SupplyName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MS0003', N'Thuốc sát trùng Betadine', N'chai', 50, CAST(N'2026-03-15' AS Date), N'Sát trùng vết cắt và trầy xước')
INSERT [dbo].[Medical_Supply] ([SupplyID], [SupplyName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MS0004', N'Găng tay y tế', N'đôi', 300, CAST(N'2025-10-01' AS Date), N'Dùng trong các thủ thuật y tế')
GO
INSERT [dbo].[Medication] ([MedicationID], [MedicationName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MD0001', N'Paracetamol', N'viên', 500, CAST(N'2025-12-31' AS Date), N'Thuốc hạ sốt, giảm đau cơ bản')
INSERT [dbo].[Medication] ([MedicationID], [MedicationName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MD0002', N'Gạc y tế', N'bịch', 200, CAST(N'2026-01-01' AS Date), N'Dùng sơ cứu vết thương')
INSERT [dbo].[Medication] ([MedicationID], [MedicationName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MD0003', N'Thuốc nhỏ mắt Natri Clorid 0.9%', N'chai', 150, CAST(N'2025-09-30' AS Date), N'Dùng sát trùng mắt')
INSERT [dbo].[Medication] ([MedicationID], [MedicationName], [Unit], [CurrentStock], [ExpiryDate], [Notes]) VALUES (N'MD0004', N'Cồn 70 độ', N'chai', 100, CAST(N'2027-01-01' AS Date), N'Sát trùng vết thương ngoài da')
GO
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P00001', N'Nguyễn Văn A', CAST(N'1980-01-01' AS Date), N'Nam', N'0901111111', N'trongtdse182423@fpt.edu.vn', N'U10001', N'Phụ huynh học sinh 1', NULL)
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P00002', N'Trần Thị B', CAST(N'1982-02-02' AS Date), N'Nữ', N'0902222222', N'ngocptse180605@fpt.edu.vn', N'U10002', N'Phụ huynh học sinh 2', NULL)
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P00003', N'Lê Văn C', CAST(N'1984-03-03' AS Date), N'Nam', N'0903333333', N'levanc@example.com', N'U10003', N'Phụ huynh học sinh 3', NULL)
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P10001', N'Học Sinh G', CAST(N'2010-09-01' AS Date), N'Nữ', N'0911111111', N'hocsinhg@example.com', N'U20001', N'Học sinh lớp 6A', N'CL0001')
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P10002', N'Học Sinh H', CAST(N'2011-03-10' AS Date), N'Nam', N'0912222222', N'hocsinhh@example.com', N'U20002', N'Học sinh lớp 6A', N'CL0001')
INSERT [dbo].[Profile] ([ProfileID], [Name], [Date_Of_Birth], [Sex], [Phone], [Email], [UserID], [Note], [ClassID]) VALUES 
(N'P10003', N'Học Sinh I', CAST(N'2012-01-15' AS Date), N'Nam', N'0913333333', N'hocsinhi@example.com', N'U20003', N'Học sinh lớp 6B', N'CL0002')
GO
INSERT [dbo].[Role] ([RoleID], [RoleType]) VALUES (N'000001', N'Admin')
INSERT [dbo].[Role] ([RoleID], [RoleType]) VALUES (N'000002', N'MedicalStaff')
INSERT [dbo].[Role] ([RoleID], [RoleType]) VALUES (N'000003', N'Parent')
INSERT [dbo].[Role] ([RoleID], [RoleType]) VALUES (N'000004', N'Student')
GO
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0001', N'6A', N'Khối 6')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0002', N'6B', N'Khối 6')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0003', N'6C', N'Khối 6')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0004', N'7A', N'Khối 7')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0005', N'7B', N'Khối 7')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0006', N'7C', N'Khối 7')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0007', N'8A', N'Khối 8')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0008', N'8B', N'Khối 8')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0009', N'8C', N'Khối 8')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0010', N'9A', N'Khối 9')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0011', N'9B', N'Khối 9')
INSERT [dbo].[SchoolClass] ([ClassID], [ClassName], [Grade]) VALUES (N'CL0012', N'9C', N'Khối 9')
GO
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U00001', N'admin01', N'adminpass', N'000001')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U00002', N'medstaff01', N'medpass1', N'000002')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U00003', N'medstaff02', N'medpass2', N'000002')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U10001', N'parent01', N'parentpass1', N'000003')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U10002', N'parent02', N'parentpass2', N'000003')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U10003', N'parent03', N'parentpass3', N'000003')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U20001', N'student01', N'studentpass1', N'000004')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U20002', N'student02', N'studentpass2', N'000004')
INSERT [dbo].[Users] ([UserID], [Username], [Password], [RoleID]) VALUES (N'U20003', N'student03', N'studentpass3', N'000004')
GO
INSERT [dbo].[Vaccine_Type] ([VaccinationID], [VaccineName], [Description]) VALUES (N'VC0001', N'Vắc-xin Viêm gan B', N'Bảo vệ chống lại virus viêm gan B')
INSERT [dbo].[Vaccine_Type] ([VaccinationID], [VaccineName], [Description]) VALUES (N'VC0002', N'Vắc-xin Sởi - Quai bị - Rubella', N'Ngăn ngừa các bệnh sởi, quai bị và rubella')
INSERT [dbo].[Vaccine_Type] ([VaccinationID], [VaccineName], [Description]) VALUES (N'VC0003', N'Vắc-xin DPT', N'Bảo vệ chống lại bạch hầu, ho gà và uốn ván')
GO
CREATE TABLE [dbo].[HealthCheckHistory](
    [HistoryID] [char](10) NOT NULL,
    [StudentID] [char](6) NOT NULL,
    [CheckUpDate] [date] NOT NULL,
    [Height] [int] NULL,
    [Weight] [int] NULL,
    [BloodPressure] [int] NULL,
    [HeartRate] [int] NULL,
    [Eyesight] [nvarchar](50) NULL,
    [Hearing] [nvarchar](50) NULL,
    [OralHealth] [nvarchar](50) NULL,
    [Spine] [nvarchar](50) NULL,
    [Conclusion] [nvarchar](255) NULL,
    [Checker] [nvarchar](100) NULL,
    [HealthFacility] [nvarchar](100) NULL,
    [CheckupType] [nvarchar](100) NULL,
    [Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED
(
    [HistoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

---
--- Table: VaccinationHistory
---
CREATE TABLE [dbo].[VaccinationHistory](
    [HistoryID] [char](10) NOT NULL,
    [StudentID] [char](6) NOT NULL,
    [VaccineTypeID] [char](6) NOT NULL,
    [VaccinationDate] [date] NOT NULL,
    [Performer] [nvarchar](100) NULL,
    [PostVaccinationReaction] [nvarchar](255) NULL,
    [Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED
(
    [HistoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [dbo].[VaccineDisease](
    [VaccineDiseaseID] [char](10) NOT NULL,
    [VaccinationID] [char](6) NOT NULL,
    [DiseaseName] [nvarchar](100) NOT NULL,
    [RequiredDoses] [int] NULL,
    [Notes] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED
(
    [VaccineDiseaseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0001', 'VC0001', N'Viêm gan B', 3, N'Thường tiêm 3 mũi (sơ sinh, 1 tháng, 6 tháng)')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0002', 'VC0002', N'Sởi', 2, N'Thường tiêm 2 mũi')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0003', 'VC0002', N'Quai bị', 2, N'Thường tiêm 2 mũi')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0004', 'VC0002', N'Rubella', 2, N'Thường tiêm 2 mũi')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0005', 'VC0003', N'Bạch hầu', 4, N'Thường tiêm 4-5 mũi tùy phác đồ')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0006', 'VC0003', N'Ho gà', 4, N'Thường tiêm 4-5 mũi tùy phác đồ')
INSERT INTO [dbo].[VaccineDisease] ([VaccineDiseaseID], [VaccinationID], [DiseaseName], [RequiredDoses], [Notes]) VALUES
('VD0007', 'VC0003', N'Uốn ván', 4, N'Thường tiêm 4-5 mũi tùy phác đồ')
GO
ALTER TABLE [dbo].[VaccineDisease]  WITH CHECK ADD FOREIGN KEY([VaccinationID])
REFERENCES [dbo].[Vaccine_Type] ([VaccinationID])
GO

ALTER TABLE [dbo].[HealthCheckHistory]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO

ALTER TABLE [dbo].[VaccinationHistory]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO

ALTER TABLE [dbo].[VaccinationHistory]  WITH CHECK ADD FOREIGN KEY([VaccineTypeID])
REFERENCES [dbo].[Vaccine_Type] ([VaccinationID])
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Notification] ADD  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Vaccination_Plan] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Health_Check_Consent_Form]  WITH CHECK ADD FOREIGN KEY([HealthCheckPlanID])
REFERENCES [dbo].[Periodic_Health_Check_Plan] ([ID])
GO
ALTER TABLE [dbo].[Health_Check_Consent_Form]  WITH CHECK ADD FOREIGN KEY([ParentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Health_Check_Consent_Form]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Health_Check_Result]  WITH CHECK ADD FOREIGN KEY([HealthCheckConsentID])
REFERENCES [dbo].[Health_Check_Consent_Form] ([ID])
GO
ALTER TABLE [dbo].[Health_Record]  WITH CHECK ADD FOREIGN KEY([ParentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Health_Record]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[IncidentInvolvements]  WITH CHECK ADD FOREIGN KEY([IncidentID])
REFERENCES [dbo].[MedicalIncidents] ([IncidentID])
GO
ALTER TABLE [dbo].[IncidentInvolvements]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[MedicalIncidents]  WITH CHECK ADD FOREIGN KEY([MedicalStaffID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Medication_Receipt]  WITH CHECK ADD FOREIGN KEY([MedicalStaffID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Medication_Receipt]  WITH CHECK ADD FOREIGN KEY([ParentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Medication_Submission_Form]  WITH CHECK ADD FOREIGN KEY([ParentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Medication_Submission_Form]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Periodic_Health_Check_Plan]  WITH CHECK ADD FOREIGN KEY([CreatorID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Profile]  WITH CHECK ADD FOREIGN KEY([ClassID])
REFERENCES [dbo].[SchoolClass] ([ClassID])
GO
ALTER TABLE [dbo].[Profile]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[SupplyMedUsages]  WITH CHECK ADD FOREIGN KEY([IncidentID])
REFERENCES [dbo].[MedicalIncidents] ([IncidentID])
GO
ALTER TABLE [dbo].[SupplyMedUsages]  WITH CHECK ADD FOREIGN KEY([MedicationID])
REFERENCES [dbo].[Medication] ([MedicationID])
GO
ALTER TABLE [dbo].[SupplyMedUsages]  WITH CHECK ADD FOREIGN KEY([SupplyID])
REFERENCES [dbo].[Medical_Supply] ([SupplyID])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([RoleID])
REFERENCES [dbo].[Role] ([RoleID])
GO
ALTER TABLE [dbo].[Vaccination_Consent_Form]  WITH CHECK ADD FOREIGN KEY([ParentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Vaccination_Consent_Form]  WITH CHECK ADD FOREIGN KEY([StudentID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Vaccination_Consent_Form]  WITH CHECK ADD FOREIGN KEY([VaccinationPlanID])
REFERENCES [dbo].[Vaccination_Plan] ([ID])
GO
ALTER TABLE [dbo].[Vaccination_Plan]  WITH CHECK ADD FOREIGN KEY([CreatorID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Vaccination_Result]  WITH CHECK ADD FOREIGN KEY([ConsentFormID])
REFERENCES [dbo].[Vaccination_Consent_Form] ([ID])
GO
ALTER TABLE [dbo].[Vaccination_Result]  WITH CHECK ADD FOREIGN KEY([VaccineTypeID])
REFERENCES [dbo].[Vaccine_Type] ([VaccinationID])
Go
ALTER TABLE [dbo].[Profile]  WITH CHECK ADD FOREIGN KEY([ClassID])
REFERENCES [dbo].[SchoolClass] ([ClassID])
GO
ALTER TABLE [dbo].[Profile]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
USE [master]
GO
ALTER DATABASE [SchoolHealthcareDB9] SET  READ_WRITE 
GO
Select * From Periodic_Health_Check_Plan
Select * From Health_Check_Result
SELECT * FROM Health_Check_Consent_Form WHERE HealthCheckPlanID = 'PH0003'
	Select * from Health_Check_result 
	select * from users