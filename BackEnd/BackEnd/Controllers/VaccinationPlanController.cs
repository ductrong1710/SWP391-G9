using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VaccinationPlanController : ControllerBase
    {
        private readonly IVaccinationPlanService _planService;
        private readonly IVaccinationConsentFormService _consentFormService;
        private readonly INotificationService _notificationService;
        private readonly IVaccineTypeService _vaccineTypeService;

        public VaccinationPlanController(
            IVaccinationPlanService planService,
            IVaccinationConsentFormService consentFormService,
            INotificationService notificationService,
            IVaccineTypeService vaccineTypeService)
        {
            _planService = planService;
            _consentFormService = consentFormService;
            _notificationService = notificationService;
            _vaccineTypeService = vaccineTypeService;
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

        // GET: api/VaccinationPlan/vaccine-info/{vaccineId}
        [HttpGet("vaccine-info/{vaccineId}")]
        public async Task<ActionResult<object>> GetVaccineInfo(string vaccineId)
        {
            try
            {
                var vaccine = await _vaccineTypeService.GetVaccineTypeByIdAsync(vaccineId);
                if (vaccine == null)
                    return NotFound("Vaccine not found");

                var diseases = vaccine.VaccineDiseases?.ToList() ?? new List<VaccineDisease>();
                
                var vaccineInfo = new
                {
                    VaccinationID = vaccine.VaccinationID,
                    VaccineName = vaccine.VaccineName,
                    Description = vaccine.Description,
                    TotalDiseases = diseases.Count,
                    DiseaseNames = diseases.Select(d => d.DiseaseName).ToList(),
                    RequiredDoses = diseases.FirstOrDefault()?.RequiredDoses ?? 0,
                    IntervalBetweenDoses = diseases.FirstOrDefault()?.IntervalBetweenDoses ?? 0,
                    Diseases = diseases.Select(d => new
                    {
                        DiseaseName = d.DiseaseName,
                        RequiredDoses = d.RequiredDoses,
                        IntervalBetweenDoses = d.IntervalBetweenDoses
                    }).ToList()
                };

                return Ok(vaccineInfo);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error getting vaccine info: {ex.Message}");
            }
        }

        // Helper method để extract vaccine ID từ PlanName
        private string ExtractVaccineIdFromPlanName(string planName)
        {
            // Giả sử PlanName có format: "Tiêm chủng [VaccineID] - [Description]"
            // Hoặc có thể chứa vaccine ID ở đâu đó
            if (string.IsNullOrEmpty(planName))
                return string.Empty;

            // Tìm pattern VCxxxx trong PlanName
            var match = System.Text.RegularExpressions.Regex.Match(planName, @"VC\d{4}");
            if (match.Success)
                return match.Value;

            // Nếu không tìm thấy VCxxxx, thử map theo tên vaccine
            var vaccineName = planName.ToLower();
            if (vaccineName.Contains("viêm gan b") || vaccineName.Contains("hepatitis b"))
                return "VC0001"; // Giả sử VC0001 là Viêm gan B
            else if (vaccineName.Contains("sởi") || vaccineName.Contains("measles"))
                return "VC0002"; // Giả sử VC0002 là Sởi
            else if (vaccineName.Contains("quai bị") || vaccineName.Contains("mumps"))
                return "VC0003"; // Giả sử VC0003 là Quai bị
            else if (vaccineName.Contains("rubella"))
                return "VC0004"; // Giả sử VC0004 là Rubella
            else
                return "VC0001"; // Default fallback
        }

        // POST: api/VaccinationPlan
        [HttpPost]
        public async Task<ActionResult<VaccinationPlan>> CreateVaccinationPlan(VaccinationPlan plan)
        {
            try
            {
                // Validation: Kiểm tra DoseNumber nếu có
                if (plan.DoseNumber.HasValue && plan.DoseNumber.Value > 0)
                {
                    // Lấy thông tin vaccine từ PlanName (giả sử PlanName chứa vaccine ID)
                    var vaccineId = ExtractVaccineIdFromPlanName(plan.PlanName);
                    if (!string.IsNullOrEmpty(vaccineId))
                    {
                        var vaccine = await _vaccineTypeService.GetVaccineTypeByIdAsync(vaccineId);
                        if (vaccine != null)
                        {
                            var maxDoses = vaccine.VaccineDiseases?.Max(d => d.RequiredDoses) ?? 0;
                            if (plan.DoseNumber.Value > maxDoses)
                            {
                                return BadRequest($"Số mũi tiêm ({plan.DoseNumber.Value}) không được lớn hơn số mũi cần thiết của vaccine ({maxDoses})");
                            }
                        }
                    }
                }

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

        // Gửi thông báo kế hoạch tiêm chủng đến phụ huynh
        [HttpPost("{id}/send-notifications")]
        public async Task<IActionResult> SendNotifications(string id)
        {
            // Lấy kế hoạch tiêm chủng
            var plan = await _planService.GetVaccinationPlanByIdAsync(id);
            if (plan == null)
                return NotFound();

            // Lấy danh sách học sinh theo grade
            var dbContext = HttpContext.RequestServices.GetService(typeof(Businessobjects.Data.ApplicationDbContext)) as Businessobjects.Data.ApplicationDbContext;
            List<Businessobjects.Models.Profile> students;
            if (plan.Grade == null || plan.Grade == "Toàn trường")
            {
                students = dbContext.Profiles.Where(p => p.ClassID != null).ToList();
            }
            else
            {
                int gradeNum = int.Parse(plan.Grade);
                int start = (gradeNum - 6) * 10 + 1;
                int end = start + 9;
                var classIds = Enumerable.Range(start, 10)
                    .Select(i => $"CL{(i).ToString("D4")}")
                    .ToList();
                students = dbContext.Profiles.Where(p => p.ClassID != null && classIds.Contains(p.ClassID)).ToList();
            }

            // Lấy danh sách ParentID từ bảng Health_Record
            var studentUserIds = students.Select(s => s.UserID).ToList();
            var parentIds = dbContext.HealthRecords
                .Where(hr => studentUserIds.Contains(hr.StudentID))
                .Select(hr => hr.ParentID)
                .Distinct()
                .ToList();

            foreach (var student in students)
            {
                var healthRecord = dbContext.HealthRecords.FirstOrDefault(hr => hr.StudentID == student.UserID);
                if (healthRecord == null || string.IsNullOrEmpty(healthRecord.ParentID)) continue;
                
                var parentId = healthRecord.ParentID;
                var studentName = student.Name ?? "học sinh";

                // Lấy thông tin vaccine từ plan name
                string vaccineId = ExtractVaccineIdFromPlanName(plan.PlanName);
                int doseNumber = plan.DoseNumber ?? 1;

                // Debug logging
                Console.WriteLine($"DEBUG: Student {student.UserID} - Plan: {plan.PlanName} - VaccineId: {vaccineId} - DoseNumber: {doseNumber}");

                // Kiểm tra xem học sinh đã tiêm mũi tiêm này của vắc xin này chưa
                bool hasVaccinated = false;
                
                // Kiểm tra trong bảng VaccinationHistory
                var vaccinationHistory = dbContext.VaccinationHistory
                    .Where(vh => vh.StudentID == student.UserID && 
                                vh.VaccineTypeID == vaccineId)
                    .OrderByDescending(vh => vh.VaccinationDate)
                    .FirstOrDefault();

                if (vaccinationHistory != null)
                {
                    // Đếm số mũi đã tiêm cho vắc xin này
                    var doseCount = dbContext.VaccinationHistory
                        .Count(vh => vh.StudentID == student.UserID && 
                                    vh.VaccineTypeID == vaccineId);
                    
                    // Nếu đã tiêm đủ số mũi hoặc nhiều hơn mũi hiện tại
                    if (doseCount >= doseNumber)
                    {
                        hasVaccinated = true;
                    }
                }

                // Kiểm tra thêm trong bảng VaccinationResult (nếu có)
                if (!hasVaccinated)
                {
                    var vaccinationResult = dbContext.VaccinationResults
                        .Where(vr => vr.ConsentFormID != null)
                        .Join(dbContext.VaccinationConsentForms, 
                              vr => vr.ConsentFormID, 
                              vcf => vcf.ID, 
                              (vr, vcf) => new { vr, vcf })
                        .Where(x => x.vcf.StudentID == student.UserID && 
                                   x.vr.VaccineTypeID == vaccineId &&
                                   x.vr.VaccinationStatus == "Completed")
                        .OrderByDescending(x => x.vr.RecordedDate)
                        .FirstOrDefault();

                    if (vaccinationResult != null)
                    {
                        // Đếm số mũi đã tiêm thành công cho vắc xin này
                        var completedDoseCount = dbContext.VaccinationResults
                            .Where(vr => vr.ConsentFormID != null)
                            .Join(dbContext.VaccinationConsentForms, 
                                  vr => vr.ConsentFormID, 
                                  vcf => vcf.ID, 
                                  (vr, vcf) => new { vr, vcf })
                            .Count(x => x.vcf.StudentID == student.UserID && 
                                       x.vr.VaccineTypeID == vaccineId &&
                                       x.vr.VaccinationStatus == "Completed");
                        
                        if (completedDoseCount >= doseNumber)
                        {
                            hasVaccinated = true;
                        }
                    }
                }

                // Debug logging
                Console.WriteLine($"DEBUG: Student {student.UserID} - HasVaccinated: {hasVaccinated}");

                // Chỉ gửi thông báo nếu học sinh chưa tiêm mũi này
                if (!hasVaccinated)
                {
                    Console.WriteLine($"DEBUG: Sending notification to student {student.UserID}");
                    var message = $"Kế hoạch tiêm chủng '{plan.PlanName}' đã được cập nhật. Vui lòng xác nhận cho học sinh: {studentName.ToUpper()}";
                // Lấy consent form theo planId và studentId
                var consentForm = dbContext.VaccinationConsentForms.FirstOrDefault(cf => cf.VaccinationPlanID == plan.ID && cf.StudentID == student.UserID);
                if (consentForm == null)
                {
                    // Tạo mới consent form nếu chưa có
                    consentForm = new Businessobjects.Models.VaccinationConsentForm
                    {
                        ID = Guid.NewGuid().ToString().Substring(0, 6).ToUpper(),
                        VaccinationPlanID = plan.ID,
                        StudentID = student.UserID,
                        ParentID = parentId,
                        ConsentStatus = null,
                        ResponseTime = null,
                        ReasonForDenial = null
                    };
                    dbContext.VaccinationConsentForms.Add(consentForm);
                    dbContext.SaveChanges();
                }
                var notification = new Notification
                {
                    NotificationID = Guid.NewGuid().ToString(),
                    UserID = parentId,
                    Title = "Xác nhận kế hoạch tiêm chủng",
                    Message = message,
                    CreatedAt = DateTime.Now,
                    IsRead = false,
                    ConsentFormID = consentForm.ID
                };
                await _notificationService.CreateNotificationAsync(notification);

                // Gửi email cho phụ huynh
                var profile = dbContext.Profiles.FirstOrDefault(p => p.UserID == parentId);
                var parentEmail = profile?.Email;
                string className = "(không rõ)";
                if (!string.IsNullOrEmpty(student.ClassID))
                {
                    var schoolClass = dbContext.SchoolClasses.FirstOrDefault(c => c.ClassID == student.ClassID);
                    if (schoolClass != null)
                        className = schoolClass.ClassName;
                }
                string scheduledDate = plan.ScheduledDate.HasValue ? plan.ScheduledDate.Value.ToString("dd/MM/yyyy") : "(vui lòng xem chi tiết trên hệ thống)";
                if (!string.IsNullOrEmpty(parentEmail))
                {
                    var gmailService = new GmailEmailService("credentials/credentials.json", "token.json");
                    string subject = "Thông báo và xác nhận lịch tiêm chủng cho học sinh";
                    string body = $@"
Kính gửi Quý phụ huynh,

Nhà trường xin trân trọng thông báo về lịch tiêm chủng sắp tới dành cho học sinh:

- Họ và tên học sinh: {studentName}
- Lớp: {className}
- Thời gian tiêm chủng: {scheduledDate}
- Địa điểm: Phòng Y tế trường

Để đảm bảo quyền lợi và sức khỏe cho các em học sinh, kính mong Quý phụ huynh vui lòng đăng nhập vào hệ thống quản lý sức khỏe học đường và xác nhận sự đồng ý cho con em mình tham gia tiêm chủng.

**Hướng dẫn xác nhận:**
1. Truy cập trang web của nhà trường: http://localhost:3000/
2. Đăng nhập bằng tài khoản phụ huynh.
3. Vào mục ""Lịch tiêm chủng"" và thực hiện xác nhận cho học sinh.

Nếu Quý phụ huynh có bất kỳ thắc mắc nào về lịch tiêm chủng, loại vắc xin, hoặc cần hỗ trợ thêm thông tin, xin vui lòng liên hệ với nhà trường qua số điện thoại hoặc email trên hệ thống.

Xin chân thành cảm ơn sự hợp tác của Quý phụ huynh!

Trân trọng,
Ban Y tế Trường
";
                    await gmailService.SendEmailAsync(
                        parentEmail,
                        subject,
                        body,
                        isHtml: false
                    );
                }
                }
            }
            return Ok(new { message = "Thông báo đã được gửi thành công cho các phụ huynh có học sinh chưa tiêm mũi tiêm này" });
        }
    }
}