using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class VaccinationConsentFormService : IVaccinationConsentFormService
    {
        private readonly IVaccinationConsentFormRepository _consentFormRepository;
        private readonly IVaccinationPlanRepository _planRepository;

        public VaccinationConsentFormService(
            IVaccinationConsentFormRepository consentFormRepository,
            IVaccinationPlanRepository planRepository)
        {
            _consentFormRepository = consentFormRepository;
            _planRepository = planRepository;
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetAllVaccinationConsentFormsAsync()
        {
            return await _consentFormRepository.GetAllVaccinationConsentFormsAsync();
        }

        public async Task<VaccinationConsentForm?> GetVaccinationConsentFormByIdAsync(int id)
        {
            return await _consentFormRepository.GetVaccinationConsentFormByIdAsync(id);
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByPlanIdAsync(int planId)
        {
            return await _consentFormRepository.GetConsentFormsByPlanIdAsync(planId);
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId)
        {
            return await _consentFormRepository.GetConsentFormsByStudentIdAsync(studentId);
        }

        public async Task<VaccinationConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId)
        {
            return await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(planId, studentId);
        }

        public async Task<VaccinationConsentForm> CreateVaccinationConsentFormAsync(VaccinationConsentForm form)
        {
            var plan = await _planRepository.GetVaccinationPlanByIdAsync(form.VaccinationPlanId);
            if (plan == null)
                throw new KeyNotFoundException("Vaccination plan not found");

            if (plan.Status != "Planned" && plan.Status != "InProgress")
                throw new InvalidOperationException("Cannot submit consent form for a completed or cancelled vaccination plan");

            if (plan.ScheduledDate < DateTime.Today)
                throw new InvalidOperationException("Cannot submit consent form for a past vaccination plan");

            var existingForm = await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(form.VaccinationPlanId, form.StudentId);
            if (existingForm != null)
                throw new InvalidOperationException("A consent form already exists for this student and vaccination plan");

            await _consentFormRepository.CreateVaccinationConsentFormAsync(form);
            return form;
        }

        public async Task UpdateVaccinationConsentFormAsync(int id, VaccinationConsentForm form)
        {
            if (id != form.Id)
                throw new ArgumentException("ID mismatch");

            if (!await _consentFormRepository.VaccinationConsentFormExistsAsync(id))
                throw new KeyNotFoundException("Vaccination consent form not found");

            var plan = await _planRepository.GetVaccinationPlanByIdAsync(form.VaccinationPlanId);
            if (plan == null)
                throw new KeyNotFoundException("Vaccination plan not found");

            if (plan.Status == "Completed" || plan.Status == "Cancelled")
                throw new InvalidOperationException("Cannot update consent form for a completed or cancelled vaccination plan");

            if (plan.ScheduledDate < DateTime.Today)
                throw new InvalidOperationException("Cannot update consent form for a past vaccination plan");

            await _consentFormRepository.UpdateVaccinationConsentFormAsync(form);
        }

        public async Task DeleteVaccinationConsentFormAsync(int id)
        {
            var form = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(id);
            if (form == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (form.VaccinationResult != null)
                throw new InvalidOperationException("Cannot delete a consent form that has an associated vaccination result");

            await _consentFormRepository.DeleteVaccinationConsentFormAsync(id);
        }
    }
}