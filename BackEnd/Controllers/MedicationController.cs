using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;

        public MedicationController(IMedicationService medicationService)
        {
            _medicationService = medicationService;
        }

        // GET: api/Medication
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medication>>> GetMedications()
        {
            var medications = await _medicationService.GetAllMedicationsAsync();
            return Ok(medications);
        }

        // GET: api/Medication/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medication>> GetMedication(int id)
        {
            var medication = await _medicationService.GetMedicationByIdAsync(id);

            if (medication == null)
            {
                return NotFound();
            }

            return medication;
        }

        // GET: api/Medication/expired
        [HttpGet("expired")]
        public async Task<ActionResult<IEnumerable<Medication>>> GetExpiredMedications()
        {
            var medications = await _medicationService.GetExpiredMedicationsAsync();
            return Ok(medications);
        }

        // GET: api/Medication/lowstock
        [HttpGet("lowstock")]
        public async Task<ActionResult<IEnumerable<Medication>>> GetLowStockMedications([FromQuery] int threshold = 10)
        {
            var medications = await _medicationService.GetLowStockMedicationsAsync(threshold);
            return Ok(medications);
        }

        // POST: api/Medication
        [HttpPost]
        public async Task<ActionResult<Medication>> CreateMedication(Medication medication)
        {
            var createdMedication = await _medicationService.CreateMedicationAsync(medication);
            return CreatedAtAction(nameof(GetMedication), new { id = createdMedication.MedicationId }, createdMedication);
        }

        // PUT: api/Medication/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedication(int id, Medication medication)
        {
            try
            {
                await _medicationService.UpdateMedicationAsync(id, medication);
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

        // DELETE: api/Medication/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedication(int id)
        {
            try
            {
                await _medicationService.DeleteMedicationAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}