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
    }
}