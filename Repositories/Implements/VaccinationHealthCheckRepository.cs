using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class VaccinationHealthCheckRepository : GenericRepository<VaccinationHealthCheck>, IVaccinationHealthCheckRepository
    {
        public VaccinationHealthCheckRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAsync(string planId)
        {
            return await _dbSet.Where(h => h.VaccinationPlanId == planId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet.Where(h => h.StudentId == studentId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByParentIdAsync(string parentId)
        {
            return await _dbSet.Where(h => h.ParentId == parentId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(h => h.Status == status).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheck>> GetByPlanIdAndStatusAsync(string planId, string status)
        {
            return await _dbSet.Where(h => h.VaccinationPlanId == planId && h.Status == status).ToListAsync();
        }
    }
} 