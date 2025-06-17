using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Businessobjects.Models
{
    public class Profile
    {
        public Guid ProfileId { get; set; }
        public required string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public required string Sex { get; set; }
        public required string Class { get; set; }
        public required string Phone { get; set; }
        
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public required User User { get; set; }
        
        public string? Note { get; set; }
    }
}