package pe.servlet;

import java.io.IOException;
import java.io.PrintWriter;
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
            try {
                java.sql.Connection conn = DBUtils.getConnection();
                dbConnected = conn != null && conn.isValid(5);
                if (conn != null) conn.close();
            } catch (Exception e) {
                dbConnected = false;
            }
            
            // Trả về trạng thái hệ thống
            out.print("{\"status\":\"ok\",\"database\":" + dbConnected + 
                     ",\"message\":\"Hệ thống đang hoạt động\",\"timestamp\":\"" + 
                     new java.util.Date() + "\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        } finally {
            out.flush();
        }
    }
}
