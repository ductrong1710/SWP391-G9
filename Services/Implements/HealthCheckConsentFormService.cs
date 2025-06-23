using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services.implements
{
    public class HealthCheckConsentFormService : IHealthCheckConsentFormService
    {
        private readonly IHealthCheckConsentFormRepository _consentFormRepository;

        public HealthCheckConsentFormService(IHealthCheckConsentFormRepository consentFormRepository)
        {
            _consentFormRepository = consentFormRepository;
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetAllConsentFormsAsync()
        {
            return await _consentFormRepository.GetAllConsentFormsAsync();
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(string id)
        {
            return await _consentFormRepository.GetConsentFormByIdAsync(id);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(string planID)
        {
            return await _consentFormRepository.GetConsentFormsByPlanIdAsync(planID);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(string studentID)
        {
            return await _consentFormRepository.GetConsentFormsByStudentIdAsync(studentID);
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(string planID, string studentID)
        {
            return await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(planID, studentID);
        }

        public async Task<HealthCheckConsentForm> CreateConsentFormAsync(HealthCheckConsentForm form)
        {
            var existingForm = await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(form.HealthCheckPlanID, form.StudentID);
            if (existingForm != null)
                throw new InvalidOperationException("A consent form already exists for this student and plan");

            await _consentFormRepository.CreateConsentFormAsync(form);
            return form;
        }

        public async Task UpdateConsentFormAsync(string id, HealthCheckConsentForm form)
        {
            if (id != form.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _consentFormRepository.ConsentFormExistsAsync(id))
                throw new KeyNotFoundException("Consent form not found");

            await _consentFormRepository.UpdateConsentFormAsync(form);
        }

        public async Task DeleteConsentFormAsync(string id)
        {
            if (!await _consentFormRepository.ConsentFormExistsAsync(id))
                throw new KeyNotFoundException("Consent form not found");

            await _consentFormRepository.DeleteConsentFormAsync(id);
        }
    }
}