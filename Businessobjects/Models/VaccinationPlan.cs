using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationPlan
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        public string PlanName { get; set; } = null!;
        public DateTime? ScheduledDate { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        [Required]
        [Column("CreatorID")]
        public string CreatorID { get; set; } = null!;
        [ForeignKey("CreatorID")]
        public User? Creator { get; set; }
        
        public virtual ICollection<VaccinationConsentForm>? ConsentForms { get; set; }
        public virtual ICollection<VaccinationHealthCheck>? VaccinationHealthChecks { get; set; }
    }
}