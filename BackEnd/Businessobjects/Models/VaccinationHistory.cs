using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("VaccinationHistory")]
    public class VaccinationHistory
    {
        [Key]
        [StringLength(10)]
        public string HistoryID { get; set; } = null!;

        [StringLength(6)]
        public string StudentID { get; set; } = null!;

        [StringLength(6)]
        public string VaccineTypeID { get; set; } = null!;

        public DateTime VaccinationDate { get; set; }

        [StringLength(100)]
        public string? Performer { get; set; }

        [StringLength(255)]
        public string? PostVaccinationReaction { get; set; }

        [StringLength(255)]
        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("StudentID")]
        public virtual User? Student { get; set; }

        [ForeignKey("VaccineTypeID")]
        public virtual VaccineType? VaccineType { get; set; }
    }
} 