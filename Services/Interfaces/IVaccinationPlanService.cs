using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IVaccinationPlanService
    {
        Task<IEnumerable<VaccinationPlan>> GetAllVaccinationPlansAsync();
        Task<VaccinationPlan?> GetVaccinationPlanByIdAsync(string id);
        Task<IEnumerable<VaccinationPlan>> GetVaccinationPlansByCreatorIdAsync(string creatorID);
        Task<IEnumerable<VaccinationPlan>> GetUpcomingVaccinationPlansAsync();
        Task<VaccinationPlan> CreateVaccinationPlanAsync(VaccinationPlan plan);
        Task UpdateVaccinationPlanAsync(string id, VaccinationPlan plan);
        Task DeleteVaccinationPlanAsync(string id);
        Task<VaccinationPlan?> GetByIdAsync(string id);
    }
}