using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IVaccinationHealthCheckResultService
    {
        Task<IEnumerable<VaccinationHealthCheckResult>> GetAllAsync();
        Task<VaccinationHealthCheckResult?> GetByIdAsync(string id);
        Task<VaccinationHealthCheckResult> AddAsync(VaccinationHealthCheckResult result);
        Task UpdateAsync(VaccinationHealthCheckResult result);
        Task DeleteAsync(string id);
        
        // Specific methods for health check results
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByHealthCheckIdAsync(string healthCheckId);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByMedicalStaffIdAsync(string medicalStaffId);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByRecommendationAsync(string recommendation);
        
        // Workflow methods
        Task<VaccinationHealthCheckResult> PerformHealthCheckAsync(string healthCheckId, string medicalStaffId, VaccinationHealthCheckResult result);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetAbnormalResultsAsync(string planId);
        Task<bool> RequiresConsultationAsync(string resultId);
    }
} 