using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class VaccinationHealthCheckResultRepository : GenericRepository<VaccinationHealthCheckResult>, IVaccinationHealthCheckResultRepository
    {
        public VaccinationHealthCheckResultRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByHealthCheckIdAsync(string healthCheckId)
        {
            return await _dbSet.Where(r => r.HealthCheckId == healthCheckId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByMedicalStaffIdAsync(string medicalStaffId)
        {
            return await _dbSet.Where(r => r.MedicalStaffId == medicalStaffId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(r => r.CheckDate >= startDate && r.CheckDate <= endDate).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByRecommendationAsync(string recommendation)
        {
            return await _dbSet.Where(r => r.VaccinationRecommendation == recommendation).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetAbnormalResultsByPlanIdAsync(string planId)
        {
            return await _dbSet
                .Include(r => r.HealthCheck)
                .Where(r => r.HealthCheck.VaccinationPlanId == planId &&
                             (r.VaccinationRecommendation == "Deferred" || r.VaccinationRecommendation == "NotRecommended"))
                .ToListAsync();
        }
    }
} 