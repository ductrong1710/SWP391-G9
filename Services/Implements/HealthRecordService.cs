using Businessobjects.Models;
using Repositories.Interfaces;
using Services.interfaces;
using Services.Interfaces; // Add this using directive

namespace Services.implements
{
    public class HealthRecordService : IHealthRecordService
    {
        private readonly IHealthRecordRepository _healthRecordRepository;

        public HealthRecordService(IHealthRecordRepository healthRecordRepository)
        {
            _healthRecordRepository = healthRecordRepository;
        }

        public async Task<IEnumerable<HealthRecord>> GetAllHealthRecordsAsync()
        {
            return await _healthRecordRepository.GetAllHealthRecordsAsync();
        }

        public async Task<HealthRecord?> GetHealthRecordByIdAsync(Guid id)
        {
            return await _healthRecordRepository.GetHealthRecordByIdAsync(id);
        }

        public async Task<HealthRecord?> GetHealthRecordByStudentIdAsync(Guid studentId)
        {
            return await _healthRecordRepository.GetHealthRecordByStudentIdAsync(studentId);
        }

        public async Task<HealthRecord> CreateHealthRecordAsync(HealthRecord healthRecord)
        {
            await _healthRecordRepository.CreateHealthRecordAsync(healthRecord);
            return healthRecord;
        }

        public async Task UpdateHealthRecordAsync(Guid id, HealthRecord healthRecord)
        {
            if (id != healthRecord.HealthRecordId)
                throw new ArgumentException("ID mismatch");

            if (!await _healthRecordRepository.HealthRecordExistsAsync(id))
                throw new KeyNotFoundException("Health record not found");

            await _healthRecordRepository.UpdateHealthRecordAsync(healthRecord);
        }

        public async Task DeleteHealthRecordAsync(Guid id)
        {
            if (!await _healthRecordRepository.HealthRecordExistsAsync(id))
                throw new KeyNotFoundException("Health record not found");

            await _healthRecordRepository.DeleteHealthRecordAsync(id);
        }
    }
}