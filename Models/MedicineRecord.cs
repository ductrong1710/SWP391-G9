using System;

namespace newbacken.Models
{
    public class MedicineRecord
    {
        public int RecordId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentClass { get; set; }
        public string MedicineName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string PrescribedBy { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; } = "active";
    }
}
