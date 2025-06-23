using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IVaccinationConsentFormService
    {
        Task<IEnumerable<VaccinationConsentForm>> GetAllVaccinationConsentFormsAsync();
        Task<VaccinationConsentForm?> GetVaccinationConsentFormByIdAsync(string id);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByPlanIdAsync(string planID);
        Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByStudentIdAsync(string studentID);
        Task<VaccinationConsentForm?> GetConsentFormByPlanAndStudentAsync(string planID, string studentID);
        Task<VaccinationConsentForm> CreateVaccinationConsentFormAsync(VaccinationConsentForm form);
        Task UpdateVaccinationConsentFormAsync(string id, VaccinationConsentForm form);
        Task DeleteVaccinationConsentFormAsync(string id);
    }
}