package pe;

import pe.dao.UserDAO;
import pe.entity.User;
import pe.utils.DBUtils;

import java.sql.Connection;
import java.util.List;

/**
 * Main class for standalone execution and testing
 * This can be used to test database connectivity or run maintenance tasks
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("School Medical Management System - Standalone Mode");
        System.out.println("=================================================");
        
        // Test database connection
        try {
            Connection conn = DBUtils.getConnection();
            if (conn != null) {
                System.out.println("Database connection successful!");
                conn.close();
                
                // Test user retrieval
                UserDAO userDAO = new UserDAO();
                List<User> users = userDAO.getAllUsers();
                System.out.println("Found " + users.size() + " users in the system");
                
                // Display first few users
                int count = 0;
                for (User user : users) {
                    System.out.println("User: " + user.getFirstName() + " " + user.getLastName() + " (" + user.getUserType() + ")");
                    if (++count >= 3) break;
                }
            }
        } catch (Exception e) {
            System.err.println("Error connecting to database: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("\nTo deploy as web application:");
        System.out.println("1. Run build.bat or build-maven.bat");
        System.out.println("2. Deploy the WAR file to Tomcat");
    }
}