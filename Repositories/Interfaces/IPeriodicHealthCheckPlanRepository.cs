using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IPeriodicHealthCheckPlanRepository
    {
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync();
        Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(int id);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(Guid creatorId);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync();
        Task CreatePlanAsync(PeriodicHealthCheckPlan plan);
        Task UpdatePlanAsync(PeriodicHealthCheckPlan plan);
        Task DeletePlanAsync(int id);
        Task<bool> PlanExistsAsync(int id);
    }
}