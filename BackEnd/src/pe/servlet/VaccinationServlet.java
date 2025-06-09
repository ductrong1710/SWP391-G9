package pe.servlet;

import pe.dao.VaccinationDAO;
import pe.entity.Vaccination;
import com.google.gson.Gson;

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

@WebServlet("/vaccinations")
public class VaccinationServlet extends HttpServlet {
    private VaccinationDAO vaccinationDAO = new VaccinationDAO();
    private Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String action = request.getParameter("action");
        
        try {
            if ("getAll".equals(action)) {
                List<Vaccination> vaccinations = vaccinationDAO.getAllVaccinations();
                out.print(gson.toJson(vaccinations));
                
            } else if ("getById".equals(action)) {
                int vaccinationId = Integer.parseInt(request.getParameter("id"));
                Vaccination vaccination = vaccinationDAO.getVaccinationById(vaccinationId);
                if (vaccination != null) {
                    out.print(gson.toJson(vaccination));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Vaccination record not found\"}");
                }
                
            } else if ("getByStudentId".equals(action)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<Vaccination> vaccinations = vaccinationDAO.getVaccinationsByStudentId(studentId);
                out.print(gson.toJson(vaccinations));
                
            } else if ("getByStatus".equals(action)) {
                String status = request.getParameter("status");
                List<Vaccination> vaccinations = vaccinationDAO.getVaccinationsByStatus(status);
                out.print(gson.toJson(vaccinations));
                
            } else if ("getByVaccineName".equals(action)) {
                String vaccineName = request.getParameter("vaccineName");
                List<Vaccination> vaccinations = vaccinationDAO.getVaccinationsByVaccineName(vaccineName);
                out.print(gson.toJson(vaccinations));
                
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"error\":\"Invalid action\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            // Get form parameters
            String studentSelect = request.getParameter("studentSelect");
            String vaccineName = request.getParameter("vaccineName");
            String vaccinationDateStr = request.getParameter("vaccinationDate");
            String location = request.getParameter("location");
            String batchNumber = request.getParameter("batchNumber");
            String notes = request.getParameter("notes");
            
            // Parse student info (assuming format: "studentId-studentName-studentClass")
            String[] studentInfo = studentSelect.split("-");
            int studentId = Integer.parseInt(studentInfo[0]);
            String studentName = studentInfo[1];
            String studentClass = studentInfo[2];
            
            // Parse vaccination date
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date vaccinationDate = dateFormat.parse(vaccinationDateStr);
            
            // Create new vaccination record
            Vaccination vaccination = new Vaccination(
                studentId, studentName, studentClass, vaccineName, 
                vaccinationDate, location, batchNumber, notes
            );
            
            boolean success = vaccinationDAO.createVaccination(vaccination);
            
            if (success) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\"message\":\"Vaccination record created successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to create vaccination record\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            
            if ("updateStatus".equals(action)) {
                int vaccinationId = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                
                boolean success = vaccinationDAO.updateVaccinationStatus(vaccinationId, status);
                
                if (success) {
                    out.print("{\"message\":\"Vaccination status updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update status\"}");
                }
                
            } else {
                // Update full vaccination record
                int vaccinationId = Integer.parseInt(request.getParameter("id"));
                Vaccination vaccination = vaccinationDAO.getVaccinationById(vaccinationId);
                
                if (vaccination == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Vaccination record not found\"}");
                    return;
                }
                
                // Update fields
                vaccination.setVaccineName(request.getParameter("vaccineName"));
                vaccination.setLocation(request.getParameter("location"));
                vaccination.setBatchNumber(request.getParameter("batchNumber"));
                vaccination.setNotes(request.getParameter("notes"));
                vaccination.setStatus(request.getParameter("status"));
                
                // Parse vaccination date if provided
                String vaccinationDateStr = request.getParameter("vaccinationDate");
                if (vaccinationDateStr != null && !vaccinationDateStr.isEmpty()) {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date vaccinationDate = dateFormat.parse(vaccinationDateStr);
                    vaccination.setVaccinationDate(vaccinationDate);
                }
                
                boolean success = vaccinationDAO.updateVaccination(vaccination);
                
                if (success) {
                    out.print("{\"message\":\"Vaccination record updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update vaccination record\"}");
                }
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            int vaccinationId = Integer.parseInt(request.getParameter("id"));
            
            boolean success = vaccinationDAO.deleteVaccination(vaccinationId);
            
            if (success) {
                out.print("{\"message\":\"Vaccination record deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to delete vaccination record\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}
