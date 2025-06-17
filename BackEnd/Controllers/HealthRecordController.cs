using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthRecordController : ControllerBase
    {
        private readonly IHealthRecordService _healthRecordService;

        public HealthRecordController(IHealthRecordService healthRecordService)
        {
            _healthRecordService = healthRecordService;
        }

        // GET: api/HealthRecord
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HealthRecord>>> GetHealthRecords()
        {
            var healthRecords = await _healthRecordService.GetAllHealthRecordsAsync();
            return Ok(healthRecords);
        }

        // GET: api/HealthRecord/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HealthRecord>> GetHealthRecord(Guid id)
        {
            var healthRecord = await _healthRecordService.GetHealthRecordByIdAsync(id);

            if (healthRecord == null)
            {
                return NotFound();
            }

            return healthRecord;
        }

        // GET: api/HealthRecord/student/5
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<HealthRecord>> GetHealthRecordByStudentId(Guid studentId)
        {
            var healthRecord = await _healthRecordService.GetHealthRecordByStudentIdAsync(studentId);

            if (healthRecord == null)
            {
                return NotFound();
            }

            return healthRecord;
        }

        // POST: api/HealthRecord
        [HttpPost]
        public async Task<ActionResult<HealthRecord>> CreateHealthRecord(HealthRecord healthRecord)
        {
            var createdHealthRecord = await _healthRecordService.CreateHealthRecordAsync(healthRecord);
            return CreatedAtAction(nameof(GetHealthRecord), new { id = createdHealthRecord.HealthRecordId }, createdHealthRecord);
        }

        // PUT: api/HealthRecord/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHealthRecord(Guid id, HealthRecord healthRecord)
        {
            try
            {
                await _healthRecordService.UpdateHealthRecordAsync(id, healthRecord);
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

        // DELETE: api/HealthRecord/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHealthRecord(Guid id)
        {
            try
            {
                await _healthRecordService.DeleteHealthRecordAsync(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}