using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IHealthRecordRepository
    {
        Task<IEnumerable<HealthRecord>> GetAllHealthRecordsAsync();
        Task<HealthRecord?> GetHealthRecordByIdAsync(Guid id);
        Task<HealthRecord?> GetHealthRecordByStudentIdAsync(Guid studentId);
        Task CreateHealthRecordAsync(HealthRecord healthRecord);
        Task UpdateHealthRecordAsync(HealthRecord healthRecord);
        Task DeleteHealthRecordAsync(Guid id);
        Task<bool> HealthRecordExistsAsync(Guid id);
    }
}