using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class VaccinationResultDto
    {
        [Required]
        public string ConsentFormID { get; set; } = null!;
        
        [Required]
        public string VaccineTypeID { get; set; } = null!;
        
        public DateTime? ActualVaccinationDate { get; set; }
        
        [StringLength(100)]
        public string? Performer { get; set; }
        
        [StringLength(255)]
        public string? PostVaccinationReaction { get; set; }
        
        [StringLength(255)]
        public string? Notes { get; set; }
        
        public bool? NeedToContactParent { get; set; }
        
        [Required]
        [StringLength(50)]
        public string VaccinationStatus { get; set; } = null!; // Completed, Postponed, Failed, Refused
        
        [StringLength(255)]
        public string? PostponementReason { get; set; }
        
        [StringLength(255)]
        public string? FailureReason { get; set; }
        
        [StringLength(255)]
        public string? RefusalReason { get; set; }
        
        [StringLength(100)]
        public string? RecordedBy { get; set; }
    }
} 