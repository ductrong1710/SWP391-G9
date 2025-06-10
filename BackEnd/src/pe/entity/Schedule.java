package pe.entity;

import java.util.Date;

public class Schedule {
    private int scheduleId;
    private int staffId;
    private String day;
    private String time;
    private Date weekStart;
    private String staffName;
    private String staffSpecialty;
    private String staffEmail;
    private String staffPhone;

    public Schedule() {
    }

    public Schedule(int scheduleId, int staffId, String day, String time, Date weekStart) {
        this.scheduleId = scheduleId;
        this.staffId = staffId;
        this.day = day;
        this.time = time;
        this.weekStart = weekStart;
    }

    public int getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(int scheduleId) {
        this.scheduleId = scheduleId;
    }

    public int getStaffId() {
        return staffId;
    }

    public void setStaffId(int staffId) {
        this.staffId = staffId;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Date getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(Date weekStart) {
        this.weekStart = weekStart;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getStaffSpecialty() {
        return staffSpecialty;
    }

    public void setStaffSpecialty(String staffSpecialty) {
        this.staffSpecialty = staffSpecialty;
    }

    public String getStaffEmail() {
        return staffEmail;
    }

    public void setStaffEmail(String staffEmail) {
        this.staffEmail = staffEmail;
    }

    public String getStaffPhone() {
        return staffPhone;
    }

    public void setStaffPhone(String staffPhone) {
        this.staffPhone = staffPhone;
    }
}