using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationPlanRepository
    {
        Task<IEnumerable<VaccinationPlan>> GetAllVaccinationPlansAsync();
        Task<VaccinationPlan?> GetVaccinationPlanByIdAsync(int id);
        Task<IEnumerable<VaccinationPlan>> GetVaccinationPlansByCreatorIdAsync(Guid creatorId);
        Task<IEnumerable<VaccinationPlan>> GetUpcomingVaccinationPlansAsync();
        Task CreateVaccinationPlanAsync(VaccinationPlan plan);
        Task UpdateVaccinationPlanAsync(VaccinationPlan plan);
        Task DeleteVaccinationPlanAsync(int id);
        Task<bool> VaccinationPlanExistsAsync(int id);
    }
}