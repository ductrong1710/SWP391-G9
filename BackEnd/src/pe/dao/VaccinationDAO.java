package pe.dao;

import pe.entity.Vaccination;
import pe.utils.DBUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class VaccinationDAO {

    // Create new vaccination record
    public boolean createVaccination(Vaccination vaccination) {
        String sql = "INSERT INTO Vaccinations (studentId, studentName, studentClass, vaccineName, vaccinationDate, location, batchNumber, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, vaccination.getStudentId());
            ps.setString(2, vaccination.getStudentName());
            ps.setString(3, vaccination.getStudentClass());
            ps.setString(4, vaccination.getVaccineName());
            ps.setTimestamp(5, new Timestamp(vaccination.getVaccinationDate().getTime()));
            ps.setString(6, vaccination.getLocation());
            ps.setString(7, vaccination.getBatchNumber());
            ps.setString(8, vaccination.getNotes());
            ps.setString(9, vaccination.getStatus());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Get vaccination by ID
    public Vaccination getVaccinationById(int vaccinationId) {
        String sql = "SELECT * FROM Vaccinations WHERE vaccinationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, vaccinationId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToVaccination(rs);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    // Get all vaccinations
    public List<Vaccination> getAllVaccinations() {
        List<Vaccination> vaccinations = new ArrayList<>();
        String sql = "SELECT * FROM Vaccinations ORDER BY vaccinationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                vaccinations.add(mapResultSetToVaccination(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return vaccinations;
    }

    // Get vaccinations by student ID
    public List<Vaccination> getVaccinationsByStudentId(int studentId) {
        List<Vaccination> vaccinations = new ArrayList<>();
        String sql = "SELECT * FROM Vaccinations WHERE studentId = ? ORDER BY vaccinationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                vaccinations.add(mapResultSetToVaccination(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return vaccinations;
    }

    // Get vaccinations by status
    public List<Vaccination> getVaccinationsByStatus(String status) {
        List<Vaccination> vaccinations = new ArrayList<>();
        String sql = "SELECT * FROM Vaccinations WHERE status = ? ORDER BY vaccinationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                vaccinations.add(mapResultSetToVaccination(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return vaccinations;
    }

    // Get vaccinations by vaccine name
    public List<Vaccination> getVaccinationsByVaccineName(String vaccineName) {
        List<Vaccination> vaccinations = new ArrayList<>();
        String sql = "SELECT * FROM Vaccinations WHERE vaccineName = ? ORDER BY vaccinationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, vaccineName);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                vaccinations.add(mapResultSetToVaccination(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return vaccinations;
    }

    // Update vaccination
    public boolean updateVaccination(Vaccination vaccination) {
        String sql = "UPDATE Vaccinations SET studentName = ?, studentClass = ?, vaccineName = ?, vaccinationDate = ?, location = ?, batchNumber = ?, notes = ?, status = ? WHERE vaccinationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, vaccination.getStudentName());
            ps.setString(2, vaccination.getStudentClass());
            ps.setString(3, vaccination.getVaccineName());
            ps.setTimestamp(4, new Timestamp(vaccination.getVaccinationDate().getTime()));
            ps.setString(5, vaccination.getLocation());
            ps.setString(6, vaccination.getBatchNumber());
            ps.setString(7, vaccination.getNotes());
            ps.setString(8, vaccination.getStatus());
            ps.setInt(9, vaccination.getVaccinationId());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Update vaccination status
    public boolean updateVaccinationStatus(int vaccinationId, String status) {
        String sql = "UPDATE Vaccinations SET status = ? WHERE vaccinationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ps.setInt(2, vaccinationId);
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Delete vaccination
    public boolean deleteVaccination(int vaccinationId) {
        String sql = "DELETE FROM Vaccinations WHERE vaccinationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, vaccinationId);
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper method to map ResultSet to Vaccination object
    private Vaccination mapResultSetToVaccination(ResultSet rs) throws SQLException {
        Vaccination vaccination = new Vaccination();
        vaccination.setVaccinationId(rs.getInt("vaccinationId"));
        vaccination.setStudentId(rs.getInt("studentId"));
        vaccination.setStudentName(rs.getString("studentName"));
        vaccination.setStudentClass(rs.getString("studentClass"));
        vaccination.setVaccineName(rs.getString("vaccineName"));
        vaccination.setVaccinationDate(rs.getTimestamp("vaccinationDate"));
        vaccination.setLocation(rs.getString("location"));
        vaccination.setBatchNumber(rs.getString("batchNumber"));
        vaccination.setNotes(rs.getString("notes"));
        vaccination.setStatus(rs.getString("status"));
        return vaccination;
    }
}
