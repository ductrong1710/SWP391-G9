using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class MedicationSubmissionFormRepository : IMedicationSubmissionFormRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicationSubmissionFormRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MedicationSubmissionForm>> GetAllFormsAsync()
        {
            return await _context.MedicationSubmissionForms
                .Include(m => m.Student)
                .ToListAsync();
        }

        public async Task<MedicationSubmissionForm?> GetFormByIdAsync(int id)
        {
            return await _context.MedicationSubmissionForms
                .Include(m => m.Student)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<MedicationSubmissionForm>> GetFormsByStudentIdAsync(Guid studentId)
        {
            return await _context.MedicationSubmissionForms
                .Include(m => m.Student)
                .Where(m => m.StudentId == studentId)
                .ToListAsync();
        }

        public async Task CreateFormAsync(MedicationSubmissionForm form)
        {
            await _context.MedicationSubmissionForms.AddAsync(form);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateFormAsync(MedicationSubmissionForm form)
        {
            _context.Entry(form).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFormAsync(int id)
        {
            var form = await GetFormByIdAsync(id);
            if (form != null)
            {
                _context.MedicationSubmissionForms.Remove(form);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> FormExistsAsync(int id)
        {
            return await _context.MedicationSubmissionForms.AnyAsync(m => m.Id == id);
        }
    }
}