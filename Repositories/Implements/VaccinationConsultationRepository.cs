using Businessobjects.Data;
using Businessobjects.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implements
{
    public class VaccinationConsultationRepository : GenericRepository<VaccinationConsultation>, IVaccinationConsultationRepository
    {
        public VaccinationConsultationRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByStudentIdAsync(string studentId)
        {
            return await _dbSet.Where(c => c.StudentId == studentId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByParentIdAsync(string parentId)
        {
            return await _dbSet.Where(c => c.ParentId == parentId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByMedicalStaffIdAsync(string medicalStaffId)
        {
            return await _dbSet.Where(c => c.MedicalStaffId == medicalStaffId).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByStatusAsync(string status)
        {
            return await _dbSet.Where(c => c.Status == status).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet.Where(c => c.ScheduledDateTime >= startDate && c.ScheduledDateTime <= endDate).ToListAsync();
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetUpcomingConsultationsAsync(string medicalStaffId)
        {
            return await _dbSet
                .Where(c => c.MedicalStaffId == medicalStaffId && c.ScheduledDateTime >= DateTime.Now)
                .OrderBy(c => c.ScheduledDateTime)
                .ToListAsync();
        }
    }
} 