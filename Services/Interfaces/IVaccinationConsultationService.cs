using Businessobjects.Models;

namespace Services.Interfaces
{
    public interface IVaccinationConsultationService
    {
        Task<IEnumerable<VaccinationConsultation>> GetAllAsync();
        Task<VaccinationConsultation> GetByIdAsync(string id);
        Task<VaccinationConsultation> AddAsync(VaccinationConsultation consultation);
        Task UpdateAsync(VaccinationConsultation consultation);
        Task DeleteAsync(string id);
        
        // Specific methods for consultations
        Task<IEnumerable<VaccinationConsultation>> GetByStudentIdAsync(string studentId);
        Task<IEnumerable<VaccinationConsultation>> GetByParentIdAsync(string parentId);
        Task<IEnumerable<VaccinationConsultation>> GetByMedicalStaffIdAsync(string medicalStaffId);
        Task<IEnumerable<VaccinationConsultation>> GetByStatusAsync(string status);
        Task<IEnumerable<VaccinationConsultation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Workflow methods
        Task<VaccinationConsultation> ScheduleConsultationAsync(string healthCheckResultId, string studentId, string parentId, string medicalStaffId, DateTime scheduledDateTime, string reason);
        Task<VaccinationConsultation> CompleteConsultationAsync(string id, string outcome, string recommendations);
        Task<VaccinationConsultation> CancelConsultationAsync(string id, string reason);
        Task<IEnumerable<VaccinationConsultation>> GetUpcomingConsultationsAsync(string medicalStaffId);
        Task<IEnumerable<VaccinationConsultation>> GetPendingConsultationsAsync();
    }
} 