using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IVaccinationPlanService
    {
        Task<IEnumerable<VaccinationPlan>> GetAllVaccinationPlansAsync();
        Task<VaccinationPlan?> GetVaccinationPlanByIdAsync(int id);
        Task<IEnumerable<VaccinationPlan>> GetVaccinationPlansByCreatorIdAsync(Guid creatorId);
        Task<IEnumerable<VaccinationPlan>> GetUpcomingVaccinationPlansAsync();
        Task<VaccinationPlan> CreateVaccinationPlanAsync(VaccinationPlan plan);
        Task UpdateVaccinationPlanAsync(int id, VaccinationPlan plan);
        Task DeleteVaccinationPlanAsync(int id);
    }
}