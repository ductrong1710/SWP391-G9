package pe.servlet;

import pe.dao.HealthDeclarationDAO;
import pe.entity.HealthDeclaration;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/health-declarations")
public class HealthDeclarationServlet extends HttpServlet {
    private HealthDeclarationDAO healthDeclarationDAO = new HealthDeclarationDAO();
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
                List<HealthDeclaration> declarations = healthDeclarationDAO.getAllHealthDeclarations();
                out.print(gson.toJson(declarations));
                
            } else if ("getById".equals(action)) {
                int declarationId = Integer.parseInt(request.getParameter("id"));
                HealthDeclaration declaration = healthDeclarationDAO.getHealthDeclarationById(declarationId);
                if (declaration != null) {
                    out.print(gson.toJson(declaration));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Health declaration not found\"}");
                }
                
            } else if ("getByStudentId".equals(action)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<HealthDeclaration> declarations = healthDeclarationDAO.getHealthDeclarationsByStudentId(studentId);
                out.print(gson.toJson(declarations));
                
            } else if ("getByStatus".equals(action)) {
                String status = request.getParameter("status");
                List<HealthDeclaration> declarations = healthDeclarationDAO.getHealthDeclarationsByStatus(status);
                out.print(gson.toJson(declarations));
                
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
            String disease = request.getParameter("disease");
            String allergy = request.getParameter("allergy");
            String medication = request.getParameter("medication");
            String emergencyContact = request.getParameter("emergencyContact");
            String emergencyPhone = request.getParameter("emergencyPhone");
            String additionalInfo = request.getParameter("additionalInfo");
            
            // Parse student info (assuming format: "studentId-studentName-studentClass")
            String[] studentInfo = studentSelect.split("-");
            int studentId = Integer.parseInt(studentInfo[0]);
            String studentName = studentInfo[1];
            String studentClass = studentInfo[2];
            
            // Create new health declaration
            HealthDeclaration declaration = new HealthDeclaration(
                studentId, studentName, studentClass, disease, allergy, 
                medication, emergencyContact, emergencyPhone, additionalInfo
            );
            
            boolean success = healthDeclarationDAO.createHealthDeclaration(declaration);
            
            if (success) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\"message\":\"Health declaration submitted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to submit health declaration\"}");
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
                int declarationId = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                
                boolean success = healthDeclarationDAO.updateHealthDeclarationStatus(declarationId, status);
                
                if (success) {
                    out.print("{\"message\":\"Health declaration status updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update status\"}");
                }
                
            } else {
                // Update full declaration
                int declarationId = Integer.parseInt(request.getParameter("id"));
                HealthDeclaration declaration = healthDeclarationDAO.getHealthDeclarationById(declarationId);
                
                if (declaration == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Health declaration not found\"}");
                    return;
                }
                
                // Update fields
                declaration.setDisease(request.getParameter("disease"));
                declaration.setAllergy(request.getParameter("allergy"));
                declaration.setMedication(request.getParameter("medication"));
                declaration.setEmergencyContact(request.getParameter("emergencyContact"));
                declaration.setEmergencyPhone(request.getParameter("emergencyPhone"));
                declaration.setAdditionalInfo(request.getParameter("additionalInfo"));
                
                boolean success = healthDeclarationDAO.updateHealthDeclaration(declaration);
                
                if (success) {
                    out.print("{\"message\":\"Health declaration updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update health declaration\"}");
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
            int declarationId = Integer.parseInt(request.getParameter("id"));
            
            boolean success = healthDeclarationDAO.deleteHealthDeclaration(declarationId);
            
            if (success) {
                out.print("{\"message\":\"Health declaration deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to delete health declaration\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}
