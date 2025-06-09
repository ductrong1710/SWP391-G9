package pe.servlet;

import pe.dao.MedicineRecordDAO;
import pe.entity.MedicineRecord;
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

@WebServlet("/medicine-records")
public class MedicineRecordServlet extends HttpServlet {
    private MedicineRecordDAO medicineRecordDAO = new MedicineRecordDAO();
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
                List<MedicineRecord> records = medicineRecordDAO.getAllMedicineRecords();
                out.print(gson.toJson(records));
                
            } else if ("getById".equals(action)) {
                int recordId = Integer.parseInt(request.getParameter("id"));
                MedicineRecord record = medicineRecordDAO.getMedicineRecordById(recordId);
                if (record != null) {
                    out.print(gson.toJson(record));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Medicine record not found\"}");
                }
                
            } else if ("getByStudentId".equals(action)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<MedicineRecord> records = medicineRecordDAO.getMedicineRecordsByStudentId(studentId);
                out.print(gson.toJson(records));
                
            } else if ("getActiveByStudentId".equals(action)) {
                int studentId = Integer.parseInt(request.getParameter("studentId"));
                List<MedicineRecord> records = medicineRecordDAO.getActiveMedicineRecordsByStudentId(studentId);
                out.print(gson.toJson(records));
                
            } else if ("getByStatus".equals(action)) {
                String status = request.getParameter("status");
                List<MedicineRecord> records = medicineRecordDAO.getMedicineRecordsByStatus(status);
                out.print(gson.toJson(records));
                
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
            String medicineName = request.getParameter("medicineName");
            String dosage = request.getParameter("dosage");
            String frequency = request.getParameter("frequency");
            String startDateStr = request.getParameter("startDate");
            String endDateStr = request.getParameter("endDate");
            String prescribedBy = request.getParameter("prescribedBy");
            String notes = request.getParameter("notes");
            
            // Parse student info (assuming format: "studentId-studentName-studentClass")
            String[] studentInfo = studentSelect.split("-");
            int studentId = Integer.parseInt(studentInfo[0]);
            String studentName = studentInfo[1];
            String studentClass = studentInfo[2];
            
            // Parse dates
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = dateFormat.parse(startDateStr);
            Date endDate = null;
            if (endDateStr != null && !endDateStr.isEmpty()) {
                endDate = dateFormat.parse(endDateStr);
            }
            
            // Create new medicine record
            MedicineRecord record = new MedicineRecord(
                studentId, studentName, studentClass, medicineName, dosage, 
                frequency, startDate, endDate, prescribedBy, notes
            );
            
            boolean success = medicineRecordDAO.createMedicineRecord(record);
            
            if (success) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\"message\":\"Medicine record created successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to create medicine record\"}");
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
                int recordId = Integer.parseInt(request.getParameter("id"));
                String status = request.getParameter("status");
                
                boolean success = medicineRecordDAO.updateMedicineRecordStatus(recordId, status);
                
                if (success) {
                    out.print("{\"message\":\"Medicine record status updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update status\"}");
                }
                
            } else {
                // Update full medicine record
                int recordId = Integer.parseInt(request.getParameter("id"));
                MedicineRecord record = medicineRecordDAO.getMedicineRecordById(recordId);
                
                if (record == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"error\":\"Medicine record not found\"}");
                    return;
                }
                
                // Update fields
                record.setMedicineName(request.getParameter("medicineName"));
                record.setDosage(request.getParameter("dosage"));
                record.setFrequency(request.getParameter("frequency"));
                record.setPrescribedBy(request.getParameter("prescribedBy"));
                record.setNotes(request.getParameter("notes"));
                record.setStatus(request.getParameter("status"));
                
                // Parse dates if provided
                String startDateStr = request.getParameter("startDate");
                if (startDateStr != null && !startDateStr.isEmpty()) {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date startDate = dateFormat.parse(startDateStr);
                    record.setStartDate(startDate);
                }
                
                String endDateStr = request.getParameter("endDate");
                if (endDateStr != null && !endDateStr.isEmpty()) {
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    Date endDate = dateFormat.parse(endDateStr);
                    record.setEndDate(endDate);
                }
                
                boolean success = medicineRecordDAO.updateMedicineRecord(record);
                
                if (success) {
                    out.print("{\"message\":\"Medicine record updated successfully\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print("{\"error\":\"Failed to update medicine record\"}");
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
            int recordId = Integer.parseInt(request.getParameter("id"));
            
            boolean success = medicineRecordDAO.deleteMedicineRecord(recordId);
            
            if (success) {
                out.print("{\"message\":\"Medicine record deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\":\"Failed to delete medicine record\"}");
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
        }
        
        out.flush();
    }
}
