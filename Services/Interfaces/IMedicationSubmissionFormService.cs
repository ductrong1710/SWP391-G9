using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IMedicationSubmissionFormService
    {
        Task<IEnumerable<MedicationSubmissionForm>> GetAllFormsAsync();
        Task<MedicationSubmissionForm?> GetFormByIdAsync(string id);
        Task<IEnumerable<MedicationSubmissionForm>> GetFormsByStudentIdAsync(string studentID);
        Task<MedicationSubmissionForm> CreateFormAsync(MedicationSubmissionForm form);
        Task UpdateFormAsync(string id, MedicationSubmissionForm form);
        Task DeleteFormAsync(string id);
    }
}