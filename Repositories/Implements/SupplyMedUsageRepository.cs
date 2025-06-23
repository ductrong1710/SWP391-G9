using Businessobjects.Data;
using Businessobjects.Models;
using Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class SupplyMedUsageRepository : GenericRepository<SupplyMedUsage>, ISupplyMedUsageRepository
    {
        public SupplyMedUsageRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<SupplyMedUsage>> GetAllAsync()
        {
            return await _dbSet.Include(s => s.MedicalIncident)
                .Include(s => s.MedicalSupply)
                .Include(s => s.Medication)
                .ToListAsync();
        }

        public override async Task<SupplyMedUsage?> GetByIdAsync(string id)
        {
            return await _dbSet.Include(s => s.MedicalIncident)
                .Include(s => s.MedicalSupply)
                .Include(s => s.Medication)
                .FirstOrDefaultAsync(s => s.UsageId == id);
        }

        public async Task<IEnumerable<SupplyMedUsage>> GetBySupplyIdAsync(string supplyId)
        {
            return await _dbSet.Where(s => s.SupplyId == supplyId).ToListAsync();
        }

        public async Task<IEnumerable<SupplyMedUsage>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet.Where(s => s.StudentId == studentId).ToListAsync();
        }

        public async Task<IEnumerable<SupplyMedUsage>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(s => s.UsageTime >= startDate && s.UsageTime <= endDate).ToListAsync();
        }
    }
} 