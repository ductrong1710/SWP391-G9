using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IHealthCheckResultRepository
    {
        Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync();
        Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id);
        Task<HealthCheckResult?> GetHealthCheckResultByConsentIdAsync(int consentId);
        Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByCheckerAsync(string checker);
        Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<HealthCheckResult>> GetPendingConsultationsAsync();
        Task CreateHealthCheckResultAsync(HealthCheckResult result);
        Task UpdateHealthCheckResultAsync(HealthCheckResult result);
        Task DeleteHealthCheckResultAsync(int id);
        Task<bool> HealthCheckResultExistsAsync(int id);
        Task<bool> HasResultForConsentAsync(int consentId);
    }
}