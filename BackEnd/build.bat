@echo off
echo Building School Medical Management System...
echo.

REM Check if Java is installed
java -version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Ant is available
ant -version > nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Ant is not installed. Using manual compilation...
    goto :manual_build
) else (
    echo Using Ant for building...
    ant build
    if %errorlevel% equ 0 (
        echo.
        echo BUILD SUCCESSFUL!
        echo WAR file created in dist\SchoolMedicalSystem.war
    ) else (
        echo.
        echo BUILD FAILED!
    )
    goto :end
)

:manual_build
echo.
echo Manual compilation...

REM Create directories
if not exist "build\classes" mkdir "build\classes"
if not exist "dist" mkdir "dist"
if not exist "lib" mkdir "lib"

REM Download required JAR files if not present
if not exist "lib\gson-2.8.9.jar" (
    echo Downloading Gson library...
    powershell -Command "Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/google/code/gson/gson/2.8.9/gson-2.8.9.jar' -OutFile 'lib\gson-2.8.9.jar'"
)

if not exist "lib\mssql-jdbc-9.4.1.jre8.jar" (
    echo Downloading SQL Server JDBC driver...
    powershell -Command "Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/9.4.1.jre8/mssql-jdbc-9.4.1.jre8.jar' -OutFile 'lib\mssql-jdbc-9.4.1.jre8.jar'"
)

REM Compile Java files
echo Compiling Java source files...
javac -cp "lib\*;%CATALINA_HOME%\lib\servlet-api.jar" -d build\classes src\pe\**\*.java

if %errorlevel% neq 0 (
    echo.
    echo COMPILATION FAILED!
    echo Make sure you have:
    echo 1. Java JDK installed
    echo 2. CATALINA_HOME environment variable set (pointing to Tomcat)
    echo 3. All required JAR files in lib directory
    pause
    exit /b 1
)

echo.
echo COMPILATION SUCCESSFUL!

:end
echo.
echo To deploy:
echo 1. Copy dist\SchoolMedicalSystem.war to your Tomcat webapps directory
echo 2. Start Tomcat server
echo 3. Access the application at http://localhost:8080/SchoolMedicalSystem
echo.
pause
