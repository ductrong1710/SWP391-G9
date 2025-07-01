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
        private readonly IHealthCheckResultService _resultService;

        public HealthCheckConsentFormController(IHealthCheckConsentFormService consentFormService, IHealthCheckResultService resultService)
        {
            _consentFormService = consentFormService;
            _resultService = resultService;
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

        // Xác nhận đồng ý cho học sinh tham gia kiểm tra định kỳ
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveConsentForm(string id)
        {
            var consentForm = await _consentFormService.GetConsentFormByIdAsync(id);
            if (consentForm == null)
                return NotFound();
            consentForm.ConsentStatus = "Approved";
            consentForm.ResponseTime = DateTime.Now;
            await _consentFormService.UpdateConsentFormAsync(id, consentForm);
            return Ok(consentForm);
        }

        public class DenyConsentFormRequest
        {
            public string? Reason { get; set; }
        }

        // Từ chối cho học sinh tham gia kiểm tra định kỳ
        [HttpPost("{id}/deny")]
        public async Task<IActionResult> DenyConsentForm(string id, [FromBody] DenyConsentFormRequest request)
        {
            var consentForm = await _consentFormService.GetConsentFormByIdAsync(id);
            if (consentForm == null)
                return NotFound();
            consentForm.ConsentStatus = "Denied";
            consentForm.ResponseTime = DateTime.Now;
            consentForm.ReasonForDenial = request?.Reason;
            await _consentFormService.UpdateConsentFormAsync(id, consentForm);
            return Ok(consentForm);
        }

        // Lấy lịch sử kiểm tra sức khỏe định kỳ của học sinh, kèm kết quả khám nếu có
        [HttpGet("student/{studentId}/history")]
        public async Task<ActionResult<IEnumerable<object>>> GetHealthCheckHistoryWithResult(string studentId)
        {
            var consentForms = await _consentFormService.GetConsentFormsByStudentIdAsync(studentId);
            var result = new List<object>();
            foreach (var form in consentForms)
            {
                var healthResult = await _resultService.GetHealthCheckResultByConsentIdAsync(form.ID);
                result.Add(new {
                    ConsentForm = form,
                    HealthCheckResult = healthResult
                });
            }
            return Ok(result);
        }
    }
}