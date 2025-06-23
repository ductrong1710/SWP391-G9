using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Vaccination_Health_Check")]
    public class VaccinationHealthCheck
    {
        [Key]
        [Column("ID", TypeName = "char(6)")]
        public string Id { get; set; }

        [Column("VaccinationPlanID", TypeName = "char(6)")]
        public string? VaccinationPlanId { get; set; }

        [Column("StudentID", TypeName = "char(6)")]
        public string? StudentId { get; set; }

        [Column("ParentID", TypeName = "char(6)")]
        public string? ParentId { get; set; }

        [Column(TypeName = "date")]
        public DateTime? NotificationDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ResponseDate { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Status { get; set; } // Pending, Approved, Denied, Completed

        [Column(TypeName = "nvarchar(255)")]
        public string? ParentNotes { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? MedicalStaffNotes { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasAllergies { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? AllergyDetails { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasChronicConditions { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? ChronicConditionDetails { get; set; }

        [Column(TypeName = "bit")]
        public bool? HasRecentIllness { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? RecentIllnessDetails { get; set; }

        [Column(TypeName = "bit")]
        public bool? IsEligibleForVaccination { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? IneligibilityReason { get; set; }

        [ForeignKey("VaccinationPlanId")]
        public virtual VaccinationPlan VaccinationPlan { get; set; }

        [ForeignKey("StudentId")]
        public virtual User Student { get; set; }

        [ForeignKey("ParentId")]
        public virtual User Parent { get; set; }

        public virtual ICollection<VaccinationHealthCheckResult> HealthCheckResults { get; set; } = new List<VaccinationHealthCheckResult>();
    }
} 