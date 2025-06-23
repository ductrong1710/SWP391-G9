using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Businessobjects.Models;
using Services.Interfaces;
using System.Security.Claims;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VaccinationHealthCheckController : ControllerBase
    {
        private readonly IVaccinationHealthCheckService _healthCheckService;

        public VaccinationHealthCheckController(IVaccinationHealthCheckService healthCheckService)
        {
            _healthCheckService = healthCheckService;
        }

        // GET: api/VaccinationHealthCheck - Admin and medical staff can view all
        [HttpGet]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetAllHealthChecks()
        {
            var healthChecks = await _healthCheckService.GetAllAsync();
            return Ok(healthChecks);
        }

        // GET: api/VaccinationHealthCheck/5 - Users can view their own health checks
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationHealthCheck>> GetHealthCheck(string id)
        {
            var healthCheck = await _healthCheckService.GetByIdAsync(id);
            if (healthCheck == null)
            {
                return NotFound();
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any health check
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                return healthCheck;
            }

            // Students and parents can only view their own health checks
            if (healthCheck.StudentId == userId || healthCheck.ParentId == userId)
            {
                return healthCheck;
            }

            return Forbid("Bạn chỉ có thể xem các phiếu kiểm tra y tế của mình");
        }

        // GET: api/VaccinationHealthCheck/plan/5 - Get health checks by plan ID
        [HttpGet("plan/{planId}")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetHealthChecksByPlan(string planId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var healthChecks = await _healthCheckService.GetByPlanIdAsync(planId);

            // Admin and medical staff can view all health checks
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                return Ok(healthChecks);
            }

            // Students and parents can only view their own health checks
            var filteredHealthChecks = healthChecks.Where(h => h.StudentId == userId || h.ParentId == userId);
            return Ok(filteredHealthChecks);
        }

        // GET: api/VaccinationHealthCheck/student/5 - Get health checks by student ID
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetHealthChecksByStudent(string studentId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any student's health checks
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                var healthChecks = await _healthCheckService.GetByStudentIdAsync(studentId);
                return Ok(healthChecks);
            }

            // Students and parents can only view their own health checks
            if (studentId == userId)
            {
                var healthChecks = await _healthCheckService.GetByStudentIdAsync(studentId);
                return Ok(healthChecks);
            }

            return Forbid("Bạn chỉ có thể xem các phiếu kiểm tra y tế của mình");
        }

        // GET: api/VaccinationHealthCheck/status/pending - Get health checks by status
        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetHealthChecksByStatus(string status)
        {
            var healthChecks = await _healthCheckService.GetByStatusAsync(status);
            return Ok(healthChecks);
        }

        // POST: api/VaccinationHealthCheck/send-notifications - Send health check notifications
        [HttpPost("send-notifications")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> SendHealthCheckNotifications([FromBody] SendNotificationsRequest request)
        {
            try
            {
                var healthChecks = await _healthCheckService.SendHealthCheckNotificationsAsync(request.PlanId, request.StudentIds);
                return Ok(healthChecks);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        // POST: api/VaccinationHealthCheck/5/approve - Parents can approve health check
        [HttpPost("{id}/approve")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> ApproveHealthCheck(string id)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Người dùng chưa đăng nhập");
                }

                var healthCheck = await _healthCheckService.ApproveHealthCheckAsync(id, userId);
                return Ok(healthCheck);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        // POST: api/VaccinationHealthCheck/5/deny - Parents can deny health check
        [HttpPost("{id}/deny")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> DenyHealthCheck(string id, [FromBody] DenyHealthCheckRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Người dùng chưa đăng nhập");
                }

                var healthCheck = await _healthCheckService.DenyHealthCheckAsync(id, userId, request.Reason);
                return Ok(healthCheck);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        // GET: api/VaccinationHealthCheck/plan/5/pending - Get pending health checks for a plan
        [HttpGet("plan/{planId}/pending")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetPendingHealthChecks(string planId)
        {
            var healthChecks = await _healthCheckService.GetPendingHealthChecksAsync(planId);
            return Ok(healthChecks);
        }

        // GET: api/VaccinationHealthCheck/plan/5/approved - Get approved health checks for a plan
        [HttpGet("plan/{planId}/approved")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheck>>> GetApprovedHealthChecks(string planId)
        {
            var healthChecks = await _healthCheckService.GetApprovedHealthChecksAsync(planId);
            return Ok(healthChecks);
        }

        // DELETE: api/VaccinationHealthCheck/5 - Only admin can delete health checks
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHealthCheck(string id)
        {
            try
            {
                await _healthCheckService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }

    public class SendNotificationsRequest
    {
        public string PlanId { get; set; } = string.Empty;
        public List<string> StudentIds { get; set; } = new List<string>();
    }

    public class DenyHealthCheckRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
} 