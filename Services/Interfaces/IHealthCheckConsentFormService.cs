using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IHealthCheckConsentFormService
    {
        Task<IEnumerable<HealthCheckConsentForm>> GetAllConsentFormsAsync();
        Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(string id);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(string planID);
        Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(string studentID);
        Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(string planID, string studentID);
        Task<HealthCheckConsentForm> CreateConsentFormAsync(HealthCheckConsentForm form);
        Task UpdateConsentFormAsync(string id, HealthCheckConsentForm form);
        Task DeleteConsentFormAsync(string id);
    }
}