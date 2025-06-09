package pe.entity;

import java.util.Date;

public class HealthDeclaration {
    private int declarationId;
    private int studentId;
    private String studentName;
    private String studentClass;
    private String disease;
    private String allergy;
    private String medication;
    private String emergencyContact;
    private String emergencyPhone;
    private String additionalInfo;
    private Date declarationDate;
    private String status; // pending, approved, rejected

    // Default constructor
    public HealthDeclaration() {
    }

    // Constructor with parameters
    public HealthDeclaration(int studentId, String studentName, String studentClass,
                           String disease, String allergy, String medication,
                           String emergencyContact, String emergencyPhone, String additionalInfo) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentClass = studentClass;
        this.disease = disease;
        this.allergy = allergy;
        this.medication = medication;
        this.emergencyContact = emergencyContact;
        this.emergencyPhone = emergencyPhone;
        this.additionalInfo = additionalInfo;
        this.declarationDate = new Date();
        this.status = "pending";
    }

    // Getters and Setters
    public int getDeclarationId() {
        return declarationId;
    }

    public void setDeclarationId(int declarationId) {
        this.declarationId = declarationId;
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

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getAllergy() {
        return allergy;
    }

    public void setAllergy(String allergy) {
        this.allergy = allergy;
    }

    public String getMedication() {
        return medication;
    }

    public void setMedication(String medication) {
        this.medication = medication;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public String getEmergencyPhone() {
        return emergencyPhone;
    }

    public void setEmergencyPhone(String emergencyPhone) {
        this.emergencyPhone = emergencyPhone;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public Date getDeclarationDate() {
        return declarationDate;
    }

    public void setDeclarationDate(Date declarationDate) {
        this.declarationDate = declarationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "HealthDeclaration{" +
                "declarationId=" + declarationId +
                ", studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", studentClass='" + studentClass + '\'' +
                ", disease='" + disease + '\'' +
                ", allergy='" + allergy + '\'' +
                ", medication='" + medication + '\'' +
                ", emergencyContact='" + emergencyContact + '\'' +
                ", emergencyPhone='" + emergencyPhone + '\'' +
                ", additionalInfo='" + additionalInfo + '\'' +
                ", declarationDate=" + declarationDate +
                ", status='" + status + '\'' +
                '}';
    }
}
