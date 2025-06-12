package pe.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import pe.utils.DBUtils;

/**
 * Servlet to check system health and API connectivity
 */
@WebServlet("/api/system-health")
public class SystemHealthServlet extends HttpServlet {
    
    /**
     * Handles the HTTP GET method - returns system status
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // Kiểm tra kết nối cơ sở dữ liệu
            boolean dbConnected = false;
            String dbMessage = "Chưa kiểm tra";
            
            try {
                Connection conn = DBUtils.getConnection();
                dbConnected = conn != null && !conn.isClosed();
                dbMessage = dbConnected ? "Kết nối thành công" : "Kết nối thất bại";
                if (conn != null) conn.close();
            } catch (Exception e) {
                dbConnected = false;
                dbMessage = "Lỗi: " + e.getMessage();
            }
            
            // Thông tin hệ thống
            Runtime runtime = Runtime.getRuntime();
            long freeMemory = runtime.freeMemory() / (1024 * 1024);
            long totalMemory = runtime.totalMemory() / (1024 * 1024);
            
            // Trả về trạng thái hệ thống
            out.print("{" +
                "\"status\":\"ok\"," +
                "\"timestamp\":\"" + new java.util.Date() + "\"," +
                "\"server\":\"" + request.getServerName() + ":" + request.getServerPort() + "\"," +
                "\"database\":{" +
                    "\"connected\":" + dbConnected + "," +
                    "\"message\":\"" + dbMessage + "\"" +
                "}," +
                "\"memory\":{" +
                    "\"free\":" + freeMemory + "," +
                    "\"total\":" + totalMemory + "," +
                    "\"unit\":\"MB\"" +
                "}," +
                "\"cors\":\"enabled\"," +
                "\"message\":\"Hệ thống đang hoạt động\"" +
            "}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        } finally {
            out.flush();
        }
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Hỗ trợ CORS preflight request
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
