using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class VaccinationResultService : IVaccinationResultService
    {
        private readonly IVaccinationResultRepository _resultRepository;
        private readonly IVaccinationConsentFormRepository _consentFormRepository;
        private readonly IVaccineTypeRepository _vaccineTypeRepository;

        public VaccinationResultService(
            IVaccinationResultRepository resultRepository,
            IVaccinationConsentFormRepository consentFormRepository,
            IVaccineTypeRepository vaccineTypeRepository)
        {
            _resultRepository = resultRepository;
            _consentFormRepository = consentFormRepository;
            _vaccineTypeRepository = vaccineTypeRepository;
        }

        public async Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync()
        {
            return await _resultRepository.GetAllVaccinationResultsAsync();
        }

        public async Task<VaccinationResult?> GetVaccinationResultByIdAsync(int id)
        {
            return await _resultRepository.GetVaccinationResultByIdAsync(id);
        }

        public async Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(int consentFormId)
        {
            return await _resultRepository.GetVaccinationResultByConsentFormIdAsync(consentFormId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(int vaccineTypeId)
        {
            return await _resultRepository.GetVaccinationResultsByVaccineTypeAsync(vaccineTypeId);
        }

        public async Task<VaccinationResult> CreateVaccinationResultAsync(VaccinationResult result)
        {
            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormId);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (consentForm.ConsentStatus != "Approved")
                throw new InvalidOperationException("Cannot create vaccination result for a non-approved consent form");

            if (await _resultRepository.GetVaccinationResultByConsentFormIdAsync(result.ConsentFormId) != null)
                throw new InvalidOperationException("A vaccination result already exists for this consent form");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeId))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            await _resultRepository.CreateVaccinationResultAsync(result);
            return result;
        }

        public async Task UpdateVaccinationResultAsync(int id, VaccinationResult result)
        {
            if (id != result.Id)
                throw new ArgumentException("ID mismatch");

            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormId);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeId))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            await _resultRepository.UpdateVaccinationResultAsync(result);
        }

        public async Task DeleteVaccinationResultAsync(int id)
        {
            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            await _resultRepository.DeleteVaccinationResultAsync(id);
        }
    }
}