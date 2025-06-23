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
            {
                return NotFound();
            }

            return result;
        }

        // GET: api/VaccinationResult/consent/5
        [HttpGet("consent/{consentFormID}")]
        public async Task<ActionResult<VaccinationResult>> GetVaccinationResultByConsentForm(string consentFormID)
        {
            var result = await _resultService.GetVaccinationResultByConsentFormIdAsync(consentFormID);

            if (result == null)
            {
                return NotFound();
            }

            return result;
        }

        // GET: api/VaccinationResult/vaccine-type/5
        [HttpGet("vaccine-type/{vaccineTypeID}")]
        public async Task<ActionResult<IEnumerable<VaccinationResult>>> GetVaccinationResultsByVaccineType(string vaccineTypeID)
        {
            var results = await _resultService.GetVaccinationResultsByVaccineTypeAsync(vaccineTypeID);
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

        // PUT: api/VaccinationResult/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaccinationResult(string id, VaccinationResult result)
        {
            try
            {
                await _resultService.UpdateVaccinationResultAsync(id, result);
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

        // DELETE: api/VaccinationResult/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaccinationResult(string id)
        {
            try
            {
                await _resultService.DeleteVaccinationResultAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}