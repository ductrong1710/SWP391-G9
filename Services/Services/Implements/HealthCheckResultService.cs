using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class HealthCheckResultService : IHealthCheckResultService
    {
        private readonly IHealthCheckResultRepository _resultRepository;
        private readonly IHealthCheckConsentFormRepository _consentFormRepository;

        public HealthCheckResultService(
            IHealthCheckResultRepository resultRepository,
            IHealthCheckConsentFormRepository consentFormRepository)
        {
            _resultRepository = resultRepository;
            _consentFormRepository = consentFormRepository;
        }

        public async Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync()
        {
            return await _resultRepository.GetAllHealthCheckResultsAsync();
        }

        public async Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(string id)
        {
            return await _resultRepository.GetHealthCheckResultByIdAsync(id);
        }

        public async Task<HealthCheckResult?> GetHealthCheckResultByConsentIdAsync(string consentId)
        {
            return await _resultRepository.GetHealthCheckResultByConsentIdAsync(consentId);
        }

        public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByCheckerAsync(string checker)
        {
            return await _resultRepository.GetHealthCheckResultsByCheckerAsync(checker);
        }

        public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
                throw new ArgumentException("Start date must be before end date");

            return await _resultRepository.GetHealthCheckResultsByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<HealthCheckResult>> GetPendingConsultationsAsync()
        {
            return await _resultRepository.GetPendingConsultationsAsync();
        }

        public async Task<HealthCheckResult> CreateHealthCheckResultAsync(HealthCheckResult result)
        {
            var consentForm = await _consentFormRepository.GetConsentFormByIdAsync(result.HealthCheckConsentID);
            if (consentForm == null)
                throw new KeyNotFoundException("Health check consent form not found");

            if (consentForm.StatusID != 1) // 1: Accept
                throw new InvalidOperationException("Cannot create result for non-approved consent form");

            if (await _resultRepository.HasResultForConsentAsync(result.HealthCheckConsentID))
                throw new InvalidOperationException("A result already exists for this consent form");

            if (result.CheckUpDate > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for check-up date");

            if (result.NeedToContactParent == true && !result.FollowUpDate.HasValue)
                throw new InvalidOperationException("Follow-up date is required when parent contact is needed");

            if (result.FollowUpDate.HasValue && result.FollowUpDate.Value <= DateTime.Today)
                throw new InvalidOperationException("Follow-up date must be in the future");

            await _resultRepository.CreateHealthCheckResultAsync(result);
            return result;
        }

        public async Task UpdateHealthCheckResultAsync(string id, HealthCheckResult result)
        {
            if (id != result.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _resultRepository.HealthCheckResultExistsAsync(id))
                throw new KeyNotFoundException("Health check result not found");

            var consentForm = await _consentFormRepository.GetConsentFormByIdAsync(result.HealthCheckConsentID);
            if (consentForm == null)
                throw new KeyNotFoundException("Health check consent form not found");

            if (result.CheckUpDate > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for check-up date");

            if (result.NeedToContactParent == true && !result.FollowUpDate.HasValue)
                throw new InvalidOperationException("Follow-up date is required when parent contact is needed");

            if (result.FollowUpDate.HasValue && result.FollowUpDate.Value <= DateTime.Today)
                throw new InvalidOperationException("Follow-up date must be in the future");

            await _resultRepository.UpdateHealthCheckResultAsync(result);
        }

        public async Task DeleteHealthCheckResultAsync(string id)
        {
            if (!await _resultRepository.HealthCheckResultExistsAsync(id))
                throw new KeyNotFoundException("Health check result not found");

            await _resultRepository.DeleteHealthCheckResultAsync(id);
        }
    }
}