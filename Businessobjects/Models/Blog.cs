using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class Blog
    {
        [Key]
        [Column("ID")]
        public string ID { get; set; } = null!;
        [Required]
        public string Title { get; set; } = null!;
        [Required]
        public string Content { get; set; } = null!;
        [Column("AuthorID")]
        public string? AuthorID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? Category { get; set; }
        public string? Status { get; set; } // Draft, Published, Archived
        [ForeignKey("AuthorID")]
        public User? Author { get; set; }
    }
} 