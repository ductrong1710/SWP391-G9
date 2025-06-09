package pe.servlet;

import pe.utils.DBUtils;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

/**
 * System Health Check Servlet
 * Provides system status and health information
 */
@WebServlet("/system/health")
public class SystemHealthServlet extends HttpServlet {
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        Map<String, Object> healthStatus = new HashMap<>();
        
        try {
            // Check database connectivity
            boolean dbConnected = testDatabaseConnection();
            
            // System information
            healthStatus.put("status", dbConnected ? "HEALTHY" : "UNHEALTHY");
            healthStatus.put("timestamp", System.currentTimeMillis());
            healthStatus.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");
            healthStatus.put("version", "1.0.0");
            healthStatus.put("environment", "development");
            
            // JVM information
            Runtime runtime = Runtime.getRuntime();
            Map<String, Object> jvmInfo = new HashMap<>();
            jvmInfo.put("totalMemory", runtime.totalMemory());
            jvmInfo.put("freeMemory", runtime.freeMemory());
            jvmInfo.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
            jvmInfo.put("maxMemory", runtime.maxMemory());
            jvmInfo.put("processors", runtime.availableProcessors());
            healthStatus.put("jvm", jvmInfo);
            
            // Services status
            Map<String, String> services = new HashMap<>();
            services.put("userService", "ACTIVE");
            services.put("healthDeclarationService", "ACTIVE");
            services.put("vaccinationService", "ACTIVE");
            services.put("medicineRecordService", "ACTIVE");
            healthStatus.put("services", services);
            
            if (!dbConnected) {
                response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            healthStatus.put("status", "ERROR");
            healthStatus.put("error", e.getMessage());
        }
        
        out.print(gson.toJson(healthStatus));
        out.flush();
    }
    
    private boolean testDatabaseConnection() {
        try (Connection conn = DBUtils.getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (Exception e) {
            System.err.println("Database health check failed: " + e.getMessage());
            return false;
        }
    }
}
