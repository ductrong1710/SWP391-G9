using System;

namespace newbacken.Models
{
    public class HealthDeclaration
    {
        public int DeclarationId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentClass { get; set; }
        public string Disease { get; set; }
        public string Allergy { get; set; }
        public string Medication { get; set; }
        public string EmergencyContact { get; set; }
        public string EmergencyPhone { get; set; }
        public string AdditionalInfo { get; set; }
        public DateTime DeclarationDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "pending";
    }
}
