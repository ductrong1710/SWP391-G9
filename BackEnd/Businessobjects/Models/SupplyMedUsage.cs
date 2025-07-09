using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class SupplyMedUsage
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Column("MedicalSupplyID")]
        public string? MedicalSupplyID { get; set; }
        [Column("MedicationID")]
        public string? MedicationID { get; set; }
        public DateTime? UsageDate { get; set; }
        public int? QuantityUsed { get; set; }
        public string? UsagePurpose { get; set; }
        public string? AdministeredBy { get; set; }
        public string? Notes { get; set; }
        [ForeignKey("MedicalSupplyID")]
        public MedicalSupply? MedicalSupply { get; set; }
        [ForeignKey("MedicationID")]
        public Medication? Medication { get; set; }
    }
} 