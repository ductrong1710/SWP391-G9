using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Vaccination_Health_Check_Result")]
    public class VaccinationHealthCheckResult
    {
        [Key]
        [Column("ID", TypeName = "char(6)")]
        public string Id { get; set; }

        [Column("HealthCheckID", TypeName = "char(6)")]
        public string? HealthCheckId { get; set; }

        [Column("MedicalStaffID", TypeName = "char(6)")]
        public string? MedicalStaffId { get; set; }

        [Column(TypeName = "date")]
        public DateTime? CheckDate { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Temperature { get; set; }

        [Column(TypeName = "int")]
        public int? BloodPressureSystolic { get; set; }

        [Column(TypeName = "int")]
        public int? BloodPressureDiastolic { get; set; }

        [Column(TypeName = "int")]
        public int? HeartRate { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? GeneralCondition { get; set; } // Good, Fair, Poor

        [Column(TypeName = "bit")]
        public bool? HasFever { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasCough { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasFatigue { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasOtherSymptoms { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? OtherSymptomsDetails { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? VaccinationRecommendation { get; set; } // Approved, Deferred, NotRecommended

        [Column(TypeName = "nvarchar(255)")]
        public string? RecommendationReason { get; set; }

        [Column(TypeName = "date")]
        public DateTime? FollowUpDate { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? FollowUpNotes { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? MedicalStaffNotes { get; set; }

        [ForeignKey("HealthCheckId")]
        public virtual VaccinationHealthCheck HealthCheck { get; set; }

        [ForeignKey("MedicalStaffId")]
        public virtual User MedicalStaff { get; set; }
    }
} 