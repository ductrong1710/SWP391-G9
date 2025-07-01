using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService
using Microsoft.Extensions.Logging;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckResultController : ControllerBase
    {
        private readonly IHealthCheckResultService _resultService;
        private readonly IHealthCheckConsentFormService _consentFormService;
        private readonly IHealthRecordService _healthRecordService;
        private readonly ILogger<HealthCheckResultController> _logger;

        public HealthCheckResultController(
            IHealthCheckResultService resultService,
            IHealthCheckConsentFormService consentFormService,
            IHealthRecordService healthRecordService,
            ILogger<HealthCheckResultController> logger)
        {
            _resultService = resultService;
            _consentFormService = consentFormService;
            _healthRecordService = healthRecordService;
            _logger = logger;
        }

        // GET: api/HealthCheckResult
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetHealthCheckResults()
        {
            try
            {
                var results = await _resultService.GetAllHealthCheckResultsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetHealthCheckResults");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/HealthCheckResult/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthCheckResult>> GetHealthCheckResult(string id)
        {
            try
            {
                var result = await _resultService.GetHealthCheckResultByIdAsync(id);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetHealthCheckResult for id {id}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/HealthCheckResult/consent/5
        [HttpGet("consent/{consentId}")]
        public async Task<ActionResult<HealthCheckResult>> GetHealthCheckResultByConsent(string consentId)
        {
            try
            {
                var result = await _resultService.GetHealthCheckResultByConsentIdAsync(consentId);
                if (result == null)
                    return NotFound();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetHealthCheckResultByConsent for consentId {consentId}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/HealthCheckResult/checker/DrSmith
        [HttpGet("checker/{checker}")]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetHealthCheckResultsByChecker(string checker)
        {
            try
            {
                var results = await _resultService.GetHealthCheckResultsByCheckerAsync(checker);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetHealthCheckResultsByChecker for checker {checker}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/HealthCheckResult/daterange
        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetHealthCheckResultsByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            try
            {
                var results = await _resultService.GetHealthCheckResultsByDateRangeAsync(startDate, endDate);
                return Ok(results);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Bad request in GetHealthCheckResultsByDateRange: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetHealthCheckResultsByDateRange");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/HealthCheckResult/pending-consultations
        [HttpGet("pending-consultations")]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetPendingConsultations()
        {
            try
            {
                var results = await _resultService.GetPendingConsultationsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetPendingConsultations");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/HealthCheckResult
        [HttpPost]
        public async Task<ActionResult<HealthCheckResult>> CreateHealthCheckResult(HealthCheckResult result)
        {
            try
            {
                var createdResult = await _resultService.CreateHealthCheckResultAsync(result);
                return CreatedAtAction(nameof(GetHealthCheckResult), new { id = createdResult.ID }, createdResult);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Not found in CreateHealthCheckResult: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, $"Bad request in CreateHealthCheckResult: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateHealthCheckResult");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/HealthCheckResult/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthCheckResult(string id, HealthCheckResult result)
        {
            try
            {
                if (id != result.ID)
                    return BadRequest();
                await _resultService.UpdateHealthCheckResultAsync(id, result);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Not found in UpdateHealthCheckResult for id {id}: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, $"Bad request in UpdateHealthCheckResult for id {id}: {ex.Message}");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in UpdateHealthCheckResult for id {id}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/HealthCheckResult/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckResult(string id)
        {
            try
            {
                await _resultService.DeleteHealthCheckResultAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Not found in DeleteHealthCheckResult for id {id}: {ex.Message}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in DeleteHealthCheckResult for id {id}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/HealthCheckResult/batch
        [HttpPost("batch")]
        public async Task<IActionResult> BatchCreate([FromBody] BatchHealthCheckCreateModel model)
        {
            try
            {
                var createdConsentForms = new List<HealthCheckConsentForm>();
                string planId = "PH0001"; // TODO: lấy đúng planId

                foreach (var studentId in model.studentIds)
                {
                    // Lấy ParentID từ HealthRecord
                    var healthRecord = await _healthRecordService.GetHealthRecordByStudentIdAsync(studentId);
                    var parentId = healthRecord?.ParentID ?? "U00005";

                    // Sinh ID mới không trùng
                    string consentId = "HC" + Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();

                    var consentForm = await _consentFormService.GetConsentFormByPlanAndStudentAsync(planId, studentId);
                    if (consentForm == null)
                    {
                        var newConsentForm = new HealthCheckConsentForm
                        {
                            ID = consentId,
                            HealthCheckPlanID = planId,
                            StudentID = studentId,
                            ParentID = parentId,
                            ConsentStatus = "Đang chờ ý kiến", // Mặc định chờ ý kiến phụ huynh
                            ResponseTime = null,
                            ReasonForDenial = null
                        };
                        consentForm = await _consentFormService.CreateConsentFormAsync(newConsentForm);
                    }
                    createdConsentForms.Add(consentForm);
                }

                return Ok(new { message = "Batch created", results = createdConsentForms });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in BatchCreate");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // Add this model class at the end of the file or in a suitable Models directory
    public class BatchHealthCheckCreateModel
    {
        public string className { get; set; }
        public string checkupDate { get; set; }
        public string checkupType { get; set; }
        public string doctorName { get; set; }
        public string healthFacility { get; set; }
        public string notes { get; set; }
        public List<string> studentIds { get; set; }
    }
}