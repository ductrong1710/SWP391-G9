using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationHealthCheckResultRepository : IGenericRepository<VaccinationHealthCheckResult>
    {
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByHealthCheckIdAsync(string healthCheckId);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByMedicalStaffIdAsync(string medicalStaffId);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetByRecommendationAsync(string recommendation);
        Task<IEnumerable<VaccinationHealthCheckResult>> GetAbnormalResultsByPlanIdAsync(string planId);
    }
} 