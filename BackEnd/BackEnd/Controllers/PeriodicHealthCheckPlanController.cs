using Microsoft.AspNetCore.Mvc;
using Businessobjects.Models;
using Services;
using Services.Interfaces;

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
        public async Task<ActionResult<IEnumerable<object>>> GetPlans()
        {
            var plans = await _planService.GetAllPlansWithClassNameAsync();
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

        // GET: api/PeriodicHealthCheckPlan/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetPlansByStatus(string status)
        {
            var plans = await _planService.GetPlansByStatusAsync(status);
            return Ok(plans);
        }

        // GET: api/PeriodicHealthCheckPlan/class/{classId}
        [HttpGet("class/{classId}")]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetPlansByClassId(string classId)
        {
            var plans = await _planService.GetPlansByClassIdAsync(classId);
            return Ok(plans);
        }

        // GET: api/PeriodicHealthCheckPlan/createddate?start=yyyy-MM-dd&end=yyyy-MM-dd
        [HttpGet("createddate")]
        public async Task<ActionResult<IEnumerable<PeriodicHealthCheckPlan>>> GetPlansByCreatedDate([FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            var plans = await _planService.GetPlansByCreatedDateRangeAsync(start, end);
            return Ok(plans);
        }

        // POST: api/PeriodicHealthCheckPlan
        [HttpPost]
        public async Task<ActionResult<PeriodicHealthCheckPlan>> CreatePlan(PeriodicHealthCheckPlan plan)
        {
            var createdPlan = await _planService.CreatePlanAsync(plan);
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

        [HttpPost("{id}/send-notifications")]
        public async Task<IActionResult> SendNotifications(string id)
        {
            var plan = await _planService.GetPlanByIdAsync(id);
            if (plan == null)
                return NotFound();

            var dbContext = HttpContext.RequestServices.GetService(typeof(Businessobjects.Data.ApplicationDbContext)) as Businessobjects.Data.ApplicationDbContext;
            // Lấy danh sách học sinh thuộc lớp này
            var students = dbContext.Profiles.Where(p => p.ClassID == plan.ClassID).ToList();
            var studentUserIds = students.Select(s => s.UserID).ToList();
            var healthRecords = dbContext.HealthRecords.Where(hr => studentUserIds.Contains(hr.StudentID)).ToList();

            foreach (var record in healthRecords)
            {
                if (!string.IsNullOrEmpty(record.ParentID))
                {
                    // Tìm hoặc tạo consent form cho học sinh này với plan hiện tại
                    var consentForm = dbContext.HealthCheckConsentForms
                        .FirstOrDefault(cf => cf.HealthCheckPlanID == plan.ID && cf.StudentID == record.StudentID && cf.ParentID == record.ParentID);

                    if (consentForm == null)
                    {
                        // Tạo mới consent form nếu chưa có
                        consentForm = new HealthCheckConsentForm
                        {
                            ID = GenerateConsentFormId(dbContext),
                            HealthCheckPlanID = plan.ID,
                            StudentID = record.StudentID,
                            ParentID = record.ParentID,
                            StatusID = 3, // 3: Waiting
                            ResponseTime = null,
                            ReasonForDenial = null
                        };
                        dbContext.HealthCheckConsentForms.Add(consentForm);
                        dbContext.SaveChanges();
                    }

                    var notification = new Notification
                    {
                        NotificationID = Guid.NewGuid().ToString(),
                        UserID = record.ParentID,
                        Title = "Thông báo kế hoạch khám sức khỏe",
                        Message = $"Kế hoạch khám sức khỏe '{plan.PlanName}' đã được cập nhật. Vui lòng xác nhận cho con bạn.",
                        CreatedAt = DateTime.Now,
                        IsRead = false,
                        ConsentFormID = consentForm.ID // Gán ID của consent form
                    };
                    await _notificationService.CreateNotificationAsync(notification);

                    // Gửi email cho phụ huynh
                    var profile = dbContext.Profiles.FirstOrDefault(p => p.UserID == record.ParentID);
                    var parentEmail = profile?.Email;
                    var student = dbContext.Profiles.FirstOrDefault(p => p.UserID == record.StudentID);
                    var studentName = student?.Name ?? "học sinh";
                    string className = "(không rõ)";
                    if (!string.IsNullOrEmpty(student?.ClassID))
                    {
                        var schoolClass = dbContext.SchoolClasses.FirstOrDefault(c => c.ClassID == student.ClassID);
                        if (schoolClass != null)
                            className = schoolClass.ClassName;
                    }
                    string scheduledDate = plan.ScheduleDate.HasValue ? plan.ScheduleDate.Value.ToString("dd/MM/yyyy") : "(vui lòng xem chi tiết trên hệ thống)";
                    
                    if (!string.IsNullOrEmpty(parentEmail))
                    {
                        var gmailService = new GmailEmailService("credentials/credentials.json", "token.json");
                        string subject = "Thông báo và xác nhận lịch khám sức khỏe cho học sinh";
                        string body = $@"
Kính gửi Quý phụ huynh,

Nhà trường xin trân trọng thông báo về lịch khám sức khỏe định kỳ sắp tới dành cho học sinh:

- Họ và tên học sinh: {studentName}
- Lớp: {className}
- Thời gian khám sức khỏe: {scheduledDate}
- Địa điểm: Phòng Y tế trường
- Nội dung khám: Khám sức khỏe định kỳ

Để đảm bảo quyền lợi và sức khỏe cho các em học sinh, kính mong Quý phụ huynh vui lòng đăng nhập vào hệ thống quản lý sức khỏe học đường và xác nhận sự đồng ý cho con em mình tham gia khám sức khỏe.

**Hướng dẫn xác nhận:**
1. Truy cập trang web của nhà trường: http://localhost:3000/
2. Đăng nhập bằng tài khoản phụ huynh.
3. Vào mục ""Lịch khám sức khỏe"" và thực hiện xác nhận cho học sinh.

Nếu Quý phụ huynh có bất kỳ thắc mắc nào về lịch khám sức khỏe hoặc cần hỗ trợ thêm thông tin, xin vui lòng liên hệ với nhà trường qua số điện thoại hoặc email trên hệ thống.

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
            return Ok(new { message = "Notifications sent!" });
        }

        // Hàm sinh mã tự động cho consent form dạng HC0001, HC0002, ...
        private string GenerateConsentFormId(Businessobjects.Data.ApplicationDbContext dbContext)
        {
            var lastId = dbContext.HealthCheckConsentForms
                .Where(cf => cf.ID.StartsWith("HC"))
                .OrderByDescending(cf => cf.ID)
                .Select(cf => cf.ID)
                .FirstOrDefault();

            int number = 1;
            if (!string.IsNullOrEmpty(lastId) && int.TryParse(lastId.Substring(2), out int n))
            {
                number = n + 1;
            }
            return $"HC{number.ToString("D4")}";
        }
    }
}