using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class PeriodicHealthCheckPlan
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        public string PlanName { get; set; } = null!;
        public DateTime? ScheduleDate { get; set; }
        public string? CheckupContent { get; set; }
        public string? Status { get; set; }
        [Required]
        [Column("CreatorID")]
        public string CreatorID { get; set; } = null!;
        [ForeignKey("CreatorID")]
        public User? Creator { get; set; }
        
        public virtual ICollection<HealthCheckConsentForm>? ConsentForms { get; set; }
    }
}