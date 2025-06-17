using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckConsentFormController : ControllerBase
    {
        private readonly IHealthCheckConsentFormService _consentFormService;

        public HealthCheckConsentFormController(IHealthCheckConsentFormService consentFormService)
        {
            _consentFormService = consentFormService;
        }

        // GET: api/HealthCheckConsentForm
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthCheckConsentForm>>> GetConsentForms()
        {
            var forms = await _consentFormService.GetAllConsentFormsAsync();
            return Ok(forms);
        }

        // GET: api/HealthCheckConsentForm/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthCheckConsentForm>> GetConsentForm(int id)
        {
            var form = await _consentFormService.GetConsentFormByIdAsync(id);

            if (form == null)
            {
                return NotFound();
            }

            return form;
        }

        // GET: api/HealthCheckConsentForm/plan/5
        [HttpGet("plan/{planId}")]
        public async Task<ActionResult<IEnumerable<HealthCheckConsentForm>>> GetConsentFormsByPlan(int planId)
        {
            var forms = await _consentFormService.GetConsentFormsByPlanIdAsync(planId);
            return Ok(forms);
        }

        // GET: api/HealthCheckConsentForm/student/5
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<HealthCheckConsentForm>>> GetConsentFormsByStudent(Guid studentId)
        {
            var forms = await _consentFormService.GetConsentFormsByStudentIdAsync(studentId);
            return Ok(forms);
        }

        // POST: api/HealthCheckConsentForm
        [HttpPost]
        public async Task<ActionResult<HealthCheckConsentForm>> CreateConsentForm(HealthCheckConsentForm form)
        {
            try
            {
                var createdForm = await _consentFormService.CreateConsentFormAsync(form);
                return CreatedAtAction(nameof(GetConsentForm), new { id = createdForm.Id }, createdForm);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // PUT: api/HealthCheckConsentForm/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsentForm(int id, HealthCheckConsentForm form)
        {
            try
            {
                await _consentFormService.UpdateConsentFormAsync(id, form);
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

        // DELETE: api/HealthCheckConsentForm/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsentForm(int id)
        {
            try
            {
                await _consentFormService.DeleteConsentFormAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}