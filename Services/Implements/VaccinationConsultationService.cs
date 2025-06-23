using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Services.Implements
{
    public class VaccinationConsultationService : IVaccinationConsultationService
    {
        private readonly IVaccinationConsultationRepository _repository;
        private readonly IVaccinationHealthCheckResultRepository _resultRepository;

        public VaccinationConsultationService(
            IVaccinationConsultationRepository repository,
            IVaccinationHealthCheckResultRepository resultRepository)
        {
            _repository = repository;
            _resultRepository = resultRepository;
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<VaccinationConsultation?> GetByIdAsync(string id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<VaccinationConsultation> AddAsync(VaccinationConsultation consultation)
        {
            consultation.Id = GenerateId();
            consultation.Status = "Scheduled";
            
            return await _repository.AddAsync(consultation);
        }

        public async Task UpdateAsync(VaccinationConsultation consultation)
        {
            await _repository.UpdateAsync(consultation);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByStudentIdAsync(string studentId)
        {
            return await _repository.GetByStudentIdAsync(studentId);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByParentIdAsync(string parentId)
        {
            return await _repository.GetByParentIdAsync(parentId);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByMedicalStaffIdAsync(string medicalStaffId)
        {
            return await _repository.GetByMedicalStaffIdAsync(medicalStaffId);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByStatusAsync(string status)
        {
            return await _repository.GetByStatusAsync(status);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _repository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<VaccinationConsultation> ScheduleConsultationAsync(string healthCheckResultId, string studentId, string parentId, string medicalStaffId, DateTime scheduledDateTime, string reason)
        {
            // Verify the health check result exists
            var result = await _resultRepository.GetByIdAsync(healthCheckResultId);
            if (result == null)
                throw new KeyNotFoundException("Health check result not found");
            
            var consultation = new VaccinationConsultation
            {
                HealthCheckResultId = healthCheckResultId,
                StudentId = studentId,
                ParentId = parentId,
                MedicalStaffId = medicalStaffId,
                ScheduledDateTime = scheduledDateTime,
                Reason = reason,
                Status = "Scheduled",
                ConsultationType = "InPerson" // Default type
            };
            
            return await AddAsync(consultation);
        }

        public async Task<VaccinationConsultation> CompleteConsultationAsync(string id, string outcome, string recommendations)
        {
            var consultation = await GetByIdAsync(id);
            if (consultation == null)
                throw new KeyNotFoundException("Consultation not found");
                
            consultation.Status = "Completed";
            consultation.ConsultationOutcome = outcome;
            consultation.Recommendations = recommendations;
            consultation.CompletedDateTime = DateTime.Now;
            
            await UpdateAsync(consultation);
            return consultation;
        }

        public async Task<VaccinationConsultation> CancelConsultationAsync(string id, string reason)
        {
            var consultation = await GetByIdAsync(id);
            if (consultation == null)
                throw new KeyNotFoundException("Consultation not found");
                
            consultation.Status = "Cancelled";
            consultation.CancellationReason = reason;
            
            await UpdateAsync(consultation);
            return consultation;
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetUpcomingConsultationsAsync(string medicalStaffId)
        {
            return await _repository.GetUpcomingConsultationsAsync(medicalStaffId);
        }

        public async Task<IEnumerable<VaccinationConsultation>> GetPendingConsultationsAsync()
        {
            return await _repository.GetByStatusAsync("Scheduled");
        }

        private string GenerateId()
        {
            using (var sha256 = SHA256.Create())
            {
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(Guid.NewGuid().ToString()));
                return Convert.ToHexString(hash).Substring(0, 6).ToUpper();
            }
        }
    }
} 