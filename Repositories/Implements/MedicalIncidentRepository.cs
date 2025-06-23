using Businessobjects.Data;
using Businessobjects.Models;
using Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class MedicalIncidentRepository : GenericRepository<MedicalIncident>, IMedicalIncidentRepository
    {
        public MedicalIncidentRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<MedicalIncident>> GetAllAsync()
        {
            return await _dbSet.Include(i => i.MedicalStaff)
                .Include(i => i.IncidentInvolvements)
                .Include(i => i.SupplyMedUsages)
                .ToListAsync();
        }

        public override async Task<MedicalIncident?> GetByIdAsync(string id)
        {
            return await _dbSet.Include(i => i.MedicalStaff)
                .Include(i => i.IncidentInvolvements)
                .Include(i => i.SupplyMedUsages)
                .FirstOrDefaultAsync(i => i.IncidentId == id);
        }

        public async Task<IEnumerable<MedicalIncident>> GetByReporterIdAsync(string reporterId)
        {
            return await _dbSet.Where(m => m.ReporterId == reporterId).ToListAsync();
        }

        public async Task<IEnumerable<MedicalIncident>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(m => m.IncidentDate >= startDate && m.IncidentDate <= endDate).ToListAsync();
        }
    }
} 