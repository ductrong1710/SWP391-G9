using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationResultRepository
    {
        Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync();
        Task<VaccinationResult?> GetVaccinationResultByIdAsync(string id);
        Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(string consentFormId);
        Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(string vaccineTypeId);
        Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByPlanAsync(string planId);
        Task CreateVaccinationResultAsync(VaccinationResult result);
        Task UpdateVaccinationResultAsync(VaccinationResult result);
        Task DeleteVaccinationResultAsync(string id);
        Task<bool> VaccinationResultExistsAsync(string id);
        Task<bool> VaccinationResultExistsByConsentFormAsync(string consentFormId);
        Task<VaccinationResult> CreateOrUpdateVaccinationResultAsync(VaccinationResultDto resultDto);
    }
}