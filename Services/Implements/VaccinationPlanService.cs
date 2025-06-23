using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services.implements
{
    public class VaccinationPlanService : IVaccinationPlanService
    {
        private readonly IVaccinationPlanRepository _planRepository;

        public VaccinationPlanService(IVaccinationPlanRepository planRepository)
        {
            _planRepository = planRepository;
        }

        public async Task<IEnumerable<VaccinationPlan>> GetAllVaccinationPlansAsync()
        {
            return await _planRepository.GetAllVaccinationPlansAsync();
        }

        public async Task<VaccinationPlan?> GetVaccinationPlanByIdAsync(string id)
        {
            return await _planRepository.GetVaccinationPlanByIdAsync(id);
        }

        public async Task<IEnumerable<VaccinationPlan>> GetVaccinationPlansByCreatorIdAsync(string creatorID)
        {
            return await _planRepository.GetVaccinationPlansByCreatorIdAsync(creatorID);
        }

        public async Task<IEnumerable<VaccinationPlan>> GetUpcomingVaccinationPlansAsync()
        {
            return await _planRepository.GetUpcomingVaccinationPlansAsync();
        }

        public async Task<VaccinationPlan> CreateVaccinationPlanAsync(VaccinationPlan plan)
        {
            if (plan.ScheduledDate < DateTime.Today)
                throw new InvalidOperationException("Cannot create a vaccination plan with a past date");

            await _planRepository.CreateVaccinationPlanAsync(plan);
            return plan;
        }

        public async Task UpdateVaccinationPlanAsync(string id, VaccinationPlan plan)
        {
            if (id != plan.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _planRepository.VaccinationPlanExistsAsync(id))
                throw new KeyNotFoundException("Vaccination plan not found");

            if (plan.ScheduledDate < DateTime.Today)
                throw new InvalidOperationException("Cannot update a vaccination plan with a past date");

            await _planRepository.UpdateVaccinationPlanAsync(plan);
        }

        public async Task DeleteVaccinationPlanAsync(string id)
        {
            if (!await _planRepository.VaccinationPlanExistsAsync(id))
                throw new KeyNotFoundException("Vaccination plan not found");

            var plan = await _planRepository.GetVaccinationPlanByIdAsync(id);
            if (plan?.ConsentForms?.Any() == true)
                throw new InvalidOperationException("Cannot delete a vaccination plan that has associated consent forms");

            await _planRepository.DeleteVaccinationPlanAsync(id);
        }

        public async Task<VaccinationPlan?> GetByIdAsync(string id)
        {
            return await _planRepository.GetVaccinationPlanByIdAsync(id);
        }
    }
}