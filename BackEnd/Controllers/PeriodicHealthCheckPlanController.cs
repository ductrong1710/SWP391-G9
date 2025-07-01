using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;
using Services.interfaces; // Added namespace for IHealthCheckConsentFormService

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PeriodicHealthCheckPlanController : ControllerBase
    {
        private readonly IPeriodicHealthCheckPlanService _planService;
        private readonly IHealthCheckConsentFormService _consentFormService;
        private readonly INotificationService _notificationService;

        public PeriodicHealthCheckPlanController(IPeriodicHealthCheckPlanService planService, IHealthCheckConsentFormService consentFormService, INotificationService notificationService)
        {
            _planService = planService;
            _consentFormService = consentFormService;
            _notificationService = notificationService;
        }

        // GET: api/PeriodicHealthCheckPlan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetPlans()
        {
            var plans = await _planService.GetAllPlansAsync();
            return Ok(plans);
        }

        // GET: api/PeriodicHealthCheckPlan/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PeriodicHealthCheckPlan>> GetPlan(string id)
        {
            var plan = await _planService.GetPlanByIdAsync(id);
            if (plan == null)
                return NotFound();

            return Ok(plan);
        }

        // GET: api/PeriodicHealthCheckPlan/creator/5
        [HttpGet("creator/{creatorId}")]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetPlansByCreator(string creatorId)
        {
            var plans = await _planService.GetPlansByCreatorIdAsync(creatorId);
            return Ok(plans);
        }

        // GET: api/PeriodicHealthCheckPlan/upcoming
        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetUpcomingPlans()
        {
            var plans = await _planService.GetUpcomingPlansAsync();
            return Ok(plans);
        }

        // POST: api/PeriodicHealthCheckPlan
        [HttpPost]
        public async Task<ActionResult<PeriodicHealthCheckPlan>> CreatePlan(PeriodicHealthCheckPlan plan)
        {
            var createdPlan = await _planService.CreatePlanAsync(plan);

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
                        Title = "Thông báo kế hoạch kiểm tra sức khỏe định kỳ",
                        Message = $"Kế hoạch kiểm tra sức khỏe định kỳ '{createdPlan.PlanName}' đã được tạo. Vui lòng xác nhận cho con bạn.",
                        CreatedAt = DateTime.Now,
                        IsRead = false
                    };
                    await _notificationService.CreateNotificationAsync(notification);
                    notifiedParents.Add(form.ParentID);
                }
                // Nếu form đã bị từ chối và có lý do, gửi notification với message là 'Lý do: ...'
                if (form.ConsentStatus == "Denied" && !string.IsNullOrEmpty(form.ReasonForDenial))
                {
                    var notification = new Notification
                    {
                        NotificationID = Guid.NewGuid().ToString(),
                        UserID = form.ParentID,
                        Title = "Lý do từ chối kiểm tra sức khỏe định kỳ",
                        Message = $"Lý do: {form.ReasonForDenial}",
                        CreatedAt = DateTime.Now,
                        IsRead = false
                    };
                    await _notificationService.CreateNotificationAsync(notification);
                }
            }

            return CreatedAtAction(nameof(GetPlan), new { id = createdPlan.ID }, createdPlan);
        }

        // PUT: api/PeriodicHealthCheckPlan/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlan(string id, PeriodicHealthCheckPlan plan)
        {
            if (id != plan.ID)
                return BadRequest();

            await _planService.UpdatePlanAsync(id, plan);
            return NoContent();
        }

        // DELETE: api/PeriodicHealthCheckPlan/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlan(string id)
        {
            await _planService.DeletePlanAsync(id);
            return NoContent();
        }
    }
}