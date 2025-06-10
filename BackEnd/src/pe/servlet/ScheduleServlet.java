package pe.servlet;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import pe.dao.ScheduleDAO;
import pe.dao.UserDAO;
import pe.entity.Schedule;
import pe.entity.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/api/schedule")
public class ScheduleServlet extends HttpServlet {
    private ScheduleDAO scheduleDAO;
    private UserDAO userDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        super.init();
        scheduleDAO = new ScheduleDAO();
        userDAO = new UserDAO();
        gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String action = request.getParameter("action");
            
            if ("getByWeek".equals(action)) {
                String weekStartStr = request.getParameter("weekStart");
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date weekStart = dateFormat.parse(weekStartStr);
                
                List<Schedule> schedules = scheduleDAO.getSchedulesByWeek(weekStart);
                out.print(gson.toJson(schedules));
            } else if ("getMedicalStaff".equals(action)) {
                List<User> medicalStaff = userDAO.getUsersByType("medical");
                out.print(gson.toJson(medicalStaff));
            } else {
                // Mặc định lấy tất cả lịch trực
                List<Schedule> schedules = scheduleDAO.getAllSchedules();
                out.print(gson.toJson(schedules));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Schedule schedule = gson.fromJson(requestBody, Schedule.class);
            
            boolean success = scheduleDAO.addSchedule(schedule);
            
            if (success) {
                out.print("{\"message\":\"Schedule added successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to add schedule\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            Schedule schedule = gson.fromJson(requestBody, Schedule.class);
            
            boolean success = scheduleDAO.updateSchedule(schedule);
            
            if (success) {
                out.print("{\"message\":\"Schedule updated successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to update schedule\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            int scheduleId = Integer.parseInt(request.getParameter("id"));
            
            boolean success = scheduleDAO.deleteSchedule(scheduleId);
            
            if (success) {
                out.print("{\"message\":\"Schedule deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to delete schedule\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}