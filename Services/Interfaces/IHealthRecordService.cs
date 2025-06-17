using Businessobjects.Models;

namespace Services.interfaces
{
    public interface IHealthRecordService
    {
        Task<IEnumerable<HealthRecord>> GetAllHealthRecordsAsync();
        Task<HealthRecord?> GetHealthRecordByIdAsync(Guid id);
        Task<HealthRecord?> GetHealthRecordByStudentIdAsync(Guid studentId);
        Task<HealthRecord> CreateHealthRecordAsync(HealthRecord healthRecord);
        Task UpdateHealthRecordAsync(Guid id, HealthRecord healthRecord);
        Task DeleteHealthRecordAsync(Guid id);
    }
}