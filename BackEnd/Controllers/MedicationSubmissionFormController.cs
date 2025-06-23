using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationSubmissionFormController : ControllerBase
    {
        private readonly IMedicationSubmissionFormService _service;

        public MedicationSubmissionFormController(IMedicationSubmissionFormService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicationSubmissionForm>>> GetAllForms()
        {
            var forms = await _service.GetAllFormsAsync();
            return Ok(forms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationSubmissionForm>> GetForm(string id)
        {
            var form = await _service.GetFormByIdAsync(id);
            if (form == null)
                return NotFound();

            return Ok(form);
        }

        [HttpGet("student/{studentID}")]
        public async Task<ActionResult<IEnumerable<MedicationSubmissionForm>>> GetFormsByStudentId(string studentID)
        {
            var forms = await _service.GetFormsByStudentIdAsync(studentID);
            return Ok(forms);
        }

        [HttpPost]
        public async Task<ActionResult<MedicationSubmissionForm>> CreateForm(MedicationSubmissionForm form)
        {
            var createdForm = await _service.CreateFormAsync(form);
            return CreatedAtAction(nameof(GetForm), new { id = createdForm.ID }, createdForm);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateForm(string id, MedicationSubmissionForm form)
        {
            try
            {
                await _service.UpdateFormAsync(id, form);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm(string id)
        {
            try
            {
                await _service.DeleteFormAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}