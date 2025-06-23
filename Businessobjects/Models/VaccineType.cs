using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class VaccineType
    {
        [Key]
        [Column("VaccinationID")]
        public string VaccinationID { get; set; } = null!;
        [Required]
        public string VaccineName { get; set; } = null!;
        public string? Description { get; set; }
        public virtual ICollection<VaccinationResult>? VaccinationResults { get; set; }
    }
}