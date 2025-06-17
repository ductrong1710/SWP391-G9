using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class VaccineType
    {
        [Key]
        public int VaccinationId { get; set; }
        public required string VaccineName { get; set; }
        public string? Description { get; set; }
        public virtual ICollection<VaccinationResult>? VaccinationResults { get; set; }
    }
}