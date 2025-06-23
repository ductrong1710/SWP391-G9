using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationConsentForm
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        [Column("VaccinationPlanID")]
        public string VaccinationPlanID { get; set; } = null!;
        [ForeignKey("VaccinationPlanID")]
        public VaccinationPlan? VaccinationPlan { get; set; }
        [Required]
        [Column("StudentID")]
        public string StudentID { get; set; } = null!;
        [ForeignKey("StudentID")]
        public User? Student { get; set; }
        [Required]
        [Column("ParentID")]
        public string ParentID { get; set; } = null!;
        [ForeignKey("ParentID")]
        public User? Parent { get; set; }
        public string? ConsentStatus { get; set; }
        public DateTime? ResponseTime { get; set; }
        public string? ReasonForDenial { get; set; }
        
        public virtual VaccinationResult? VaccinationResult { get; set; }
    }
}