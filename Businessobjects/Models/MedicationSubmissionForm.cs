using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class MedicationSubmissionForm
    {
        [Key]
        public int Id { get; set; }
        public Guid StudentId { get; set; }
        [ForeignKey("StudentId")]
        public required Profile Student { get; set; }
        public required string ParentId { get; set; }
        public required string MedicationName { get; set; }
        public required string Dosage { get; set; }
        public required string Instructions { get; set; }
        public required string ConsumptionTime { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
        public required string Status { get; set; }
        public string? ParentsNote { get; set; }
    }
}