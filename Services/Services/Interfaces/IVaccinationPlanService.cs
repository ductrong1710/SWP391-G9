using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IVaccinationPlanService
    {
        Task<IEnumerable<VaccinationPlan>> GetAllVaccinationPlansAsync();
        Task<VaccinationPlan?> GetVaccinationPlanByIdAsync(string id);
        Task<IEnumerable<VaccinationPlan>> GetVaccinationPlansByCreatorIdAsync(string creatorId);
        Task<IEnumerable<VaccinationPlan>> GetUpcomingVaccinationPlansAsync();
        Task<VaccinationPlan> CreateVaccinationPlanAsync(VaccinationPlan plan);
        Task UpdateVaccinationPlanAsync(string id, VaccinationPlan plan);
        Task DeleteVaccinationPlanAsync(string id);
    }
}