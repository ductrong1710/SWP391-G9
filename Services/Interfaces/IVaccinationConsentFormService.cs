using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IVaccinationConsentFormService
    {
        Task<IEnumerable<VaccinationConsentForm>> GetAllVaccinationConsentFormsAsync();
        Task<VaccinationConsentForm?> GetVaccinationConsentFormByIdAsync(int id);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByPlanIdAsync(int planId);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId);
        Task<VaccinationConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId);
        Task<VaccinationConsentForm> CreateVaccinationConsentFormAsync(VaccinationConsentForm form);
        Task UpdateVaccinationConsentFormAsync(int id, VaccinationConsentForm form);
        Task DeleteVaccinationConsentFormAsync(int id);
    }
}