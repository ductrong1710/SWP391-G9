using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IHealthCheckConsentFormService
    {
        Task<IEnumerable<HealthCheckConsentForm>> GetAllConsentFormsAsync();
        Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(int id);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(int planId);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId);
        Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId);
        Task<HealthCheckConsentForm> CreateConsentFormAsync(HealthCheckConsentForm form);
        Task UpdateConsentFormAsync(int id, HealthCheckConsentForm form);
        Task DeleteConsentFormAsync(int id);
    }
}