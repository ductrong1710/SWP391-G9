using Businessobjects.Data;
using Businessobjects.Models;
using Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class IncidentInvolvementRepository : GenericRepository<IncidentInvolvement>, IIncidentInvolvementRepository
    {
        public IncidentInvolvementRepository(ApplicationDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<IncidentInvolvement>> GetAllAsync()
        {
            return await _dbSet.Include(i => i.MedicalIncident)
                .Include(i => i.Student)
                .ToListAsync();
        }

        public override async Task<IncidentInvolvement?> GetByIdAsync(string id)
        {
            return await _dbSet.Include(i => i.MedicalIncident)
                .Include(i => i.Student)
                .FirstOrDefaultAsync(i => i.InvolvementId == id);
        }

        public async Task<IEnumerable<IncidentInvolvement>> GetByIncidentIdAsync(string incidentId)
        {
            return await _dbSet.Where(i => i.IncidentId == incidentId).ToListAsync();
        }

        public async Task<IEnumerable<IncidentInvolvement>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet.Where(i => i.StudentId == studentId).ToListAsync();
        }
    }
} 