using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationHealthCheckRepository : IGenericRepository<VaccinationHealthCheck>
    {
        Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAsync(string planId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByParentIdAsync(string parentId);
        Task<IEnumerable<VaccinationHealthCheck>> GetByStatusAsync(string status);
        Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAndStatusAsync(string planId, string status);
    }
} 