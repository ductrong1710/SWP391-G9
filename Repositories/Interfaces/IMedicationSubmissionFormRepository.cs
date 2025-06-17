using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IMedicationSubmissionFormRepository
    {
        Task<IEnumerable<MedicationSubmissionForm>> GetAllFormsAsync();
        Task<MedicationSubmissionForm?> GetFormByIdAsync(int id);
        Task<IEnumerable<MedicationSubmissionForm>> GetFormsByStudentIdAsync(Guid studentId);
        Task CreateFormAsync(MedicationSubmissionForm form);
        Task UpdateFormAsync(MedicationSubmissionForm form);
        Task DeleteFormAsync(int id);
        Task<bool> FormExistsAsync(int id);
    }
}