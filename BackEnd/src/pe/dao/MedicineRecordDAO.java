package pe.dao;

import pe.entity.MedicineRecord;
import pe.utils.DBUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MedicineRecordDAO {

    // Create new medicine record
    public boolean createMedicineRecord(MedicineRecord record) {
        String sql = "INSERT INTO MedicineRecords (studentId, studentName, studentClass, medicineName, dosage, frequency, startDate, endDate, prescribedBy, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, record.getStudentId());
            ps.setString(2, record.getStudentName());
            ps.setString(3, record.getStudentClass());
            ps.setString(4, record.getMedicineName());
            ps.setString(5, record.getDosage());
            ps.setString(6, record.getFrequency());
            ps.setTimestamp(7, new Timestamp(record.getStartDate().getTime()));
            ps.setTimestamp(8, record.getEndDate() != null ? new Timestamp(record.getEndDate().getTime()) : null);
            ps.setString(9, record.getPrescribedBy());
            ps.setString(10, record.getNotes());
            ps.setString(11, record.getStatus());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Get medicine record by ID
    public MedicineRecord getMedicineRecordById(int recordId) {
        String sql = "SELECT * FROM MedicineRecords WHERE recordId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, recordId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToMedicineRecord(rs);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    // Get all medicine records
    public List<MedicineRecord> getAllMedicineRecords() {
        List<MedicineRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM MedicineRecords ORDER BY startDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                records.add(mapResultSetToMedicineRecord(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return records;
    }

    // Get medicine records by student ID
    public List<MedicineRecord> getMedicineRecordsByStudentId(int studentId) {
        List<MedicineRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM MedicineRecords WHERE studentId = ? ORDER BY startDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                records.add(mapResultSetToMedicineRecord(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return records;
    }

    // Get medicine records by status
    public List<MedicineRecord> getMedicineRecordsByStatus(String status) {
        List<MedicineRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM MedicineRecords WHERE status = ? ORDER BY startDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                records.add(mapResultSetToMedicineRecord(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return records;
    }

    // Get active medicine records by student ID
    public List<MedicineRecord> getActiveMedicineRecordsByStudentId(int studentId) {
        List<MedicineRecord> records = new ArrayList<>();
        String sql = "SELECT * FROM MedicineRecords WHERE studentId = ? AND status = 'active' ORDER BY startDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                records.add(mapResultSetToMedicineRecord(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return records;
    }

    // Update medicine record
    public boolean updateMedicineRecord(MedicineRecord record) {
        String sql = "UPDATE MedicineRecords SET studentName = ?, studentClass = ?, medicineName = ?, dosage = ?, frequency = ?, startDate = ?, endDate = ?, prescribedBy = ?, notes = ?, status = ? WHERE recordId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, record.getStudentName());
            ps.setString(2, record.getStudentClass());
            ps.setString(3, record.getMedicineName());
            ps.setString(4, record.getDosage());
            ps.setString(5, record.getFrequency());
            ps.setTimestamp(6, new Timestamp(record.getStartDate().getTime()));
            ps.setTimestamp(7, record.getEndDate() != null ? new Timestamp(record.getEndDate().getTime()) : null);
            ps.setString(8, record.getPrescribedBy());
            ps.setString(9, record.getNotes());
            ps.setString(10, record.getStatus());
            ps.setInt(11, record.getRecordId());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Update medicine record status
    public boolean updateMedicineRecordStatus(int recordId, String status) {
        String sql = "UPDATE MedicineRecords SET status = ? WHERE recordId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ps.setInt(2, recordId);
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Delete medicine record
    public boolean deleteMedicineRecord(int recordId) {
        String sql = "DELETE FROM MedicineRecords WHERE recordId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, recordId);
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper method to map ResultSet to MedicineRecord object
    private MedicineRecord mapResultSetToMedicineRecord(ResultSet rs) throws SQLException {
        MedicineRecord record = new MedicineRecord();
        record.setRecordId(rs.getInt("recordId"));
        record.setStudentId(rs.getInt("studentId"));
        record.setStudentName(rs.getString("studentName"));
        record.setStudentClass(rs.getString("studentClass"));
        record.setMedicineName(rs.getString("medicineName"));
        record.setDosage(rs.getString("dosage"));
        record.setFrequency(rs.getString("frequency"));
        record.setStartDate(rs.getTimestamp("startDate"));
        record.setEndDate(rs.getTimestamp("endDate"));
        record.setPrescribedBy(rs.getString("prescribedBy"));
        record.setNotes(rs.getString("notes"));
        record.setStatus(rs.getString("status"));
        return record;
    }
}
