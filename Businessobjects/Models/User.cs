using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class User
    {
        [Key]
        [Column("UserID")]
        public string UserID { get; set; } = null!;
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        [Column("RoleID")]
        public string RoleID { get; set; } = null!;
        [ForeignKey("RoleID")]
        public Role? Role { get; set; }

        // Bổ sung quan hệ cha-con nếu chưa có
        [InverseProperty("Parent")]
        public virtual ICollection<User> Children { get; set; } = new List<User>();

        [ForeignKey("ParentId")]
        [InverseProperty("Children")]
        public virtual User? Parent { get; set; }
    }
}