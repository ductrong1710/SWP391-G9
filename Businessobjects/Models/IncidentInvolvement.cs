using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Incident_Involvement")]
    public class IncidentInvolvement
    {
        [Key]
        [Column("InvolvementID", TypeName = "char(6)")]
        public string InvolvementId { get; set; }

        [Column("IncidentID", TypeName = "char(6)")]
        public string? IncidentId { get; set; }

        [Column("StudentID", TypeName = "char(6)")]
        public string? StudentId { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? InjuryDescription { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? TreatmentGiven { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Notes { get; set; }

        [ForeignKey("IncidentId")]
        public virtual MedicalIncident MedicalIncident { get; set; }

        [ForeignKey("StudentId")]
        [InverseProperty("IncidentInvolvements")]
        public virtual User Student { get; set; }
    }
} 