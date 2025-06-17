using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IPeriodicHealthCheckPlanService
    {
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync();
        Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(int id);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(Guid creatorId);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync();
        Task<PeriodicHealthCheckPlan> CreatePlanAsync(PeriodicHealthCheckPlan plan);
        Task UpdatePlanAsync(int id, PeriodicHealthCheckPlan plan);
        Task DeletePlanAsync(int id);
    }
}