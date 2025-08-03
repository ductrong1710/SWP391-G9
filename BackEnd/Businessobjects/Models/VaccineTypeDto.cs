using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class VaccineTypeDto
    {
        [Required]
        [StringLength(100)]
        public string VaccineName { get; set; } = null!;
        
        [StringLength(255)]
        public string? Description { get; set; }
        
        public List<VaccineDiseaseDto>? Diseases { get; set; }
    }

    public class VaccineDiseaseDto
    {
        [Required]
        [StringLength(100)]
        public string DiseaseName { get; set; } = null!;
        
        public int? RequiredDoses { get; set; }
        
        public int? IntervalBetweenDoses { get; set; } // Khoảng cách tiêm giữa 2 mũi (tính bằng ngày)
    }
} 