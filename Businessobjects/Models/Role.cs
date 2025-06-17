using System.ComponentModel.DataAnnotations;

namespace Businessobjects.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        public required string RoleType { get; set; }
    }
}