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
        public async Task<ActionResult<HealthCheckConsentForm>> GetConsentForm(string id)
        {
            var consentForm = await _consentFormService.GetConsentFormByIdAsync(id);
            if (consentForm == null)
                return NotFound();

            return Ok(consentForm);
        }

        // GET: api/HealthCheckConsentForm/plan/5
        [HttpGet("plan/{planId}")]
        public async Task<ActionResult<IEnumerable<HealthCheckConsentForm>>> GetConsentFormsByPlan(string planId)
        {
            var consentForms = await _consentFormService.GetConsentFormsByPlanIdAsync(planId);
            return Ok(consentForms);
        }

        // GET: api/HealthCheckConsentForm/student/5
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<HealthCheckConsentForm>>> GetConsentFormsByStudent(string studentId)
        {
            var consentForms = await _consentFormService.GetConsentFormsByStudentIdAsync(studentId);
            return Ok(consentForms);
        }

        // GET: api/HealthCheckConsentForm/plan/5/student/5
        [HttpGet("plan/{planId}/student/{studentId}")]
        public async Task<ActionResult<HealthCheckConsentForm>> GetConsentFormByPlanAndStudent(string planId, string studentId)
        {
            var consentForm = await _consentFormService.GetConsentFormByPlanAndStudentAsync(planId, studentId);
            if (consentForm == null)
                return NotFound();

            return Ok(consentForm);
        }

        // POST: api/HealthCheckConsentForm
        [HttpPost]
        public async Task<ActionResult<HealthCheckConsentForm>> CreateConsentForm(HealthCheckConsentForm form)
        {
            try
            {
                var createdForm = await _consentFormService.CreateConsentFormAsync(form);
                return CreatedAtAction(nameof(GetConsentForm), new { id = createdForm.ID }, createdForm);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // PUT: api/HealthCheckConsentForm/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConsentForm(string id, HealthCheckConsentForm consentForm)
        {
            if (id != consentForm.ID)
                return BadRequest();

            await _consentFormService.UpdateConsentFormAsync(id, consentForm);
            return NoContent();
        }

        // DELETE: api/HealthCheckConsentForm/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsentForm(string id)
        {
            await _consentFormService.DeleteConsentFormAsync(id);
            return NoContent();
        }
    }
}