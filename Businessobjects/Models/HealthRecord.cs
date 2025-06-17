using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class HealthRecord
    {
        public Guid HealthRecordId { get; set; }
        
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public required Profile Student { get; set; }
        
        public required string ParentId { get; set; }
        public string? Allergies { get; set; }
        public string? ChronicDiseases { get; set; }
        public string? TreatmentHistory { get; set; }
        public string? Eyesight { get; set; }
        public string? Hearing { get; set; }
        public string? VaccinationHistory { get; set; }
        public string? Note { get; set; }
        public required string ParentContact { get; set; }
    }
}