using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class IncidentInvolvement
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Column("MedicalIncidentID")]
        public string? MedicalIncidentID { get; set; }
        [Column("StudentID")]
        public string? StudentID { get; set; }
        public string? InvolvementType { get; set; } // Victim, Witness, Involved
        public string? Description { get; set; }
        public string? Injuries { get; set; }
        public string? TreatmentRequired { get; set; }
        public DateTime? TreatmentDate { get; set; }
        [ForeignKey("MedicalIncidentID")]
        public MedicalIncident? MedicalIncident { get; set; }
        [ForeignKey("StudentID")]
        public User? Student { get; set; }
    }
} 