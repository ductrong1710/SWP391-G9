@echo off
echo Building School Medical Management System with Maven...
echo.

REM Check if Java is installed
java -version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Maven is available
mvn -version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/download.cgi
    echo and add it to your PATH environment variable
    pause
    exit /b 1
)

REM Clean and build with Maven
echo Running Maven build...
mvn clean package

if %errorlevel% equ 0 (
    echo.
    echo BUILD SUCCESSFUL!
    echo WAR file created in target\SchoolMedicalSystem.war
    
    REM Copy to Tomcat if CATALINA_HOME is set
    if defined CATALINA_HOME (
        echo.
        echo Copying WAR file to Tomcat webapps directory...
        copy /Y target\SchoolMedicalSystem.war "%CATALINA_HOME%\webapps\"
        if %errorlevel% equ 0 (
            echo WAR file successfully copied to Tomcat
        ) else (
            echo Failed to copy WAR file to Tomcat
        )
    )
) else (
    echo.
    echo BUILD FAILED!
)

echo.
echo To deploy:
echo 1. Copy target\SchoolMedicalSystem.war to your Tomcat webapps directory
echo 2. Start Tomcat server
echo 3. Access the application at http://localhost:8080/SchoolMedicalSystem
echo.
pause