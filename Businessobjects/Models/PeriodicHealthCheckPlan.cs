using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class PeriodicHealthCheckPlan
    {
        [Key]
        public int Id { get; set; }
        public required string PlanName { get; set; }
        public required DateTime ScheduleDate { get; set; }
        public required string CheckupContent { get; set; }
        public required string Status { get; set; }
        
        public Guid CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public required User Creator { get; set; }
        
        public virtual ICollection<HealthCheckConsentForm>? ConsentForms { get; set; }
    }
}