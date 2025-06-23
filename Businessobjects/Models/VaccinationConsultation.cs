using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Vaccination_Consultation")]
    public class VaccinationConsultation
    {
        [Key]
        [Column("ID", TypeName = "char(6)")]
        public string Id { get; set; }

        [Column("HealthCheckResultID", TypeName = "char(6)")]
        public string? HealthCheckResultId { get; set; }

        [Column("StudentID", TypeName = "char(6)")]
        public string? StudentId { get; set; }

        [Column("ParentID", TypeName = "char(6)")]
        public string? ParentId { get; set; }

        [Column("MedicalStaffID", TypeName = "char(6)")]
        public string? MedicalStaffId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? ScheduledDateTime { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? ConsultationType { get; set; } // InPerson, Phone, Video

        [Column(TypeName = "nvarchar(50)")]
        public string? Status { get; set; } // Scheduled, Completed, Cancelled, NoShow

        [Column(TypeName = "nvarchar(255)")]
        public string? Reason { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Location { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Notes { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? ConsultationOutcome { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Recommendations { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CompletedDateTime { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? CancellationReason { get; set; }

        [ForeignKey("HealthCheckResultId")]
        public virtual VaccinationHealthCheckResult HealthCheckResult { get; set; }

        [ForeignKey("StudentId")]
        public virtual User Student { get; set; }

        [ForeignKey("ParentId")]
        public virtual User Parent { get; set; }

        [ForeignKey("MedicalStaffId")]
        public virtual User MedicalStaff { get; set; }
    }
} 