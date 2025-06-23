using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationPlanController : ControllerBase
    {
        private readonly IVaccinationPlanService _planService;

        public VaccinationPlanController(IVaccinationPlanService planService)
        {
            _planService = planService;
        }

        // GET: api/VaccinationPlan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VaccinationPlan>>> GetVaccinationPlans()
        {
            var plans = await _planService.GetAllVaccinationPlansAsync();
            return Ok(plans);
        }

        // GET: api/VaccinationPlan/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationPlan>> GetVaccinationPlan(string id)
        {
            var plan = await _planService.GetVaccinationPlanByIdAsync(id);
            if (plan == null)
                return NotFound();

            return Ok(plan);
        }

        // GET: api/VaccinationPlan/creator/5
        [HttpGet("creator/{creatorId}")]
        public async Task<ActionResult<IEnumerable<VaccinationPlan>>> GetVaccinationPlansByCreator(string creatorId)
        {
            var plans = await _planService.GetVaccinationPlansByCreatorIdAsync(creatorId);
            return Ok(plans);
        }

        // GET: api/VaccinationPlan/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<VaccinationPlan>>> GetUpcomingVaccinationPlans()
        {
            var plans = await _planService.GetUpcomingVaccinationPlansAsync();
            return Ok(plans);
        }

        // POST: api/VaccinationPlan
        [HttpPost]
        public async Task<ActionResult<VaccinationPlan>> CreateVaccinationPlan(VaccinationPlan plan)
        {
            try
            {
                var createdPlan = await _planService.CreateVaccinationPlanAsync(plan);
                return CreatedAtAction(nameof(GetVaccinationPlan), new { id = createdPlan.ID }, createdPlan);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/VaccinationPlan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVaccinationPlan(string id, VaccinationPlan plan)
        {
            if (id != plan.ID)
                return BadRequest();

            await _planService.UpdateVaccinationPlanAsync(id, plan);
            return NoContent();
        }

        // DELETE: api/VaccinationPlan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVaccinationPlan(string id)
        {
            await _planService.DeleteVaccinationPlanAsync(id);
            return NoContent();
        }
    }
}