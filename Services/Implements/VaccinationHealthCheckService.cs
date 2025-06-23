using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Services.Implements
{
    public class VaccinationHealthCheckService : IVaccinationHealthCheckService
    {
        private readonly IVaccinationHealthCheckRepository _repository;
        private readonly IUserRepository _userRepository;

        public VaccinationHealthCheckService(IVaccinationHealthCheckRepository repository, IUserRepository userRepository)
        {
            _repository = repository;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<VaccinationHealthCheck?> GetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<VaccinationHealthCheck> AddAsync(VaccinationHealthCheck healthCheck)
        {
            healthCheck.Id = GenerateId();
            healthCheck.NotificationDate = DateTime.Now;
            healthCheck.Status = "Pending";
            
            return await _repository.AddAsync(healthCheck);
        }

        public async Task UpdateAsync(VaccinationHealthCheck healthCheck)
        {
            await _repository.UpdateAsync(healthCheck);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAsync(string planId)
        {
            return await _repository.GetByPlanIdAsync(planId);
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByStudentIdAsync(string studentId)
        {
            return await _repository.GetByStudentIdAsync(studentId);
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByParentIdAsync(string parentId)
        {
            return await _repository.GetByParentIdAsync(parentId);
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByStatusAsync(string status)
        {
            return await _repository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> SendHealthCheckNotificationsAsync(string planId, List<string> studentIds)
        {
            var healthChecks = new List<VaccinationHealthCheck>();
            
            foreach (var studentId in studentIds)
            {
                var student = await _userRepository.GetByIdAsync(studentId);
                if (student != null && student.RoleID == "STUDENT")
                {
                    // Find parent for this student (assuming parent-student relationship exists)
                    var parent = await _userRepository.GetParentByStudentIdAsync(studentId);
                    if (parent == null)
                    {
                        throw new KeyNotFoundException($"Không tìm thấy phụ huynh cho học sinh {studentId}");
                    }
                    
                    var healthCheck = new VaccinationHealthCheck
                    {
                        StudentId = studentId,
                        ParentId = parent.UserID,
                        VaccinationPlanId = planId,
                        NotificationDate = DateTime.Now,
                        Status = "Pending"
                    };
                    
                    var created = await AddAsync(healthCheck);
                    healthChecks.Add(created);
                }
            }
            
            return healthChecks;
        }

        public async Task<VaccinationHealthCheck> ApproveHealthCheckAsync(string id, string parentId)
        {
            var healthCheck = await GetByIdAsync(id);
            if (healthCheck == null)
                throw new KeyNotFoundException("Health check not found");
                
            if (healthCheck.ParentId != parentId)
                throw new InvalidOperationException("You can only approve your own health checks");
                
            healthCheck.Status = "Approved";
            healthCheck.ResponseDate = DateTime.Now;
            
            await UpdateAsync(healthCheck);
            return healthCheck;
        }

        public async Task<VaccinationHealthCheck> DenyHealthCheckAsync(string id, string parentId, string reason)
        {
            var healthCheck = await GetByIdAsync(id);
            if (healthCheck == null)
                throw new KeyNotFoundException("Health check not found");
                
            if (healthCheck.ParentId != parentId)
                throw new InvalidOperationException("You can only deny your own health checks");
                
            healthCheck.Status = "Denied";
            healthCheck.ResponseDate = DateTime.Now;
            healthCheck.ParentNotes = reason;
            
            await UpdateAsync(healthCheck);
            return healthCheck;
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetPendingHealthChecksAsync(string planId)
        {
            return await _repository.GetByPlanIdAndStatusAsync(planId, "Pending");
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetApprovedHealthChecksAsync(string planId)
        {
            return await _repository.GetByPlanIdAndStatusAsync(planId, "Approved");
        }

        private string GenerateId()
        {
            using (var sha256 = SHA256.Create())
            {
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                return Convert.ToHexString(hash).Substring(0, 6).ToUpper();
            }
        }
    }
} 