using Microsoft.AspNetCore.Mvc;
using newbacken.Models;
using System.Collections.Generic;

namespace newbacken.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private static List<Schedule> schedules = new List<Schedule>();

        [HttpGet]
        public ActionResult<IEnumerable<Schedule>> GetAll()
        {
            return Ok(schedules);
        }

        [HttpGet("{id}")]
        public ActionResult<Schedule> GetById(int id)
        {
            var item = schedules.Find(s => s.ScheduleId == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<Schedule> Create(Schedule schedule)
        {
            schedule.ScheduleId = schedules.Count + 1;
            schedules.Add(schedule);
            return CreatedAtAction(nameof(GetById), new { id = schedule.ScheduleId }, schedule);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Schedule schedule)
        {
            var existing = schedules.Find(s => s.ScheduleId == id);
            if (existing == null) return NotFound();
            // Update fields
            existing.UserId = schedule.UserId;
            existing.UserName = schedule.UserName;
            existing.UserType = schedule.UserType;
            existing.Date = schedule.Date;
            existing.Shift = schedule.Shift;
            existing.Notes = schedule.Notes;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = schedules.Find(s => s.ScheduleId == id);
            if (item == null) return NotFound();
            schedules.Remove(item);
            return NoContent();
        }
    }
}
