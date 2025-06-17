using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationPlan
    {
        [Key]
        public int Id { get; set; }
        public required string PlanName { get; set; }
        public required DateTime ScheduledDate { get; set; }
        public string? Description { get; set; }
        public required string Status { get; set; }
        
        public Guid CreatorId { get; set; }
        [ForeignKey("CreatorId")]
        public required User Creator { get; set; }
        
        public virtual ICollection<VaccinationConsentForm>? ConsentForms { get; set; }
    }
}