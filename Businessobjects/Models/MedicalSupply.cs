using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class MedicalSupply
    {
        [Key]
        public int SupplyID { get; set; }
        public required string SupplyName { get; set; }
        public required string Unit { get; set; }
        public int CurrentStock { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string? Notes { get; set; }
    }
}