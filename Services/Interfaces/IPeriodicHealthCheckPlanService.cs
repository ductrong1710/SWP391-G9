using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IPeriodicHealthCheckPlanService
    {
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync();
        Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(string id);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(string creatorID);
        Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync();
        Task<PeriodicHealthCheckPlan> CreatePlanAsync(PeriodicHealthCheckPlan plan);
        Task UpdatePlanAsync(string id, PeriodicHealthCheckPlan plan);
        Task DeletePlanAsync(string id);
    }
}