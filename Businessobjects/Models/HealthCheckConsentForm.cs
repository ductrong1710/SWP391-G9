using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class HealthCheckConsentForm
    {
        [Key]
        public int Id { get; set; }
        
        public int HealthCheckPlanId { get; set; }
        [ForeignKey("HealthCheckPlanId")]
        public required PeriodicHealthCheckPlan HealthCheckPlan { get; set; }
        
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public required Profile Student { get; set; }
        
        public required string ParentId { get; set; }
        public required string ConsentStatus { get; set; }
        public DateTime ResponseTime { get; set; }
        public string? ReasonForDenial { get; set; }
    }
}