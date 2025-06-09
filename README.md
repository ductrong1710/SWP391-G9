# School Medical Management System

Hệ thống quản lý y tế học đường được phát triển bằng Java Servlet và HTML/CSS/JavaScript.

## Cấu trúc dự án

```
BackEnd/
├── src/
│   └── pe/
│       ├── entity/          # Các lớp entity (User, HealthDeclaration, Vaccination, MedicineRecord)
│       ├── dao/             # Các lớp truy cập dữ liệu (DAO)
│       ├── servlet/         # Các servlet xử lý HTTP requests
│       ├── filter/          # Filter CORS
│       └── utils/           # Utilities (DBUtils)
├── web/
│   └── WEB-INF/
│       └── web.xml          # Cấu hình web application
├── database_schema.sql      # Script tạo database
└── DBUtils                  # Utilities kết nối database

FrontEnd/
├── js/
│   └── api.js              # JavaScript API client
├── login.html              # Trang đăng nhập
├── register.html           # Trang đăng ký
├── dashBoard.html          # Trang dashboard
├── healthDeclaration.html  # Trang khai báo sức khỏe
├── vaccinationManagement.html # Trang quản lý tiêm chủng
└── ...                     # Các trang khác
```

## Cài đặt và triển khai

### 1. Chuẩn bị môi trường

#### Yêu cầu hệ thống:
- Java JDK 8 trở lên
- Apache Tomcat 9 trở lên
- SQL Server 2017 trở lên
- IDE: IntelliJ IDEA, Eclipse, hoặc NetBeans

#### Thư viện cần thiết:
- Microsoft SQL Server JDBC Driver
- Gson library cho JSON processing
- Servlet API

### 2. Cài đặt Database

1. **Tạo database:**
   ```sql
   -- Chạy file database_schema.sql trong SQL Server Management Studio
   -- Hoặc sử dụng sqlcmd:
   sqlcmd -S localhost -U SA -P 12345 -i database_schema.sql
   ```

2. **Cập nhật thông tin kết nối database:**
   - Mở file `DBUtils.java`
   - Cập nhật thông tin server, username, password phù hợp:
   ```java
   private static final String DB_NAME = "SchoolMedicalDB";
   private static final String DB_USER_NAME = "SA";
   private static final String DB_PASSWORD = "12345";
   ```

### 3. Triển khai Backend

1. **Import project vào IDE:**
   - Import thư mục `BackEnd` vào IDE
   - Thêm các thư viện cần thiết vào classpath

2. **Thêm dependencies:**
   - Microsoft SQL Server JDBC Driver
   - Gson library
   - Servlet API (nếu chưa có trong Tomcat)

3. **Build và deploy:**
   - Build project thành file WAR
   - Deploy vào Tomcat server
   - URL mặc định: `http://localhost:8080/SchoolMedicalSystem`

### 4. Cấu hình Frontend

