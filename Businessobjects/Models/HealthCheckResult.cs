using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class HealthCheckResult
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        [Column("HealthCheckConsentID")]
        public string HealthCheckConsentID { get; set; } = null!;
        [ForeignKey("HealthCheckConsentID")]
        public HealthCheckConsentForm? HealthCheckConsent { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? BloodPressure { get; set; }
        public int? HeartRate { get; set; }
        public string? Eyesight { get; set; }
        public string? Hearing { get; set; }
        public string? OralHealth { get; set; }
        public string? Spine { get; set; }
        public string? Conclusion { get; set; }
        public DateTime? CheckUpDate { get; set; }
        public string? Checker { get; set; }
        public bool? NeedToContactParent { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? Status { get; set; }
        public string? HealthFacility { get; set; }
        public string? CheckupType { get; set; }
    }
}