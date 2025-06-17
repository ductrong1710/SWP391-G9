using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class HealthRecordRepository : IHealthRecordRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthRecordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HealthRecord>> GetAllHealthRecordsAsync()
        {
            return await _context.HealthRecords
                .Include(h => h.Student)
                .ToListAsync();
        }

        public async Task<HealthRecord?> GetHealthRecordByIdAsync(Guid id)
        {
            return await _context.HealthRecords
                .Include(h => h.Student)
                .FirstOrDefaultAsync(h => h.HealthRecordId == id);
        }

        public async Task<HealthRecord?> GetHealthRecordByStudentIdAsync(Guid studentId)
        {
            return await _context.HealthRecords
                .Include(h => h.Student)
                .FirstOrDefaultAsync(h => h.StudentId == studentId);
        }

        public async Task CreateHealthRecordAsync(HealthRecord healthRecord)
        {
            await _context.HealthRecords.AddAsync(healthRecord);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateHealthRecordAsync(HealthRecord healthRecord)
        {
            _context.Entry(healthRecord).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteHealthRecordAsync(Guid id)
        {
            var healthRecord = await GetHealthRecordByIdAsync(id);
            if (healthRecord != null)
            {
                _context.HealthRecords.Remove(healthRecord);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HealthRecordExistsAsync(Guid id)
        {
            return await _context.HealthRecords.AnyAsync(h => h.HealthRecordId == id);
        }
    }
}