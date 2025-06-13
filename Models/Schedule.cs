using System;

namespace newbacken.Models
{
    public class Schedule
    {
        public int ScheduleId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; }
        public DateTime Date { get; set; }
        public string Shift { get; set; }
        public string Notes { get; set; }
    }
}
