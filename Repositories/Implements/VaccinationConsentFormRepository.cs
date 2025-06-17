using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories
{
    public class VaccinationConsentFormRepository : IVaccinationConsentFormRepository
    {
        private readonly ApplicationDbContext _context;

        public VaccinationConsentFormRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetAllVaccinationConsentFormsAsync()
        {
            return await _context.VaccinationConsentForms
                .Include(f => f.VaccinationPlan)
                .Include(f => f.Student)
                .Include(f => f.VaccinationResult)
                .ToListAsync();
        }

        public async Task<VaccinationConsentForm?> GetVaccinationConsentFormByIdAsync(int id)
        {
            return await _context.VaccinationConsentForms
                .Include(f => f.VaccinationPlan)
                .Include(f => f.Student)
                .Include(f => f.VaccinationResult)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByPlanIdAsync(int planId)
        {
            return await _context.VaccinationConsentForms
                .Include(f => f.VaccinationPlan)
                .Include(f => f.Student)
                .Include(f => f.VaccinationResult)
                .Where(f => f.VaccinationPlanId == planId)
                .ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsentForm>> GetConsentFormsByStudentIdAsync(Guid studentId)
        {
            return await _context.VaccinationConsentForms
                .Include(f => f.VaccinationPlan)
                .Include(f => f.Student)
                .Include(f => f.VaccinationResult)
                .Where(f => f.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<VaccinationConsentForm?> GetConsentFormByPlanAndStudentAsync(int planId, Guid studentId)
        {
            return await _context.VaccinationConsentForms
                .Include(f => f.VaccinationPlan)
                .Include(f => f.Student)
                .Include(f => f.VaccinationResult)
                .FirstOrDefaultAsync(f => f.VaccinationPlanId == planId && f.StudentId == studentId);
        }

        public async Task CreateVaccinationConsentFormAsync(VaccinationConsentForm form)
        {
            await _context.VaccinationConsentForms.AddAsync(form);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVaccinationConsentFormAsync(VaccinationConsentForm form)
        {
            _context.Entry(form).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVaccinationConsentFormAsync(int id)
        {
            var form = await GetVaccinationConsentFormByIdAsync(id);
            if (form != null)
            {
                _context.VaccinationConsentForms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VaccinationConsentFormExistsAsync(int id)
        {
            return await _context.VaccinationConsentForms.AnyAsync(f => f.Id == id);
        }
    }
}