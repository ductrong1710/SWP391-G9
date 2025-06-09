package pe.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database utility class for managing database connections
 * School Medical Management System
 */
public class DBUtils {
    private static final String DB_NAME = "SchoolMedicalDB";
    private static final String DB_USER_NAME = "SA";
    private static final String DB_PASSWORD = "12345";
    private static final String DB_URL = "jdbc:sqlserver://localhost:1433;databaseName=" + DB_NAME + ";trustServerCertificate=true";

    /**
     * Get database connection
     * @return Connection object
     * @throws ClassNotFoundException if SQL Server driver not found
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
        return DriverManager.getConnection(DB_URL, DB_USER_NAME, DB_PASSWORD);
    }

    /**
     * Test database connection
     * @return true if connection successful, false otherwise
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (Exception e) {
            System.err.println("Database connection test failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Close database connection safely
     * @param conn Connection to close
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
