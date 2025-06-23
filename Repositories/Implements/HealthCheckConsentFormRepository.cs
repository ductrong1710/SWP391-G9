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

        public async Task<HealthCheckConsentForm?> GetConsentFormByIdAsync(string id)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .FirstOrDefaultAsync(f => f.ID == id);
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByPlanIdAsync(string planId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .Where(f => f.HealthCheckPlanID == planId)
                .ToListAsync();
        }

        public async Task<IEnumerable<HealthCheckConsentForm>> GetConsentFormsByStudentIdAsync(string studentId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .Where(f => f.StudentID == studentId)
                .ToListAsync();
        }

        public async Task<HealthCheckConsentForm?> GetConsentFormByPlanAndStudentAsync(string planId, string studentId)
        {
            return await _context.HealthCheckConsentForms
                .Include(f => f.HealthCheckPlan)
                .Include(f => f.Student)
                .FirstOrDefaultAsync(f => f.HealthCheckPlanID == planId && f.StudentID == studentId);
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

        public async Task DeleteConsentFormAsync(string id)
        {
            var form = await GetConsentFormByIdAsync(id);
            if (form != null)
            {
                _context.HealthCheckConsentForms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ConsentFormExistsAsync(string id)
        {
            return await _context.HealthCheckConsentForms.AnyAsync(f => f.ID == id);
        }
    }
}