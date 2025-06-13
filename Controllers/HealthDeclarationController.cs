using Microsoft.AspNetCore.Mvc;
using newbacken.Models;
using System.Collections.Generic;

namespace newbacken.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthDeclarationController : ControllerBase
    {
        private static List<HealthDeclaration> declarations = new List<HealthDeclaration>();

        [HttpGet]
        public ActionResult<IEnumerable<HealthDeclaration>> GetAll()
        {
            return Ok(declarations);
        }

        [HttpGet("{id}")]
        public ActionResult<HealthDeclaration> GetById(int id)
        {
            var item = declarations.Find(d => d.DeclarationId == id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public ActionResult<HealthDeclaration> Create(HealthDeclaration declaration)
        {
            declaration.DeclarationId = declarations.Count + 1;
            declarations.Add(declaration);
            return CreatedAtAction(nameof(GetById), new { id = declaration.DeclarationId }, declaration);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, HealthDeclaration declaration)
        {
            var existing = declarations.Find(d => d.DeclarationId == id);
            if (existing == null) return NotFound();
            // Update fields
            existing.StudentId = declaration.StudentId;
            existing.StudentName = declaration.StudentName;
            existing.StudentClass = declaration.StudentClass;
            existing.Disease = declaration.Disease;
            existing.Allergy = declaration.Allergy;
            existing.Medication = declaration.Medication;
            existing.EmergencyContact = declaration.EmergencyContact;
            existing.EmergencyPhone = declaration.EmergencyPhone;
            existing.AdditionalInfo = declaration.AdditionalInfo;
            existing.Status = declaration.Status;
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = declarations.Find(d => d.DeclarationId == id);
            if (item == null) return NotFound();
            declarations.Remove(item);
            return NoContent();
        }
    }
}
