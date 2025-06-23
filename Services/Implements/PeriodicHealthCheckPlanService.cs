using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services.implements
{
    public class PeriodicHealthCheckPlanService : IPeriodicHealthCheckPlanService
    {
        private readonly IPeriodicHealthCheckPlanRepository _planRepository;

        public PeriodicHealthCheckPlanService(IPeriodicHealthCheckPlanRepository planRepository)
        {
            _planRepository = planRepository;
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetAllPlansAsync()
        {
            return await _planRepository.GetAllPlansAsync();
        }

        public async Task<PeriodicHealthCheckPlan?> GetPlanByIdAsync(string id)
        {
            return await _planRepository.GetPlanByIdAsync(id);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetPlansByCreatorIdAsync(string creatorID)
        {
            return await _planRepository.GetPlansByCreatorIdAsync(creatorID);
        }

        public async Task<IEnumerable<PeriodicHealthCheckPlan>> GetUpcomingPlansAsync()
        {
            return await _planRepository.GetUpcomingPlansAsync();
        }

        public async Task<PeriodicHealthCheckPlan> CreatePlanAsync(PeriodicHealthCheckPlan plan)
        {
            await _planRepository.CreatePlanAsync(plan);
            return plan;
        }

        public async Task UpdatePlanAsync(string id, PeriodicHealthCheckPlan plan)
        {
            if (id != plan.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _planRepository.PlanExistsAsync(id))
                throw new KeyNotFoundException("Health check plan not found");

            await _planRepository.UpdatePlanAsync(plan);
        }

        public async Task DeletePlanAsync(string id)
        {
            if (!await _planRepository.PlanExistsAsync(id))
                throw new KeyNotFoundException("Health check plan not found");

            await _planRepository.DeletePlanAsync(id);
        }
    }
}