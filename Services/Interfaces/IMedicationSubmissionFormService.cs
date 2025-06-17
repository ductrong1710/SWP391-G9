using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IMedicationSubmissionFormService
    {
        Task<IEnumerable<MedicationSubmissionForm>> GetAllFormsAsync();
        Task<MedicationSubmissionForm?> GetFormByIdAsync(int id);
        Task<IEnumerable<MedicationSubmissionForm>> GetFormsByStudentIdAsync(Guid studentId);
        Task<MedicationSubmissionForm> CreateFormAsync(MedicationSubmissionForm form);
        Task UpdateFormAsync(int id, MedicationSubmissionForm form);
        Task DeleteFormAsync(int id);
    }
}