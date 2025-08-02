using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("VaccineDisease")]
    public class VaccineDisease
    {
        [Key]
        [Column("VaccineDiseaseID")]
        [StringLength(10)]
        public string VaccineDiseaseID { get; set; } = null!;
        
        [Required]
        [StringLength(6)]
        [ForeignKey("VaccineType")]
        public string VaccinationID { get; set; } = null!;
        
        [Required]
        [StringLength(100)]
        public string DiseaseName { get; set; } = null!;
        
        public int? RequiredDoses { get; set; }
        
        [StringLength(255)]
        public string? Notes { get; set; }
        
        // Navigation property
        public virtual VaccineType? VaccineType { get; set; }
    }
} 