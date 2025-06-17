using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IVaccinationResultService
    {
        Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync();
        Task<VaccinationResult?> GetVaccinationResultByIdAsync(int id);
        Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(int consentFormId);
        Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(int vaccineTypeId);
        Task<VaccinationResult> CreateVaccinationResultAsync(VaccinationResult result);
        Task UpdateVaccinationResultAsync(int id, VaccinationResult result);
        Task DeleteVaccinationResultAsync(int id);
    }
}