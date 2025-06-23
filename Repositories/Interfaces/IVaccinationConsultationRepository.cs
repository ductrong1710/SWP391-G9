using Businessobjects.Models;

namespace Repositories.Interfaces
{
    public interface IVaccinationConsultationRepository : IGenericRepository<VaccinationConsultation>
    {
        Task<IEnumerable<VaccinationConsultation>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<VaccinationConsultation>> GetByParentIdAsync(string parentId);
        Task<IEnumerable<VaccinationConsultation>> GetByMedicalStaffIdAsync(string medicalStaffId);
        Task<IEnumerable<VaccinationConsultation>> GetByStatusAsync(string status);
        Task<IEnumerable<VaccinationConsultation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<VaccinationConsultation>> GetUpcomingConsultationsAsync(string medicalStaffId);
    }
} 