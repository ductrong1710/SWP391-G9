using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccinationResult
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        [Column("ConsentFormID")]
        public string ConsentFormID { get; set; } = null!;
        [ForeignKey("ConsentFormID")]
        public VaccinationConsentForm? ConsentForm { get; set; }
        [Required]
        [Column("VaccineTypeID")]
        public string VaccineTypeID { get; set; } = null!;
        [ForeignKey("VaccineTypeID")]
        public VaccineType? VaccineType { get; set; }
        public DateTime? ActualVaccinationDate { get; set; }
        public string? Performer { get; set; }
        public string? PostVaccinationReaction { get; set; }
        public string? Notes { get; set; }
    }
}