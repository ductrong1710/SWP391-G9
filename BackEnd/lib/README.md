# Required JAR Dependencies

This directory should contain the following JAR files for the School Medical Management System:

## Core Dependencies

### 1. Gson Library (JSON Processing)
- **File**: `gson-2.8.9.jar`
- **Purpose**: JSON serialization/deserialization
- **Download**: https://repo1.maven.org/maven2/com/google/code/gson/gson/2.8.9/gson-2.8.9.jar

### 2. SQL Server JDBC Driver
- **File**: `mssql-jdbc-9.4.1.jre8.jar`
- **Purpose**: Database connectivity
- **Download**: https://repo1.maven.org/maven2/com/microsoft/sqlserver/mssql-jdbc/9.4.1.jre8/mssql-jdbc-9.4.1.jre8.jar

## Optional Dependencies (for enhanced functionality)

### 3. Apache Commons Lang (Utilities)
- **File**: `commons-lang3-3.12.0.jar`
- **Purpose**: String utilities, validation
- **Download**: https://repo1.maven.org/maven2/org/apache/commons/commons-lang3/3.12.0/commons-lang3-3.12.0.jar

### 4. Apache Commons FileUpload (File handling)
- **File**: `commons-fileupload-1.4.jar`
- **Purpose**: File upload functionality
- **Download**: https://repo1.maven.org/maven2/commons-fileupload/commons-fileupload/1.4/commons-fileupload-1.4.jar

## Automatic Download

The `build.bat` script will automatically download the core dependencies if they are not present.

## Manual Download

If you prefer to download manually:

1. Create this `lib` directory if it doesn't exist
2. Download each JAR file from the URLs above
3. Place them in this directory
4. Run the build script

## Maven Dependencies (if using Maven)

```xml
<dependencies>
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.8.9</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>9.4.1.jre8</version>
    </dependency>
</dependencies>
```

## Gradle Dependencies (if using Gradle)

```gradle
dependencies {
    implementation 'com.google.code.gson:gson:2.8.9'
    implementation 'com.microsoft.sqlserver:mssql-jdbc:9.4.1.jre8'
}
```
