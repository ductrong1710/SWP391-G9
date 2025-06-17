using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class HealthCheckConsentFormRepository : IHealthCheckConsentFormRepository
    {
        private readonly ApplicationDbContext _context;

        public HealthCheckConsentFormRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetAllConsentFormsAsync()
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .ToListAsync();
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(int id)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(int planId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .Where(f => f.HealthCheckPlanId == planId)
                .ToListAsync();
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .Where(f => f.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .FirstOrDefaultAsync(f => f.HealthCheckPlanId == planId && f.StudentId == studentId);
        }

        public async Task CreateConsentFormAsync(HealthCheckConsentForm form)
        {
            await _context.HealthCheckConsentForms.AddAsync(form);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateConsentFormAsync(HealthCheckConsentForm form)
        {
            _context.Entry(form).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteConsentFormAsync(int id)
        {
            var form = await GetConsentFormByIdAsync(id);
            if (form != null)
            {
                _context.HealthCheckConsentForms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ConsentFormExistsAsync(int id)
        {
            return await _context.HealthCheckConsentForms.AnyAsync(f => f.Id == id);
        }
    }
}