using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class Medication
    {
        [Key]
        public int MedicationId { get; set; }
        public required string MedicationName { get; set; }
        public required string Unit { get; set; }
        public int CurrentStock { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? Notes { get; set; }
    }
}