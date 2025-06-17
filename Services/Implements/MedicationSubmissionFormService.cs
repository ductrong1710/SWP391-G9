using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class MedicationSubmissionFormService : IMedicationSubmissionFormService
    {
        private readonly IMedicationSubmissionFormRepository _repository;

        public MedicationSubmissionFormService(IMedicationSubmissionFormRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MedicationSubmissionForm>> GetAllFormsAsync()
        {
            return await _repository.GetAllFormsAsync();
        }

        public async Task<MedicationSubmissionForm?> GetFormByIdAsync(int id)
        {
            return await _repository.GetFormByIdAsync(id);
        }

        public async Task<IEnumerable<MedicationSubmissionForm>> GetFormsByStudentIdAsync(Guid studentId)
        {
            return await _repository.GetFormsByStudentIdAsync(studentId);
        }

        public async Task<MedicationSubmissionForm> CreateFormAsync(MedicationSubmissionForm form)
        {
            await _repository.CreateFormAsync(form);
            return form;
        }

        public async Task UpdateFormAsync(int id, MedicationSubmissionForm form)
        {
            if (id != form.Id)
                throw new ArgumentException("ID mismatch");

            if (!await _repository.FormExistsAsync(id))
                throw new KeyNotFoundException("Medication submission form not found");

            await _repository.UpdateFormAsync(form);
        }

        public async Task DeleteFormAsync(int id)
        {
            if (!await _repository.FormExistsAsync(id))
                throw new KeyNotFoundException("Medication submission form not found");

            await _repository.DeleteFormAsync(id);
        }
    }
}