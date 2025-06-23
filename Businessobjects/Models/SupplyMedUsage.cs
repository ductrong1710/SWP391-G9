using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Supply_Med_Usage")]
    public class SupplyMedUsage
    {
        [Key]
        [Column("UsageID", TypeName = "char(6)")]
        public string UsageId { get; set; }

        [Column("IncidentID", TypeName = "char(6)")]
        public string? IncidentId { get; set; }

        [Column("SupplyID", TypeName = "char(6)")]
        public string? SupplyId { get; set; }

        [Column("MedicationID", TypeName = "char(6)")]
        public string? MedicationId { get; set; }

        [Column("StudentID", TypeName = "char(6)")]
        public string? StudentId { get; set; }

        public int? QuantityUsed { get; set; }

        [Column(TypeName = "date")]
        public DateTime? UsageTime { get; set; }

        [ForeignKey("IncidentId")]
        public virtual MedicalIncident MedicalIncident { get; set; }

        [ForeignKey("SupplyId")]
        public virtual MedicalSupply MedicalSupply { get; set; }

        [ForeignKey("MedicationId")]
        public virtual Medication Medication { get; set; }
    }
} 