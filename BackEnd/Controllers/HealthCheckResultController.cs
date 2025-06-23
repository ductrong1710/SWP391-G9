using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthCheckResultController : ControllerBase
    {
        private readonly IHealthCheckResultService _resultService;

        public HealthCheckResultController(IHealthCheckResultService resultService)
        {
            _resultService = resultService;
        }

        // GET: api/HealthCheckResult
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetHealthCheckResults()
        {
            var results = await _resultService.GetAllHealthCheckResultsAsync();
            return Ok(results);
        }

        // GET: api/HealthCheckResult/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthCheckResult>> GetHealthCheckResult(string id)
        {
            var result = await _resultService.GetHealthCheckResultByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/HealthCheckResult/consent/5
        [HttpGet("consent/{consentId}")]
        public async Task<ActionResult<HealthCheckResult>> GetHealthCheckResultByConsent(string consentId)
        {
            var result = await _resultService.GetHealthCheckResultByConsentIdAsync(consentId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/HealthCheckResult/checker/DrSmith
        [HttpGet("checker/{checker}")]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetHealthCheckResultsByChecker(string checker)
        {
            var results = await _resultService.GetHealthCheckResultsByCheckerAsync(checker);
            return Ok(results);
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
                return BadRequest(ex.Message);
            }
        }

        // GET: api/HealthCheckResult/pending-consultations
        [HttpGet("pending-consultations")]
        public async Task<ActionResult<IEnumerable<HealthCheckResult>>> GetPendingConsultations()
        {
            var results = await _resultService.GetPendingConsultationsAsync();
            return Ok(results);
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
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/HealthCheckResult/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthCheckResult(string id, HealthCheckResult result)
        {
            if (id != result.ID)
                return BadRequest();

            await _resultService.UpdateHealthCheckResultAsync(id, result);
            return NoContent();
        }

        // DELETE: api/HealthCheckResult/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthCheckResult(string id)
        {
            await _resultService.DeleteHealthCheckResultAsync(id);
            return NoContent();
        }
    }
}