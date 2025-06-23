using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Medication_Receipt")]
    public class MedicationReceipt
    {
        [Key]
        [Column("ReceiptID", TypeName = "char(6)")]
        public string ReceiptId { get; set; }

        [Required]
        [Column("ParentID", TypeName = "char(6)")]
        public string ParentId { get; set; }

        [Required]
        [Column("MedicalStaffID", TypeName = "char(6)")]
        public string MedicalStaffId { get; set; }

        [Column(TypeName = "date")]
        public DateTime? ReceiptDate { get; set; }

        public int? MedicationNo { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? MedicationName { get; set; }

        public int? Quantity { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Dosage { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Instruction { get; set; }

        [Column(TypeName = "nvarchar(255)")]
        public string? Notes { get; set; }

        public bool? Status { get; set; }

        [Column("StudentID", TypeName = "char(6)")]
        public string? StudentId { get; set; }

        [Column("MedicationID", TypeName = "char(6)")]
        public string? MedicationId { get; set; }

        [ForeignKey("ParentId")]
        [InverseProperty("ParentMedicationReceipts")]
        public virtual User Parent { get; set; }

        [ForeignKey("MedicalStaffId")]
        [InverseProperty("MedicalStaffMedicationReceipts")]
        public virtual User MedicalStaff { get; set; }
    }
} 