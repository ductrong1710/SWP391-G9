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
        private readonly IVaccinationConsentFormService _consentFormService;
        private readonly INotificationService _notificationService;

        public VaccinationPlanController(
            IVaccinationPlanService planService,
            IVaccinationConsentFormService consentFormService,
            INotificationService notificationService)
        {
            _planService = planService;
            _consentFormService = consentFormService;
            _notificationService = notificationService;
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

                // Lấy danh sách consent form theo planId
                var consentForms = await _consentFormService.GetConsentFormsByPlanIdAsync(createdPlan.ID);
                var notifiedParents = new HashSet<string>();
                foreach (var form in consentForms)
                {
                    if (!string.IsNullOrEmpty(form.ParentID) && !notifiedParents.Contains(form.ParentID))
                    {
                        var notification = new Notification
                        {
                            NotificationID = Guid.NewGuid().ToString(),
                            UserID = form.ParentID,
                            Title = "Xác nhận kế hoạch tiêm chủng",
                            Message = $"Kế hoạch tiêm chủng '{createdPlan.PlanName}' đã được tạo. Vui lòng xác nhận cho con bạn.",
                            CreatedAt = DateTime.Now,
                            IsRead = false
                        };
                        await _notificationService.CreateNotificationAsync(notification);
                        notifiedParents.Add(form.ParentID);
                    }
                }

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