1. **Cập nhật API URL:**
   - Mở file `FrontEnd/js/api.js`
   - Cập nhật `API_BASE_URL` phù hợp với server:
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/SchoolMedicalSystem';
   ```

2. **Host frontend:**
   - Copy tất cả file trong thư mục `FrontEnd` vào web server (Apache, Nginx)
   - Hoặc chạy trực tiếp từ file system

## Sử dụng hệ thống

### 1. Đăng nhập/Đăng ký

- **Truy cập:** `login.html`
- **Tài khoản mặc định:**
  - Admin: `admin` / `123456`
  - Doctor: `doctor01` / `123456`
  - Teacher: `teacher01` / `123456`

### 2. Các chức năng chính

#### Quản lý người dùng:
- Đăng ký tài khoản mới
- Xem danh sách người dùng
- Cập nhật thông tin người dùng
- Phân quyền theo loại người dùng

#### Khai báo sức khỏe:
- Khai báo hồ sơ sức khỏe học sinh
- Xem danh sách khai báo
- Duyệt/từ chối khai báo
- Cập nhật thông tin sức khỏe

#### Quản lý tiêm chủng:
- Lập lịch tiêm chủng
- Ghi nhận kết quả tiêm
- Theo dõi tình trạng tiêm chủng
- Báo cáo thống kê

#### Quản lý thuốc:
- Ghi nhận đơn thuốc
- Theo dõi việc uống thuốc
- Quản lý tình trạng điều trị

## API Documentation

### User APIs

```
GET /users?action=getAll                    # Lấy tất cả người dùng
GET /users?action=getById&id={userId}       # Lấy người dùng theo ID
GET /users?action=getByType&type={userType} # Lấy người dùng theo loại
POST /users?action=register                 # Đăng ký người dùng mới
POST /users?action=login                    # Đăng nhập
PUT /users?id={userId}                      # Cập nhật người dùng
DELETE /users?id={userId}                   # Xóa người dùng
```

### Health Declaration APIs

```
GET /health-declarations?action=getAll                           # Lấy tất cả khai báo
GET /health-declarations?action=getById&id={declarationId}       # Lấy khai báo theo ID
GET /health-declarations?action=getByStudentId&studentId={id}    # Lấy khai báo theo học sinh
GET /health-declarations?action=getByStatus&status={status}     # Lấy khai báo theo trạng thái
POST /health-declarations                                        # Tạo khai báo mới
PUT /health-declarations?id={declarationId}                     # Cập nhật khai báo
PUT /health-declarations?action=updateStatus&id={id}&status={status} # Cập nhật trạng thái
DELETE /health-declarations?id={declarationId}                  # Xóa khai báo
```

### Vaccination APIs

```
GET /vaccinations?action=getAll                              # Lấy tất cả tiêm chủng
GET /vaccinations?action=getById&id={vaccinationId}          # Lấy tiêm chủng theo ID
GET /vaccinations?action=getByStudentId&studentId={id}       # Lấy tiêm chủng theo học sinh
GET /vaccinations?action=getByStatus&status={status}        # Lấy tiêm chủng theo trạng thái
GET /vaccinations?action=getByVaccineName&vaccineName={name} # Lấy tiêm chủng theo tên vaccine
POST /vaccinations                                           # Tạo lịch tiêm mới
PUT /vaccinations?id={vaccinationId}                        # Cập nhật tiêm chủng
PUT /vaccinations?action=updateStatus&id={id}&status={status} # Cập nhật trạng thái
DELETE /vaccinations?id={vaccinationId}                     # Xóa lịch tiêm
```

### Medicine Record APIs

```
GET /medicine-records?action=getAll                           # Lấy tất cả đơn thuốc
GET /medicine-records?action=getById&id={recordId}            # Lấy đơn thuốc theo ID
GET /medicine-records?action=getByStudentId&studentId={id}    # Lấy đơn thuốc theo học sinh
GET /medicine-records?action=getActiveByStudentId&studentId={id} # Lấy đơn thuốc đang dùng
GET /medicine-records?action=getByStatus&status={status}     # Lấy đơn thuốc theo trạng thái
POST /medicine-records                                        # Tạo đơn thuốc mới
PUT /medicine-records?id={recordId}                          # Cập nhật đơn thuốc
PUT /medicine-records?action=updateStatus&id={id}&status={status} # Cập nhật trạng thái
DELETE /medicine-records?id={recordId}                       # Xóa đơn thuốc
```

## Troubleshooting

### Lỗi kết nối database:
1. Kiểm tra SQL Server đã chạy
2. Kiểm tra thông tin kết nối trong `DBUtils.java`
3. Kiểm tra JDBC driver đã được thêm vào classpath

### Lỗi CORS:
1. Kiểm tra `CorsFilter` đã được cấu hình
2. Đảm bảo frontend và backend chạy trên cùng domain hoặc CORS được cấu hình đúng

### Lỗi 404 - Not Found:
1. Kiểm tra URL mapping trong servlet
2. Kiểm tra web.xml cấu hình đúng
3. Kiểm tra context path của application

## Phát triển thêm

### Thêm chức năng mới:
1. Tạo entity class trong package `pe.entity`
2. Tạo DAO class trong package `pe.dao`
3. Tạo servlet trong package `pe.servlet`
4. Thêm API functions vào `api.js`
5. Tạo frontend pages

### Bảo mật:
- Thêm mã hóa password (BCrypt)
- Implement JWT authentication
- Thêm validation input
- Implement rate limiting

### Performance:
- Thêm connection pooling
- Implement caching
- Optimize database queries
- Add pagination

## Liên hệ

Để được hỗ trợ, vui lòng liên hệ team phát triển.
