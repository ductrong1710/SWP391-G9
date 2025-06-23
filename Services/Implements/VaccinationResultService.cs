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

        public async Task<VaccinationResult?> GetVaccinationResultByIdAsync(string id)
        {
            return await _resultRepository.GetVaccinationResultByIdAsync(id);
        }

        public async Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(string consentFormId)
        {
            return await _resultRepository.GetVaccinationResultByConsentFormIdAsync(consentFormId);
        }

        public async Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(string vaccineTypeId)
        {
            return await _resultRepository.GetVaccinationResultsByVaccineTypeAsync(vaccineTypeId);
        }

        public async Task<VaccinationResult> CreateVaccinationResultAsync(VaccinationResult result)
        {
            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormID);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (consentForm.ConsentStatus != "Approved")
                throw new InvalidOperationException("Cannot create vaccination result for a non-approved consent form");

            if (await _resultRepository.GetVaccinationResultByConsentFormIdAsync(result.ConsentFormID) != null)
                throw new InvalidOperationException("A vaccination result already exists for this consent form");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeID))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.Value.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            await _resultRepository.CreateVaccinationResultAsync(result);
            return result;
        }

        public async Task UpdateVaccinationResultAsync(string id, VaccinationResult result)
        {
            if (id != result.ID)
                throw new ArgumentException("ID mismatch");

            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            var consentForm = await _consentFormRepository.GetVaccinationConsentFormByIdAsync(result.ConsentFormID);
            if (consentForm == null)
                throw new KeyNotFoundException("Vaccination consent form not found");

            if (!await _vaccineTypeRepository.VaccineTypeExistsAsync(result.VaccineTypeID))
                throw new KeyNotFoundException("Vaccine type not found");

            if (result.ActualVaccinationDate.Value.Date > DateTime.Today)
                throw new InvalidOperationException("Cannot set future date for actual vaccination date");

            await _resultRepository.UpdateVaccinationResultAsync(result);
        }

        public async Task DeleteVaccinationResultAsync(string id)
        {
            if (!await _resultRepository.VaccinationResultExistsAsync(id))
                throw new KeyNotFoundException("Vaccination result not found");

            await _resultRepository.DeleteVaccinationResultAsync(id);
        }
    }
}