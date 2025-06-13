using Microsoft.AspNetCore.Mvc;
using newbacken.Models;
using System.Collections.Generic;

namespace newbacken.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationController : ControllerBase
    {
        private static List<Vaccination> vaccinations = new List<Vaccination>();

        [HttpGet]
        public ActionResult<IEnumerable<Vaccination>> GetAll()
        {
            return Ok(vaccinations);
        }

        [HttpGet("{id}")]
        public ActionResult<Vaccination> GetById(int id)
        {
            var item = vaccinations.Find(v => v.VaccinationId == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<Vaccination> Create(Vaccination vaccination)
        {
            vaccination.VaccinationId = vaccinations.Count + 1;
            vaccinations.Add(vaccination);
            return CreatedAtAction(nameof(GetById), new { id = vaccination.VaccinationId }, vaccination);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Vaccination vaccination)
        {
            var existing = vaccinations.Find(v => v.VaccinationId == id);
            if (existing == null) return NotFound();
            // Update fields
            existing.StudentId = vaccination.StudentId;
            existing.StudentName = vaccination.StudentName;
            existing.StudentClass = vaccination.StudentClass;
            existing.VaccineName = vaccination.VaccineName;
            existing.VaccinationDate = vaccination.VaccinationDate;
            existing.Location = vaccination.Location;
            existing.BatchNumber = vaccination.BatchNumber;
            existing.Notes = vaccination.Notes;
            existing.Status = vaccination.Status;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = vaccinations.Find(v => v.VaccinationId == id);
            if (item == null) return NotFound();
            vaccinations.Remove(item);
            return NoContent();
        }
    }
}
