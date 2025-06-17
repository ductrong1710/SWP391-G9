using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IHealthCheckResultService
    {
        Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync();
        Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id);
        Task<HealthCheckResult?> GetHealthCheckResultByConsentIdAsync(int consentId);
        Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByCheckerAsync(string checker);
        Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<HealthCheckResult>> GetPendingConsultationsAsync();
        Task<HealthCheckResult> CreateHealthCheckResultAsync(HealthCheckResult result);
        Task UpdateHealthCheckResultAsync(int id, HealthCheckResult result);
        Task DeleteHealthCheckResultAsync(int id);
    }
}