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
    public class VaccinationWorkflowController : ControllerBase
    {
        private readonly IVaccinationHealthCheckService _healthCheckService;
        private readonly IVaccinationHealthCheckResultService _resultService;
        private readonly IVaccinationConsultationService _consultationService;
        private readonly IVaccinationPlanService _planService;

        public VaccinationWorkflowController(
            IVaccinationHealthCheckService healthCheckService,
            IVaccinationHealthCheckResultService resultService,
            IVaccinationConsultationService consultationService,
            IVaccinationPlanService planService)
        {
            _healthCheckService = healthCheckService;
            _resultService = resultService;
            _consultationService = consultationService;
            _planService = planService;
        }

        // POST: api/VaccinationWorkflow/start - Bước 1: Bắt đầu luồng tiêm chủng
        [HttpPost("start")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<WorkflowResponse>> StartVaccinationWorkflow([FromBody] StartWorkflowRequest request)
        {
            try
            {
                // 1. Gửi phiếu thông báo kiểm tra y tế cho phụ huynh
                var healthChecks = await _healthCheckService.SendHealthCheckNotificationsAsync(
                    request.PlanId, 
                    request.StudentIds
                );

                var response = new WorkflowResponse
                {
                    PlanId = request.PlanId,
                    Step = "HealthCheckNotificationsSent",
                    Message = $"Đã gửi {healthChecks.Count()} phiếu thông báo kiểm tra y tế",
                    HealthChecks = healthChecks.ToList(),
                    NextStep = "WaitForParentApproval"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/VaccinationWorkflow/plan/5/status - Xem trạng thái luồng tiêm chủng
        [HttpGet("plan/{planId}/status")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<WorkflowStatusResponse>> GetWorkflowStatus(string planId)
        {
            try
            {
                var plan = await _planService.GetByIdAsync(planId);
                if (plan == null)
                    return NotFound("Vaccination plan not found");

                var healthChecks = await _healthCheckService.GetByPlanIdAsync(planId);
                var pendingChecks = healthChecks.Where(h => h.Status == "Pending").Count();
                var approvedChecks = healthChecks.Where(h => h.Status == "Approved").Count();
                var deniedChecks = healthChecks.Where(h => h.Status == "Denied").Count();
                var completedChecks = healthChecks.Where(h => h.Status == "Completed").Count();

                var response = new WorkflowStatusResponse
                {
                    PlanId = planId,
                    PlanName = plan.PlanName,
                    TotalStudents = healthChecks.Count(),
                    PendingApprovals = pendingChecks,
                    ApprovedChecks = approvedChecks,
                    DeniedChecks = deniedChecks,
                    CompletedChecks = completedChecks,
                    CurrentStep = DetermineCurrentStep(healthChecks),
                    ProgressPercentage = CalculateProgress(healthChecks)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/VaccinationWorkflow/plan/5/prepare-examination - Bước 2: Chuẩn bị danh sách học sinh kiểm tra
        [HttpPost("plan/{planId}/prepare-examination")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<ExaminationPreparationResponse>> PrepareExaminationList(string planId)
        {
            try
            {
                var approvedHealthChecks = await _healthCheckService.GetApprovedHealthChecksAsync(planId);
                
                var response = new ExaminationPreparationResponse
                {
                    PlanId = planId,
                    TotalStudentsForExamination = approvedHealthChecks.Count(),
                    Students = approvedHealthChecks.Select(h => new StudentExaminationInfo
                    {
                        StudentId = h.StudentId ?? string.Empty,
                        HealthCheckId = h.Id ?? string.Empty,
                        StudentName = h.Student?.Username ?? "Unknown",
                        ParentName = h.Parent?.Username ?? "Unknown",
                        ApprovalDate = h.ResponseDate
                    }).ToList(),
                    Message = $"Đã chuẩn bị danh sách {approvedHealthChecks.Count()} học sinh để kiểm tra",
                    NextStep = "PerformHealthExamination"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/VaccinationWorkflow/perform-examination - Bước 3: Thực hiện kiểm tra và ghi nhận kết quả
        [HttpPost("perform-examination")]
        [Authorize(Roles = "MedicalStaff")]
        public async Task<ActionResult<ExaminationResultResponse>> PerformHealthExamination([FromBody] PerformExaminationRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized("User not authenticated");

                var result = await _resultService.PerformHealthCheckAsync(
                    request.HealthCheckId, 
                    userId, 
                    request.HealthCheckResult
                );

                var response = new ExaminationResultResponse
                {
                    HealthCheckId = request.HealthCheckId,
                    ResultId = result.Id,
                    Recommendation = result.VaccinationRecommendation ?? string.Empty,
                    Reason = result.RecommendationReason ?? string.Empty,
                    RequiresConsultation = await _resultService.RequiresConsultationAsync(result.Id),
                    Message = $"Đã hoàn thành kiểm tra sức khỏe cho học sinh",
                    NextStep = result.VaccinationRecommendation == "Approved" ? "ProceedToVaccination" : "ScheduleConsultation"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/VaccinationWorkflow/schedule-consultation - Bước 4a: Lập lịch hẹn tư vấn (nếu cần)
        [HttpPost("schedule-consultation")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<ConsultationResponse>> ScheduleConsultation([FromBody] ScheduleConsultationWorkflowRequest request)
        {
            try
            {
                var consultation = await _consultationService.ScheduleConsultationAsync(
                    request.HealthCheckResultId,
                    request.StudentId,
                    request.ParentId,
                    request.MedicalStaffId,
                    request.ScheduledDateTime,
                    request.Reason
                );

                var response = new ConsultationResponse
                {
                    ConsultationId = consultation.Id,
                    ScheduledDateTime = consultation.ScheduledDateTime,
                    Reason = consultation.Reason ?? string.Empty,
                    Message = "Đã lập lịch hẹn tư vấn cho phụ huynh",
                    NextStep = "WaitForConsultation"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // POST: api/VaccinationWorkflow/send-results - Bước 4b: Gửi kết quả cho phụ huynh
        [HttpPost("send-results")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<ResultsNotificationResponse>> SendResultsToParents([FromBody] SendResultsRequest request)
        {
            try
            {
                var results = await _resultService.GetByHealthCheckIdAsync(request.HealthCheckId);
                var result = results.FirstOrDefault();
                
                if (result == null)
                    return NotFound("Health check result not found");

                var response = new ResultsNotificationResponse
                {
                    HealthCheckId = request.HealthCheckId,
                    ResultId = result.Id,
                    Recommendation = result.VaccinationRecommendation ?? string.Empty,
                    Reason = result.RecommendationReason ?? string.Empty,
                    Message = $"Đã gửi kết quả kiểm tra sức khỏe cho phụ huynh",
                    RequiresFollowUp = result.VaccinationRecommendation != "Approved",
                    NextStep = result.VaccinationRecommendation == "Approved" ? "ProceedToVaccination" : "FollowUpRequired"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // GET: api/VaccinationWorkflow/plan/5/summary - Tóm tắt luồng tiêm chủng
        [HttpGet("plan/{planId}/summary")]
        [Authorize(Roles = "Admin,MedicalStaff")]
        public async Task<ActionResult<WorkflowSummaryResponse>> GetWorkflowSummary(string planId)
        {
            try
            {
                var plan = await _planService.GetByIdAsync(planId);
                var healthChecks = await _healthCheckService.GetByPlanIdAsync(planId);
                var results = new List<VaccinationHealthCheckResult>();
                var consultations = new List<VaccinationConsultation>();

                foreach (var healthCheck in healthChecks)
                {
                    var healthCheckResults = await _resultService.GetByHealthCheckIdAsync(healthCheck.Id);
                    results.AddRange(healthCheckResults);
                }

                var response = new WorkflowSummaryResponse
                {
                    PlanId = planId,
                    PlanName = plan?.PlanName ?? "Unknown",
                    TotalStudents = healthChecks.Count(),
                    CompletedExaminations = results.Count(),
                    ApprovedForVaccination = results.Count(r => r.VaccinationRecommendation == "Approved"),
                    DeferredVaccinations = results.Count(r => r.VaccinationRecommendation == "Deferred"),
                    NotRecommended = results.Count(r => r.VaccinationRecommendation == "NotRecommended"),
                    ConsultationsScheduled = consultations.Count(c => c.Status == "Scheduled"),
                    ConsultationsCompleted = consultations.Count(c => c.Status == "Completed"),
                    WorkflowStatus = DetermineWorkflowStatus(healthChecks, results, consultations)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        private string DetermineCurrentStep(IEnumerable<VaccinationHealthCheck> healthChecks)
        {
            if (!healthChecks.Any())
                return "NotStarted";

            if (healthChecks.All(h => h.Status == "Pending"))
                return "WaitingForParentApproval";

            if (healthChecks.Any(h => h.Status == "Approved"))
                return "ReadyForExamination";

            if (healthChecks.Any(h => h.Status == "Completed"))
                return "ExaminationInProgress";

            return "Completed";
        }

        private int CalculateProgress(IEnumerable<VaccinationHealthCheck> healthChecks)
        {
            if (!healthChecks.Any())
                return 0;

            var total = healthChecks.Count();
            var completed = healthChecks.Count(h => h.Status == "Completed");
            
            return (int)((double)completed / total * 100);
        }

        private string DetermineWorkflowStatus(IEnumerable<VaccinationHealthCheck> healthChecks, IEnumerable<VaccinationHealthCheckResult> results, IEnumerable<VaccinationConsultation> consultations)
        {
            if (!healthChecks.Any())
                return "NotStarted";

            if (healthChecks.All(h => h.Status == "Completed") && results.Count() == healthChecks.Count())
                return "Completed";

            if (healthChecks.Any(h => h.Status == "Completed"))
                return "InProgress";

            if (healthChecks.Any(h => h.Status == "Approved"))
                return "ReadyForExamination";

            return "WaitingForApproval";
        }
    }

    // Request/Response Models
    public class StartWorkflowRequest
    {
        public string PlanId { get; set; } = string.Empty;
        public List<string> StudentIds { get; set; } = new List<string>();
    }

    public class WorkflowResponse
    {
        public string PlanId { get; set; } = string.Empty;
        public string Step { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<VaccinationHealthCheck> HealthChecks { get; set; } = new List<VaccinationHealthCheck>();
        public string NextStep { get; set; } = string.Empty;
    }

    public class WorkflowStatusResponse
    {
        public string PlanId { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public int TotalStudents { get; set; }
        public int PendingApprovals { get; set; }
        public int ApprovedChecks { get; set; }
        public int DeniedChecks { get; set; }
        public int CompletedChecks { get; set; }
        public string CurrentStep { get; set; } = string.Empty;
        public int ProgressPercentage { get; set; }
    }

    public class ExaminationPreparationResponse
    {
        public string PlanId { get; set; } = string.Empty;
        public int TotalStudentsForExamination { get; set; }
        public List<StudentExaminationInfo> Students { get; set; } = new List<StudentExaminationInfo>();
        public string Message { get; set; } = string.Empty;
        public string NextStep { get; set; } = string.Empty;
    }

    public class StudentExaminationInfo
    {
        public string StudentId { get; set; } = string.Empty;
        public string HealthCheckId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public DateTime? ApprovalDate { get; set; }
    }

    public class PerformExaminationRequest
    {
        public string HealthCheckId { get; set; } = string.Empty;
        public VaccinationHealthCheckResult HealthCheckResult { get; set; } = new VaccinationHealthCheckResult();
    }

    public class ExaminationResultResponse
    {
        public string HealthCheckId { get; set; } = string.Empty;
        public string ResultId { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public bool RequiresConsultation { get; set; }
        public string Message { get; set; } = string.Empty;
        public string NextStep { get; set; } = string.Empty;
    }

    public class ScheduleConsultationWorkflowRequest
    {
        public string HealthCheckResultId { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string ParentId { get; set; } = string.Empty;
        public string MedicalStaffId { get; set; } = string.Empty;
        public DateTime ScheduledDateTime { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

    public class ConsultationResponse
    {
        public string ConsultationId { get; set; } = string.Empty;
        public DateTime? ScheduledDateTime { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string NextStep { get; set; } = string.Empty;
    }

    public class SendResultsRequest
    {
        public string HealthCheckId { get; set; } = string.Empty;
    }

    public class ResultsNotificationResponse
    {
        public string HealthCheckId { get; set; } = string.Empty;
        public string ResultId { get; set; } = string.Empty;
        public string Recommendation { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool RequiresFollowUp { get; set; }
        public string NextStep { get; set; } = string.Empty;
    }

    public class WorkflowSummaryResponse
    {
        public string PlanId { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public int TotalStudents { get; set; }
        public int CompletedExaminations { get; set; }
        public int ApprovedForVaccination { get; set; }
        public int DeferredVaccinations { get; set; }
        public int NotRecommended { get; set; }
        public int ConsultationsScheduled { get; set; }
        public int ConsultationsCompleted { get; set; }
        public string WorkflowStatus { get; set; } = string.Empty;
    }
} 