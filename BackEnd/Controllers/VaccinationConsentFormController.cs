using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationConsentFormController : ControllerBase
    {
        private readonly IVaccinationConsentFormService _consentFormService;

        public VaccinationConsentFormController(IVaccinationConsentFormService consentFormService)
        {
            _consentFormService = consentFormService;
        }

        // GET: api/VaccinationConsentForm
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccinationConsentForm>>> GetConsentForms()
        {
            var forms = await _consentFormService.GetAllVaccinationConsentFormsAsync();
            return Ok(forms);
        }

        // GET: api/VaccinationConsentForm/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationConsentForm>> GetConsentForm(int id)
        {
            var form = await _consentFormService.GetVaccinationConsentFormByIdAsync(id);

            if (form == null)
            {
                return NotFound();
            }

            return form;
        }

        // GET: api/VaccinationConsentForm/plan/5
        [HttpGet("plan/{planId}")]
        public async Task<ActionResult<IEnumerable<VaccinationConsentForm>>> GetConsentFormsByPlan(int planId)
        {
            var forms = await _consentFormService.GetConsentFormsByPlanIdAsync(planId);
            return Ok(forms);
        }

        // GET: api/VaccinationConsentForm/student/5
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<VaccinationConsentForm>>> GetConsentFormsByStudent(Guid studentId)
        {
            var forms = await _consentFormService.GetConsentFormsByStudentIdAsync(studentId);
            return Ok(forms);
        }

        // GET: api/VaccinationConsentForm/plan/5/student/5
        [HttpGet("plan/{planId}/student/{studentId}")]
        public async Task<ActionResult<VaccinationConsentForm>> GetConsentFormByPlanAndStudent(int planId, Guid studentId)
        {
            var form = await _consentFormService.GetConsentFormByPlanAndStudentAsync(planId, studentId);

            if (form == null)
            {
                return NotFound();
            }

            return form;
        }

        // POST: api/VaccinationConsentForm
        [HttpPost]
        public async Task<ActionResult<VaccinationConsentForm>> CreateConsentForm(VaccinationConsentForm form)
        {
            try
            {
                var createdForm = await _consentFormService.CreateVaccinationConsentFormAsync(form);
                return CreatedAtAction(nameof(GetConsentForm), new { id = createdForm.Id }, createdForm);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/VaccinationConsentForm/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsentForm(int id, VaccinationConsentForm form)
        {
            try
            {
                await _consentFormService.UpdateVaccinationConsentFormAsync(id, form);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        // DELETE: api/VaccinationConsentForm/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsentForm(int id)
        {
            try
            {
                await _consentFormService.DeleteVaccinationConsentFormAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }

            return NoContent();
        }
    }
}