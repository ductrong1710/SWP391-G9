using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    [Table("Blog")]
    public class Blog
    {
        [Key]
        [Column("ID", TypeName = "char(6)")]
        public string Id { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; }

        [Required]
        [Column(TypeName = "ntext")]
        public string Content { get; set; }

        [Column("AuthorID", TypeName = "char(6)")]
        public string? AuthorId { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }

        [Column(TypeName = "datetime")]
        public DateTime? UpdatedAt { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Category { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Status { get; set; } // Draft, Published, Archived

        [ForeignKey("AuthorId")]
        public virtual User Author { get; set; }
    }
} 