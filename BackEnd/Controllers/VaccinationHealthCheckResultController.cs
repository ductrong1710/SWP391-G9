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
    public class VaccinationHealthCheckResultController : ControllerBase
    {
        private readonly IVaccinationHealthCheckResultService _resultService;

        public VaccinationHealthCheckResultController(IVaccinationHealthCheckResultService resultService)
        {
            _resultService = resultService;
        }

        // GET: api/VaccinationHealthCheckResult - Admin and medical staff can view all
        [HttpGet]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheckResult>>> GetAllResults()
        {
            var results = await _resultService.GetAllAsync();
            return Ok(results);
        }

        // GET: api/VaccinationHealthCheckResult/5 - Users can view their own results
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationHealthCheckResult>> GetResult(string id)
        {
            var result = await _resultService.GetByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any result
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                return result;
            }

            // Students and parents can only view their own results
            // This would require additional logic to get student/parent from health check
            // For now, we'll allow medical staff and admin only
            return Forbid("Bạn chỉ có thể xem kết quả kiểm tra sức khỏe của mình");
        }

        // GET: api/VaccinationHealthCheckResult/healthcheck/5 - Get results by health check ID
        [HttpGet("healthcheck/{healthCheckId}")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheckResult>>> GetResultsByHealthCheck(string healthCheckId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var results = await _resultService.GetByHealthCheckIdAsync(healthCheckId);

            // Admin and medical staff can view all results
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                return Ok(results);
            }

            // Students and parents can only view their own results
            // This would require additional logic to verify ownership
            return Forbid("Bạn chỉ có thể xem kết quả kiểm tra sức khỏe của mình");
        }

        // GET: api/VaccinationHealthCheckResult/medicalstaff/5 - Get results by medical staff ID
        [HttpGet("medicalstaff/{medicalStaffId}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheckResult>>> GetResultsByMedicalStaff(string medicalStaffId)
        {
            var results = await _resultService.GetByMedicalStaffIdAsync(medicalStaffId);
            return Ok(results);
        }

        // GET: api/VaccinationHealthCheckResult/recommendation/approved - Get results by recommendation
        [HttpGet("recommendation/{recommendation}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheckResult>>> GetResultsByRecommendation(string recommendation)
        {
            var results = await _resultService.GetByRecommendationAsync(recommendation);
            return Ok(results);
        }

        // POST: api/VaccinationHealthCheckResult/perform-check - Perform health check
        [HttpPost("perform-check")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<ActionResult<VaccinationHealthCheckResult>> PerformHealthCheck([FromBody] PerformHealthCheckRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Người dùng chưa đăng nhập");
                }

                var result = await _resultService.PerformHealthCheckAsync(request.HealthCheckId, userId, request.HealthCheckResult);
                return Ok(result);
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

        // GET: api/VaccinationHealthCheckResult/plan/5/abnormal - Get abnormal results for a plan
        [HttpGet("plan/{planId}/abnormal")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationHealthCheckResult>>> GetAbnormalResults(string planId)
        {
            var results = await _resultService.GetAbnormalResultsAsync(planId);
            return Ok(results);
        }

        // GET: api/VaccinationHealthCheckResult/5/requires-consultation - Check if result requires consultation
        [HttpGet("{id}/requires-consultation")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<bool>> CheckRequiresConsultation(string id)
        {
            var requiresConsultation = await _resultService.RequiresConsultationAsync(id);
            return Ok(requiresConsultation);
        }

        // PUT: api/VaccinationHealthCheckResult/5 - Update health check result
        [HttpPut("{id}")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> UpdateResult(string id, VaccinationHealthCheckResult result)
        {
            try
            {
                result.Id = id;
                await _resultService.UpdateAsync(result);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/VaccinationHealthCheckResult/5 - Only admin can delete results
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteResult(string id)
        {
            try
            {
                await _resultService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }

    public class PerformHealthCheckRequest
    {
        public string HealthCheckId { get; set; } = string.Empty;
        public VaccinationHealthCheckResult HealthCheckResult { get; set; } = new VaccinationHealthCheckResult();
    }
} 