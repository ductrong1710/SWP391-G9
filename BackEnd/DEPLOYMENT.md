# School Medical Management System - Deployment Guide

## Prerequisites

### 1. Software Requirements
- **Java JDK 8 or higher**
- **Apache Tomcat 9.0 or higher**
- **Microsoft SQL Server 2019 or higher**
- **SQL Server Management Studio (SSMS)** (optional)

### 2. Environment Setup

#### Java Configuration
```bash
# Verify Java installation
java -version
javac -version
```

#### Tomcat Configuration
```bash
# Set CATALINA_HOME environment variable
set CATALINA_HOME=C:\apache-tomcat-9.0.x
```

#### SQL Server Configuration
- Install SQL Server with default instance
- Enable SQL Server Authentication
- Create login: SA with password: 12345
- Enable TCP/IP protocol on port 1433

## Database Setup

### 1. Create Database
```sql
-- Run the database_schema.sql script
-- This will create the SchoolMedicalDB database with all tables and sample data
```

### 2. Verify Database Connection
```sql
-- Test connection with these credentials:
Server: localhost
Database: SchoolMedicalDB
Username: SA
Password: 12345
```

## Application Deployment

### Method 1: Automated Build
```bash
# Run the build script
build.bat

# This will:
# 1. Download required JAR files
# 2. Compile Java source files
# 3. Create WAR file
# 4. Provide deployment instructions
```

### Method 2: Manual Deployment

#### Step 1: Download Dependencies
Download and place in `lib/` directory:
- gson-2.8.9.jar
- mssql-jdbc-9.4.1.jre8.jar

#### Step 2: Compile
```bash
javac -cp "lib/*;%CATALINA_HOME%/lib/servlet-api.jar" -d build/classes src/pe/**/*.java
```

#### Step 3: Create WAR
```bash
jar -cvf dist/SchoolMedicalSystem.war -C web . -C build/classes .
```

#### Step 4: Deploy to Tomcat
```bash
copy dist\SchoolMedicalSystem.war %CATALINA_HOME%\webapps\
```

## Starting the Application

### 1. Start SQL Server
```bash
# Start SQL Server service
net start MSSQLSERVER
```

### 2. Start Tomcat
```bash
cd %CATALINA_HOME%\bin
startup.bat
```

### 3. Access Application
Open browser and navigate to:
- **Main Application**: http://localhost:8080/SchoolMedicalSystem
- **API Testing**: http://localhost:8080/SchoolMedicalSystem/index.html

## API Endpoints

### User Management
- `GET /users?action=getAll` - Get all users
- `GET /users?action=getById&id={id}` - Get user by ID
- `POST /users?action=register` - Register new user
- `POST /users?action=login` - User login
- `PUT /users?id={id}` - Update user
- `DELETE /users?id={id}` - Delete user

### Health Declarations
- `GET /health-declarations?action=getAll` - Get all declarations
- `GET /health-declarations?action=getByStudent&studentId={id}` - Get by student
- `POST /health-declarations?action=create` - Create declaration
- `PUT /health-declarations?id={id}` - Update declaration
- `DELETE /health-declarations?id={id}` - Delete declaration

### Vaccinations
- `GET /vaccinations?action=getAll` - Get all vaccinations
- `GET /vaccinations?action=getByStudent&studentId={id}` - Get by student
- `POST /vaccinations?action=create` - Create vaccination record
- `PUT /vaccinations?id={id}` - Update vaccination
- `DELETE /vaccinations?id={id}` - Delete vaccination

### Medicine Records
- `GET /medicine-records?action=getAll` - Get all records
- `GET /medicine-records?action=getByStudent&studentId={id}` - Get by student
- `POST /medicine-records?action=create` - Create medicine record
- `PUT /medicine-records?id={id}` - Update record
- `DELETE /medicine-records?id={id}` - Delete record

## Testing

### Using the Built-in Test Interface
1. Navigate to: http://localhost:8080/SchoolMedicalSystem/index.html
2. Click various test buttons to verify functionality
3. Check the results in the response sections

### Using cURL
```bash
# Test user registration
curl -X POST http://localhost:8080/SchoolMedicalSystem/users \
  -d "action=register&username=testuser&password=test123&firstName=Test&lastName=User&email=test@example.com&phone=1234567890&userType=student"

# Test login
curl -X POST http://localhost:8080/SchoolMedicalSystem/users \
  -d "action=login&username=admin&password=admin123"
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Verify SQL Server is running
- Check database name: SchoolMedicalDB
- Verify SA login credentials
- Enable TCP/IP protocol
- Check firewall settings

#### 2. Compilation Errors
- Verify Java JDK is installed
- Check CATALINA_HOME environment variable
- Ensure all JAR files are in lib/ directory
- Verify servlet-api.jar is available

#### 3. 404 Errors
- Verify WAR file is deployed correctly
- Check Tomcat logs: %CATALINA_HOME%/logs/
- Ensure web.xml is properly configured
- Verify servlet annotations are working

#### 4. CORS Issues
- CorsFilter is configured in web.xml
- Check browser console for CORS errors
- Verify filter mapping covers all URLs

### Log Files
- **Tomcat Logs**: %CATALINA_HOME%/logs/catalina.out
- **Application Logs**: Check console output
- **SQL Server Logs**: SQL Server Management Studio

## Security Notes

⚠️ **Important**: This is a development/demo setup:
- Change default SA password in production
- Implement proper authentication mechanisms
- Use HTTPS in production
- Add input validation and sanitization
- Implement proper error handling
- Add logging and monitoring

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review log files for error details
3. Verify all prerequisites are met
4. Test database connectivity separately
