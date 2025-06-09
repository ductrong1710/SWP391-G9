package pe.dao;

import pe.entity.HealthDeclaration;
import pe.utils.DBUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HealthDeclarationDAO {

    // Create new health declaration
    public boolean createHealthDeclaration(HealthDeclaration declaration) {
        String sql = "INSERT INTO HealthDeclarations (studentId, studentName, studentClass, disease, allergy, medication, emergencyContact, emergencyPhone, additionalInfo, declarationDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, declaration.getStudentId());
            ps.setString(2, declaration.getStudentName());
            ps.setString(3, declaration.getStudentClass());
            ps.setString(4, declaration.getDisease());
            ps.setString(5, declaration.getAllergy());
            ps.setString(6, declaration.getMedication());
            ps.setString(7, declaration.getEmergencyContact());
            ps.setString(8, declaration.getEmergencyPhone());
            ps.setString(9, declaration.getAdditionalInfo());
            ps.setTimestamp(10, new Timestamp(declaration.getDeclarationDate().getTime()));
            ps.setString(11, declaration.getStatus());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Get health declaration by ID
    public HealthDeclaration getHealthDeclarationById(int declarationId) {
        String sql = "SELECT * FROM HealthDeclarations WHERE declarationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, declarationId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToHealthDeclaration(rs);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    // Get all health declarations
    public List<HealthDeclaration> getAllHealthDeclarations() {
        List<HealthDeclaration> declarations = new ArrayList<>();
        String sql = "SELECT * FROM HealthDeclarations ORDER BY declarationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                declarations.add(mapResultSetToHealthDeclaration(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return declarations;
    }

    // Get health declarations by student ID
    public List<HealthDeclaration> getHealthDeclarationsByStudentId(int studentId) {
        List<HealthDeclaration> declarations = new ArrayList<>();
        String sql = "SELECT * FROM HealthDeclarations WHERE studentId = ? ORDER BY declarationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                declarations.add(mapResultSetToHealthDeclaration(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return declarations;
    }

    // Get health declarations by status
    public List<HealthDeclaration> getHealthDeclarationsByStatus(String status) {
        List<HealthDeclaration> declarations = new ArrayList<>();
        String sql = "SELECT * FROM HealthDeclarations WHERE status = ? ORDER BY declarationDate DESC";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                declarations.add(mapResultSetToHealthDeclaration(rs));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return declarations;
    }

    // Update health declaration
    public boolean updateHealthDeclaration(HealthDeclaration declaration) {
        String sql = "UPDATE HealthDeclarations SET studentName = ?, studentClass = ?, disease = ?, allergy = ?, medication = ?, emergencyContact = ?, emergencyPhone = ?, additionalInfo = ?, status = ? WHERE declarationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, declaration.getStudentName());
            ps.setString(2, declaration.getStudentClass());
            ps.setString(3, declaration.getDisease());
            ps.setString(4, declaration.getAllergy());
            ps.setString(5, declaration.getMedication());
            ps.setString(6, declaration.getEmergencyContact());
            ps.setString(7, declaration.getEmergencyPhone());
            ps.setString(8, declaration.getAdditionalInfo());
            ps.setString(9, declaration.getStatus());
            ps.setInt(10, declaration.getDeclarationId());
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Update health declaration status
    public boolean updateHealthDeclarationStatus(int declarationId, String status) {
        String sql = "UPDATE HealthDeclarations SET status = ? WHERE declarationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setString(1, status);
            ps.setInt(2, declarationId);
            
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Delete health declaration
    public boolean deleteHealthDeclaration(int declarationId) {
        String sql = "DELETE FROM HealthDeclarations WHERE declarationId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, declarationId);
            return ps.executeUpdate() > 0;
            
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper method to map ResultSet to HealthDeclaration object
    private HealthDeclaration mapResultSetToHealthDeclaration(ResultSet rs) throws SQLException {
        HealthDeclaration declaration = new HealthDeclaration();
        declaration.setDeclarationId(rs.getInt("declarationId"));
        declaration.setStudentId(rs.getInt("studentId"));
        declaration.setStudentName(rs.getString("studentName"));
        declaration.setStudentClass(rs.getString("studentClass"));
        declaration.setDisease(rs.getString("disease"));
        declaration.setAllergy(rs.getString("allergy"));
        declaration.setMedication(rs.getString("medication"));
        declaration.setEmergencyContact(rs.getString("emergencyContact"));
        declaration.setEmergencyPhone(rs.getString("emergencyPhone"));
        declaration.setAdditionalInfo(rs.getString("additionalInfo"));
        declaration.setDeclarationDate(rs.getTimestamp("declarationDate"));
        declaration.setStatus(rs.getString("status"));
        return declaration;
    }
}
