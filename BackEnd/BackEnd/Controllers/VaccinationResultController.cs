using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationResultController : ControllerBase
    {
        private readonly IVaccinationResultService _resultService;

        public VaccinationResultController(IVaccinationResultService resultService)
        {
            _resultService = resultService;
        }

        // GET: api/VaccinationResult
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResults()
        {
            var results = await _resultService.GetAllVaccinationResultsAsync();
            return Ok(results);
        }

        // GET: api/VaccinationResult/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationResult>> GetVaccinationResult(string id)
        {
            var result = await _resultService.GetVaccinationResultByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/VaccinationResult/consentform/5
        [HttpGet("consentform/{consentFormId}")]
        public async Task<ActionResult<VaccinationResult>> GetVaccinationResultByConsentForm(string consentFormId)
        {
            var result = await _resultService.GetVaccinationResultByConsentFormIdAsync(consentFormId);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        // GET: api/VaccinationResult/vaccinetype/5
        [HttpGet("vaccinetype/{vaccineTypeId}")]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResultsByVaccineType(string vaccineTypeId)
        {
            var results = await _resultService.GetVaccinationResultsByVaccineTypeAsync(vaccineTypeId);
            return Ok(results);
        }

        // GET: api/VaccinationResult/plan/5
        [HttpGet("plan/{planId}")]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResultsByPlan(string planId)
        {
            var results = await _resultService.GetVaccinationResultsByPlanAsync(planId);
            return Ok(results);
        }

        // GET: api/VaccinationResult/student/{studentId}
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResultsByStudent(string studentId)
        {
            var results = await _resultService.GetVaccinationResultsByStudentAsync(studentId);
            return Ok(results);
        }

        // GET: api/VaccinationResult/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResultsByStatus(string status)
        {
            var results = await _resultService.GetVaccinationResultsByStatusAsync(status);
            return Ok(results);
        }

        // POST: api/VaccinationResult
        [HttpPost]
        public async Task<ActionResult<VaccinationResult>> CreateVaccinationResult(VaccinationResult result)
        {
            try
            {
                var createdResult = await _resultService.CreateVaccinationResultAsync(result);
                return CreatedAtAction(nameof(GetVaccinationResult), new { id = createdResult.ID }, createdResult);
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

        // POST: api/VaccinationResult/record
        [HttpPost("record")]
        public async Task<ActionResult<VaccinationResult>> RecordVaccinationResult(VaccinationResultDto resultDto)
        {
            try
            {
                var result = await _resultService.RecordVaccinationResultAsync(resultDto);
                return CreatedAtAction(nameof(GetVaccinationResult), new { id = result.ID }, result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/VaccinationResult/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaccinationResult(string id, VaccinationResult result)
        {
            if (id != result.ID)
                return BadRequest();

            try
            {
                await _resultService.UpdateVaccinationResultAsync(id, result);
                return NoContent();
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

        // DELETE: api/VaccinationResult/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaccinationResult(string id)
        {
            try
            {
                await _resultService.DeleteVaccinationResultAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}