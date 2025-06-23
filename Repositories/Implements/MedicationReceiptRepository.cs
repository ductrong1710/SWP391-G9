using Businessobjects.Data;
using Businessobjects.Models;
using Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class MedicationReceiptRepository : GenericRepository<MedicationReceipt>, IMedicationReceiptRepository
    {
        public MedicationReceiptRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<MedicationReceipt>> GetAllAsync()
        {
            return await _dbSet.Include(r => r.Parent).Include(r => r.MedicalStaff).ToListAsync();
        }

        public override async Task<MedicationReceipt?> GetByIdAsync(string id)
        {
            return await _dbSet.Include(r => r.Parent).Include(r => r.MedicalStaff).FirstOrDefaultAsync(r => r.ReceiptId == id);
        }

        public async Task<IEnumerable<MedicationReceipt>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet.Where(m => m.StudentId == studentId).ToListAsync();
        }

        public async Task<IEnumerable<MedicationReceipt>> GetByMedicationIdAsync(string medicationId)
        {
            return await _dbSet.Where(m => m.MedicationId == medicationId).ToListAsync();
        }

        public async Task<IEnumerable<MedicationReceipt>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(m => m.ReceiptDate >= startDate && m.ReceiptDate <= endDate).ToListAsync();
        }
    }
} 