using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class MedicalIncident
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Column("MedicalStaffID")]
        public string? MedicalStaffID { get; set; }
        public DateTime? IncidentDate { get; set; }
        public string? IncidentType { get; set; } // Injury, Illness, Emergency, Other
        public string? Description { get; set; }
        public string? Severity { get; set; } // Low, Medium, High, Critical
        public string? Location { get; set; }
        public string? ActionTaken { get; set; }
        public string? FollowUpRequired { get; set; }
        public DateTime? FollowUpDate { get; set; }
        public string? Status { get; set; } // Open, In Progress, Resolved, Closed
        public string? Notes { get; set; }
        [ForeignKey("MedicalStaffID")]
        public User? MedicalStaff { get; set; }
    }
} 