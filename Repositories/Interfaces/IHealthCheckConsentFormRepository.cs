using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IHealthCheckConsentFormRepository
    {
        Task<IEnumerable<HealthCheckConsentForm>> GetAllConsentFormsAsync();
        Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(int id);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(int planId);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId);
        Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId);
        Task CreateConsentFormAsync(HealthCheckConsentForm form);
        Task UpdateConsentFormAsync(HealthCheckConsentForm form);
        Task DeleteConsentFormAsync(int id);
        Task<bool> ConsentFormExistsAsync(int id);
    }
}