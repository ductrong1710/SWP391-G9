using Microsoft.AspNetCore.Mvc;
using newbacken.Models;
using System.Collections.Generic;

namespace newbacken.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicineRecordController : ControllerBase
    {
        private static List<MedicineRecord> records = new List<MedicineRecord>();

        [HttpGet]
        public ActionResult<IEnumerable<MedicineRecord>> GetAll()
        {
            return Ok(records);
        }

        [HttpGet("{id}")]
        public ActionResult<MedicineRecord> GetById(int id)
        {
            var item = records.Find(r => r.RecordId == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<MedicineRecord> Create(MedicineRecord record)
        {
            record.RecordId = records.Count + 1;
            records.Add(record);
            return CreatedAtAction(nameof(GetById), new { id = record.RecordId }, record);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, MedicineRecord record)
        {
            var existing = records.Find(r => r.RecordId == id);
            if (existing == null) return NotFound();
            // Update fields
            existing.StudentId = record.StudentId;
            existing.StudentName = record.StudentName;
            existing.StudentClass = record.StudentClass;
            existing.MedicineName = record.MedicineName;
            existing.Dosage = record.Dosage;
            existing.Frequency = record.Frequency;
            existing.StartDate = record.StartDate;
            existing.EndDate = record.EndDate;
            existing.PrescribedBy = record.PrescribedBy;
            existing.Notes = record.Notes;
            existing.Status = record.Status;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = records.Find(r => r.RecordId == id);
            if (item == null) return NotFound();
            records.Remove(item);
            return NoContent();
        }
    }
}
