package pe.dao;

import pe.entity.Schedule;
import pe.utils.DBUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ScheduleDAO {
    
    public List<Schedule> getAllSchedules() throws SQLException, ClassNotFoundException {
        List<Schedule> schedules = new ArrayList<>();
        String sql = "SELECT s.*, u.firstName + ' ' + u.lastName AS staffName, " +
                     "u.specialty AS staffSpecialty, u.email AS staffEmail, u.phone AS staffPhone " +
                     "FROM Schedules s " +
                     "JOIN Users u ON s.staffId = u.userId " +
                     "ORDER BY s.weekStart DESC, s.day, s.time";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Schedule schedule = mapSchedule(rs);
                schedules.add(schedule);
            }
        }
        
        return schedules;
    }
    
    public List<Schedule> getSchedulesByWeek(Date weekStart) throws SQLException, ClassNotFoundException {
        List<Schedule> schedules = new ArrayList<>();
        
        // Tính ngày kết thúc tuần (weekStart + 6 ngày) - removed unused variable
        
        String sql = "SELECT s.*, u.firstName + ' ' + u.lastName AS staffName, " +
                     "u.specialty AS staffSpecialty, u.email AS staffEmail, u.phone AS staffPhone " +
                     "FROM Schedules s " +
                     "JOIN Users u ON s.staffId = u.userId " +
                     "WHERE s.weekStart = ? " +
                     "ORDER BY s.day, s.time";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setDate(1, new java.sql.Date(weekStart.getTime()));
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Schedule schedule = mapSchedule(rs);
                    schedules.add(schedule);
                }
            }
        }
        
        return schedules;
    }
    
    public Schedule getScheduleById(int scheduleId) throws SQLException, ClassNotFoundException {
        String sql = "SELECT s.*, u.firstName + ' ' + u.lastName AS staffName, " +
                     "u.specialty AS staffSpecialty, u.email AS staffEmail, u.phone AS staffPhone " +
                     "FROM Schedules s " +
                     "JOIN Users u ON s.staffId = u.userId " +
                     "WHERE s.scheduleId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, scheduleId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapSchedule(rs);
                }
            }
        }
        
        return null;
    }
    
    public boolean addSchedule(Schedule schedule) throws SQLException, ClassNotFoundException {
        String sql = "INSERT INTO Schedules (staffId, day, time, weekStart) VALUES (?, ?, ?, ?)";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, schedule.getStaffId());
            stmt.setString(2, schedule.getDay());
            stmt.setString(3, schedule.getTime());
            stmt.setDate(4, new java.sql.Date(schedule.getWeekStart().getTime()));
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
    
    public boolean updateSchedule(Schedule schedule) throws SQLException, ClassNotFoundException {
        String sql = "UPDATE Schedules SET staffId = ?, day = ?, time = ?, weekStart = ? WHERE scheduleId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, schedule.getStaffId());
            stmt.setString(2, schedule.getDay());
            stmt.setString(3, schedule.getTime());
            stmt.setDate(4, new java.sql.Date(schedule.getWeekStart().getTime()));
            stmt.setInt(5, schedule.getScheduleId());
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
    
    public boolean deleteSchedule(int scheduleId) throws SQLException, ClassNotFoundException {
        String sql = "DELETE FROM Schedules WHERE scheduleId = ?";
        
        try (Connection conn = DBUtils.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, scheduleId);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
    
    private Schedule mapSchedule(ResultSet rs) throws SQLException {
        Schedule schedule = new Schedule();
        schedule.setScheduleId(rs.getInt("scheduleId"));
        schedule.setStaffId(rs.getInt("staffId"));
        schedule.setDay(rs.getString("day"));
        schedule.setTime(rs.getString("time"));
        schedule.setWeekStart(rs.getDate("weekStart"));
        
        // Thông tin bổ sung
        schedule.setStaffName(rs.getString("staffName"));
        schedule.setStaffSpecialty(rs.getString("staffSpecialty"));
        schedule.setStaffEmail(rs.getString("staffEmail"));
        schedule.setStaffPhone(rs.getString("staffPhone"));
        
        return schedule;
    }
}
