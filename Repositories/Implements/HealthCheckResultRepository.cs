using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class HealthCheckResultRepository : IHealthCheckResultRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthCheckResultRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HealthCheckResult>> GetAllHealthCheckResultsAsync()
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .ToListAsync();
        }

        public async Task<HealthCheckResult?> GetHealthCheckResultByIdAsync(int id)
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<HealthCheckResult?> GetHealthCheckResultByConsentIdAsync(int consentId)
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .FirstOrDefaultAsync(r => r.HealthCheckConsentId == consentId);
        }

        public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByCheckerAsync(string checker)
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .Where(r => r.Checker == checker)
                .OrderByDescending(r => r.CheckUpDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<HealthCheckResult>> GetHealthCheckResultsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .Where(r => r.CheckUpDate >= startDate && r.CheckUpDate <= endDate)
                .OrderByDescending(r => r.CheckUpDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<HealthCheckResult>> GetPendingConsultationsAsync()
        {
            return await _context.HealthCheckResults
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.Student)
                .Include(r => r.HealthCheckConsent)
                    .ThenInclude(c => c.HealthCheckPlan)
                .Where(r => r.ConsultationRecommended && r.ConsultationAppointmentDate >= DateTime.Today)
                .OrderBy(r => r.ConsultationAppointmentDate)
                .ToListAsync();
        }

        public async Task CreateHealthCheckResultAsync(HealthCheckResult result)
        {
            await _context.HealthCheckResults.AddAsync(result);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateHealthCheckResultAsync(HealthCheckResult result)
        {
            _context.Entry(result).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteHealthCheckResultAsync(int id)
        {
            var result = await GetHealthCheckResultByIdAsync(id);
            if (result != null)
            {
                _context.HealthCheckResults.Remove(result);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> HealthCheckResultExistsAsync(int id)
        {
            return await _context.HealthCheckResults.AnyAsync(r => r.Id == id);
        }

        public async Task<bool> HasResultForConsentAsync(int consentId)
        {
            return await _context.HealthCheckResults.AnyAsync(r => r.HealthCheckConsentId == consentId);
        }
    }
}