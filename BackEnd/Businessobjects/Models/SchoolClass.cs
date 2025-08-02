using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("SchoolClass")]
    public class SchoolClass
    {
        [Key]
        public required string ClassID { get; set; }
        public required string ClassName { get; set; }
        public required string Grade { get; set; }
        // Thêm các trường khác nếu cần
    }
} 