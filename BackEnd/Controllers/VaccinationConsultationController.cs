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
    public class VaccinationConsultationController : ControllerBase
    {
        private readonly IVaccinationConsultationService _consultationService;

        public VaccinationConsultationController(IVaccinationConsultationService consultationService)
        {
            _consultationService = consultationService;
        }

        // GET: api/VaccinationConsultation - Admin and medical staff can view all
        [HttpGet]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetAllConsultations()
        {
            var consultations = await _consultationService.GetAllAsync();
            return Ok(consultations);
        }

        // GET: api/VaccinationConsultation/5 - Users can view their own consultations
        [HttpGet("{id}")]
        public async Task<ActionResult<VaccinationConsultation>> GetConsultation(string id)
        {
            var consultation = await _consultationService.GetByIdAsync(id);
            if (consultation == null)
            {
                return NotFound();
            }

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any consultation
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                return consultation;
            }

            // Students and parents can only view their own consultations
            if (consultation.StudentId == userId || consultation.ParentId == userId)
            {
                return consultation;
            }

            return Forbid("Bạn chỉ có thể xem các lịch tư vấn của mình");
        }

        // GET: api/VaccinationConsultation/student/5 - Get consultations by student ID
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetConsultationsByStudent(string studentId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any student's consultations
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                var consultations = await _consultationService.GetByStudentIdAsync(studentId);
                return Ok(consultations);
            }

            // Students and parents can only view their own consultations
            if (studentId == userId)
            {
                var consultations = await _consultationService.GetByStudentIdAsync(studentId);
                return Ok(consultations);
            }

            return Forbid("Bạn chỉ có thể xem các lịch tư vấn của mình");
        }

        // GET: api/VaccinationConsultation/parent/5 - Get consultations by parent ID
        [HttpGet("parent/{parentId}")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetConsultationsByParent(string parentId)
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // Admin and medical staff can view any parent's consultations
            if (userRole == "Admin" || userRole == "MedicalStaff")
            {
                var consultations = await _consultationService.GetByParentIdAsync(parentId);
                return Ok(consultations);
            }

            // Parents can only view their own consultations
            if (parentId == userId)
            {
                var consultations = await _consultationService.GetByParentIdAsync(parentId);
                return Ok(consultations);
            }

            return Forbid("Bạn chỉ có thể xem các lịch tư vấn của mình");
        }

        // GET: api/VaccinationConsultation/medicalstaff/5 - Get consultations by medical staff ID
        [HttpGet("medicalstaff/{medicalStaffId}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetConsultationsByMedicalStaff(string medicalStaffId)
        {
            var consultations = await _consultationService.GetByMedicalStaffIdAsync(medicalStaffId);
            return Ok(consultations);
        }

        // GET: api/VaccinationConsultation/status/scheduled - Get consultations by status
        [HttpGet("status/{status}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetConsultationsByStatus(string status)
        {
            var consultations = await _consultationService.GetByStatusAsync(status);
            return Ok(consultations);
        }

        // GET: api/VaccinationConsultation/upcoming/5 - Get upcoming consultations for medical staff
        [HttpGet("upcoming/{medicalStaffId}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetUpcomingConsultations(string medicalStaffId)
        {
            var consultations = await _consultationService.GetUpcomingConsultationsAsync(medicalStaffId);
            return Ok(consultations);
        }

        // GET: api/VaccinationConsultation/pending - Get pending consultations
        [HttpGet("pending")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<IEnumerable<VaccinationConsultation>>> GetPendingConsultations()
        {
            var consultations = await _consultationService.GetPendingConsultationsAsync();
            return Ok(consultations);
        }

        // POST: api/VaccinationConsultation/schedule - Schedule consultation
        [HttpPost("schedule")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<VaccinationConsultation>> ScheduleConsultation([FromBody] ScheduleConsultationRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Người dùng chưa đăng nhập");
                }

                var consultation = await _consultationService.ScheduleConsultationAsync(
                    request.HealthCheckResultId,
                    request.StudentId,
                    request.ParentId,
                    request.MedicalStaffId,
                    request.ScheduledDateTime,
                    request.Reason
                );

                return Ok(consultation);
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

        // POST: api/VaccinationConsultation/5/complete - Complete consultation
        [HttpPost("{id}/complete")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<IActionResult> CompleteConsultation(string id, [FromBody] CompleteConsultationRequest request)
        {
            try
            {
                var consultation = await _consultationService.CompleteConsultationAsync(id, request.Outcome, request.Recommendations);
                return Ok(consultation);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // POST: api/VaccinationConsultation/5/cancel - Cancel consultation
        [HttpPost("{id}/cancel")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<IActionResult> CancelConsultation(string id, [FromBody] CancelConsultationRequest request)
        {
            try
            {
                var consultation = await _consultationService.CancelConsultationAsync(id, request.Reason);
                return Ok(consultation);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // PUT: api/VaccinationConsultation/5 - Update consultation
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<IActionResult> UpdateConsultation(string id, VaccinationConsultation consultation)
        {
            try
            {
                consultation.Id = id;
                await _consultationService.UpdateAsync(consultation);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        // DELETE: api/VaccinationConsultation/5 - Only admin can delete consultations
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConsultation(string id)
        {
            try
            {
                await _consultationService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }

    public class ScheduleConsultationRequest
    {
        public string HealthCheckResultId { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string ParentId { get; set; } = string.Empty;
        public string MedicalStaffId { get; set; } = string.Empty;
        public DateTime ScheduledDateTime { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class CompleteConsultationRequest
    {
        public string Outcome { get; set; } = string.Empty;
        public string Recommendations { get; set; } = string.Empty;
    }

    public class CancelConsultationRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
} 