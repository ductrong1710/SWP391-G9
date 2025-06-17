using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationConsentFormRepository
    {
        Task<IEnumerable<VaccinationConsentForm>> GetAllVaccinationConsentFormsAsync();
        Task<VaccinationConsentForm?> GetVaccinationConsentFormByIdAsync(int id);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByPlanIdAsync(int planId);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId);
        Task<VaccinationConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId);
        Task CreateVaccinationConsentFormAsync(VaccinationConsentForm form);
        Task UpdateVaccinationConsentFormAsync(VaccinationConsentForm form);
        Task DeleteVaccinationConsentFormAsync(int id);
        Task<bool> VaccinationConsentFormExistsAsync(int id);
    }
}