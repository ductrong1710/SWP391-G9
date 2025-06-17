using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationConsentForm
    {
        [Key]
        public int Id { get; set; }
        
        public int VaccinationPlanId { get; set; }
        [ForeignKey("VaccinationPlanId")]
        public required VaccinationPlan VaccinationPlan { get; set; }
        
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public required Profile Student { get; set; }
        
        public required string ParentId { get; set; }
        public required string ConsentStatus { get; set; }
        public DateTime ResponseTime { get; set; }
        public string? ReasonForDenial { get; set; }
        
        public virtual VaccinationResult? VaccinationResult { get; set; }
    }
}