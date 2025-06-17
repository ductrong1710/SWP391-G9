using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationResult
    {
        [Key]
        public int Id { get; set; }
        
        public int ConsentFormId { get; set; }
        [ForeignKey("ConsentFormId")]
        public required VaccinationConsentForm ConsentForm { get; set; }
        
        public int VaccineTypeId { get; set; }
        [ForeignKey("VaccineTypeId")]
        public required VaccineType VaccineType { get; set; }
        
        public required DateTime ActualVaccinationDate { get; set; }
        public required string Performer { get; set; }
        public string? PostVaccinationReaction { get; set; }
        public string? Notes { get; set; }
    }
}