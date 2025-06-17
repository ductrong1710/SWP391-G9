using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationResultRepository
    {
        Task<IEnumerable<VaccinationResult>> GetAllVaccinationResultsAsync();
        Task<VaccinationResult?> GetVaccinationResultByIdAsync(int id);
        Task<VaccinationResult?> GetVaccinationResultByConsentFormIdAsync(int consentFormId);
        Task<IEnumerable<VaccinationResult>> GetVaccinationResultsByVaccineTypeAsync(int vaccineTypeId);
        Task CreateVaccinationResultAsync(VaccinationResult result);
        Task UpdateVaccinationResultAsync(VaccinationResult result);
        Task DeleteVaccinationResultAsync(int id);
        Task<bool> VaccinationResultExistsAsync(int id);
    }
}