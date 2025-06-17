using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

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

        public async Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(int id)
        {
            return await _consentFormRepository.GetConsentFormByIdAsync(id);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(int planId)
        {
            return await _consentFormRepository.GetConsentFormsByPlanIdAsync(planId);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId)
        {
            return await _consentFormRepository.GetConsentFormsByStudentIdAsync(studentId);
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId)
        {
            return await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(planId, studentId);
        }

        public async Task<HealthCheckConsentForm> CreateConsentFormAsync(HealthCheckConsentForm form)
        {
            var existingForm = await _consentFormRepository.GetConsentFormByPlanAndStudentAsync(form.HealthCheckPlanId, form.StudentId);
            if (existingForm != null)
                throw new InvalidOperationException("A consent form already exists for this student and plan");

            await _consentFormRepository.CreateConsentFormAsync(form);
            return form;
        }

        public async Task UpdateConsentFormAsync(int id, HealthCheckConsentForm form)
        {
            if (id != form.Id)
                throw new ArgumentException("ID mismatch");

            if (!await _consentFormRepository.ConsentFormExistsAsync(id))
                throw new KeyNotFoundException("Consent form not found");

            await _consentFormRepository.UpdateConsentFormAsync(form);
        }

        public async Task DeleteConsentFormAsync(int id)
        {
            if (!await _consentFormRepository.ConsentFormExistsAsync(id))
                throw new KeyNotFoundException("Consent form not found");

            await _consentFormRepository.DeleteConsentFormAsync(id);
        }
    }
}