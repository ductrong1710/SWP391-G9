using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Businessobjects.Models
{
    [Table("Vaccination_Result")]
    public class VaccinationResult
    {
        [Key]
        [Column("ID")]
        public string? ID { get; set; }
        
        [Required]
        [Column("ConsentFormID")]
        public string ConsentFormID { get; set; } = null!;
        
        [ForeignKey("ConsentFormID")]
        public VaccinationConsentForm? ConsentForm { get; set; }
        
        [Required]
        [Column("VaccineTypeID")]
        public string VaccineTypeID { get; set; } = null!;
        
        [JsonIgnore]
        [ForeignKey("VaccineTypeID")]
        public virtual VaccineType? VaccineType { get; set; }
        
        [Column("ActualVaccinationDate")]
        public DateTime? ActualVaccinationDate { get; set; }
        
        [Column("Performer")]
        [StringLength(100)]
        public string? Performer { get; set; }
        
        [Column("PostVaccinationReaction")]
        [StringLength(255)]
        public string? PostVaccinationReaction { get; set; }
        
        [Column("Notes")]
        [StringLength(255)]
        public string? Notes { get; set; }
        
        [Column("NeedToContactParent")]
        public bool? NeedToContactParent { get; set; }
        
        [Column("VaccinationStatus")]
        [StringLength(50)]
        public string? VaccinationStatus { get; set; }
        
        [Column("PostponementReason")]
        [StringLength(255)]
        public string? PostponementReason { get; set; }
        
        [Column("FailureReason")]
        [StringLength(255)]
        public string? FailureReason { get; set; }
        
        [Column("RefusalReason")]
        [StringLength(255)]
        public string? RefusalReason { get; set; }
        
        [Column("RecordedDate")]
        public DateTime RecordedDate { get; set; } = DateTime.Now;
        
        [Column("RecordedBy")]
        [StringLength(100)]
        public string? RecordedBy { get; set; }
    }
}