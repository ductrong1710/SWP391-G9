using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Medical_Incident")]
    public class MedicalIncident
    {
        [Key]
        [Column("IncidentID", TypeName = "char(6)")]
        public string IncidentId { get; set; }

        [Column(TypeName = "date")]
        public DateTime? RecordTime { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? IncidentType { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? IncidentDescription { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? IncidentMeasures { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? HandlingResults { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Note { get; set; }

        [Column("MedicalStaffID", TypeName = "char(6)")]
        public string? MedicalStaffId { get; set; }

        [ForeignKey("MedicalStaffId")]
        [InverseProperty("MedicalIncidents")]
        public virtual User MedicalStaff { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Location { get; set; }

        [Column("ReporterID", TypeName = "char(6)")]
        public string? ReporterId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? IncidentDate { get; set; }

        [ForeignKey("ReporterId")]
        public virtual User Reporter { get; set; }

        public virtual ICollection<IncidentInvolvement> IncidentInvolvements { get; set; } = new List<IncidentInvolvement>();
        public virtual ICollection<SupplyMedUsage> SupplyMedUsages { get; set; } = new List<SupplyMedUsage>();
    }
} 