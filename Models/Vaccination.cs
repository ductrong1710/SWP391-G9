using System;

namespace newbacken.Models
{
    public class Vaccination
    {
        public int VaccinationId { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentClass { get; set; }
        public string VaccineName { get; set; }
        public DateTime VaccinationDate { get; set; }
        public string Location { get; set; }
        public string BatchNumber { get; set; }
        public string Notes { get; set; }
        public string Status { get; set; } = "active";
    }
}
