using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Businessobjects.Models
{
    [Table("Vaccine_Type")]
    public class VaccineType
    {
        [Key]
        [Column("VaccinationID")]
        [StringLength(6)]
        public string VaccinationID { get; set; } = null!;
        [Required]
        [StringLength(100)]
        public string VaccineName { get; set; } = null!;
        [StringLength(255)]
        public string? Description { get; set; }
        [JsonIgnore]
        public virtual ICollection<VaccinationResult>? VaccinationResults { get; set; }
    }
}