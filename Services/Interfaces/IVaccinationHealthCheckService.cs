using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IVaccinationHealthCheckService
    {
        Task<IEnumerable<VaccinationHealthCheck>> GetAllAsync();
        Task<VaccinationHealthCheck?> GetByIdAsync(string id);
        Task<VaccinationHealthCheck> AddAsync(VaccinationHealthCheck healthCheck);
        Task UpdateAsync(VaccinationHealthCheck healthCheck);
        Task DeleteAsync(string id);
        
        // Specific methods for vaccination health check workflow
        Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAsync(string planId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByParentIdAsync(string parentId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByStatusAsync(string status);
        
        // Workflow methods
        Task<IEnumerable<VaccinationHealthCheck>> SendHealthCheckNotificationsAsync(string planId, List<string> studentIds);
        Task<VaccinationHealthCheck> ApproveHealthCheckAsync(string id, string parentId);
        Task<VaccinationHealthCheck> DenyHealthCheckAsync(string id, string parentId, string reason);
        Task<IEnumerable<VaccinationHealthCheck>> GetPendingHealthChecksAsync(string planId);
        Task<IEnumerable<VaccinationHealthCheck>> GetApprovedHealthChecksAsync(string planId);
    }
} 