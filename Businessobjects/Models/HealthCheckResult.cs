using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class HealthCheckResult
    {
        [Key]
        public int Id { get; set; }

        public int HealthCheckConsentId { get; set; }
        [ForeignKey("HealthCheckConsentId")]
        public required HealthCheckConsentForm HealthCheckConsent { get; set; }

        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public required string BloodPressure { get; set; }
        public int HeartRate { get; set; }
        public required string Eyesight { get; set; }
        public required string Hearing { get; set; }
        public required string OralHealth { get; set; }
        public required string Spine { get; set; }
        public required string Conclusion { get; set; }
        public DateTime CheckUpDate { get; set; }
        public required string Checker { get; set; }
        public bool ConsultationRecommended { get; set; }
        public DateTime? ConsultationAppointmentDate { get; set; }
    }
}