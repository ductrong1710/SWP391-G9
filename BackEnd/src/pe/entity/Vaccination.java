package pe.entity;

import java.util.Date;

public class Vaccination {
    private int vaccinationId;
    private int studentId;
    private String studentName;
    private String studentClass;
    private String vaccineName;
    private Date vaccinationDate;
    private String location;
    private String batchNumber;
    private String notes;
    private String status; // scheduled, completed, missed

    // Default constructor
    public Vaccination() {
    }

    // Constructor with parameters
    public Vaccination(int studentId, String studentName, String studentClass,
                      String vaccineName, Date vaccinationDate, String location,
                      String batchNumber, String notes) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentClass = studentClass;
        this.vaccineName = vaccineName;
        this.vaccinationDate = vaccinationDate;
        this.location = location;
        this.batchNumber = batchNumber;
        this.notes = notes;
        this.status = "scheduled";
    }

    // Getters and Setters
    public int getVaccinationId() {
        return vaccinationId;
    }

    public void setVaccinationId(int vaccinationId) {
        this.vaccinationId = vaccinationId;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentClass() {
        return studentClass;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public String getVaccineName() {
        return vaccineName;
    }

    public void setVaccineName(String vaccineName) {
        this.vaccineName = vaccineName;
    }

    public Date getVaccinationDate() {
        return vaccinationDate;
    }

    public void setVaccinationDate(Date vaccinationDate) {
        this.vaccinationDate = vaccinationDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBatchNumber() {
        return batchNumber;
    }

    public void setBatchNumber(String batchNumber) {
        this.batchNumber = batchNumber;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Vaccination{" +
                "vaccinationId=" + vaccinationId +
                ", studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", studentClass='" + studentClass + '\'' +
                ", vaccineName='" + vaccineName + '\'' +
                ", vaccinationDate=" + vaccinationDate +
                ", location='" + location + '\'' +
                ", batchNumber='" + batchNumber + '\'' +
                ", notes='" + notes + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
