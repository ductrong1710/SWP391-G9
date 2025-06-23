using Businessobjects.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace Services.Implements
{
    public class VaccinationHealthCheckResultService : IVaccinationHealthCheckResultService
    {
        private readonly IVaccinationHealthCheckResultRepository _repository;
        private readonly IVaccinationHealthCheckRepository _healthCheckRepository;

        public VaccinationHealthCheckResultService(
            IVaccinationHealthCheckResultRepository repository,
            IVaccinationHealthCheckRepository healthCheckRepository)
        {
            _repository = repository;
            _healthCheckRepository = healthCheckRepository;
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<VaccinationHealthCheckResult?> GetByIdAsync(string id)
   {
       return await _repository.GetByIdAsync(id);
   }

        public async Task<VaccinationHealthCheckResult> AddAsync(VaccinationHealthCheckResult result)
        {
            result.Id = GenerateId();
            result.CheckDate = DateTime.Now;
            
            return await _repository.AddAsync(result);
        }

        public async Task UpdateAsync(VaccinationHealthCheckResult result)
        {
            await _repository.UpdateAsync(result);
        }

        public async Task DeleteAsync(string id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByHealthCheckIdAsync(string healthCheckId)
        {
            return await _repository.GetByHealthCheckIdAsync(healthCheckId);
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByMedicalStaffIdAsync(string medicalStaffId)
        {
            return await _repository.GetByMedicalStaffIdAsync(medicalStaffId);
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _repository.GetByDateRangeAsync(startDate, endDate);
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetByRecommendationAsync(string recommendation)
        {
            return await _repository.GetByRecommendationAsync(recommendation);
        }

        public async Task<VaccinationHealthCheckResult> PerformHealthCheckAsync(string healthCheckId, string medicalStaffId, VaccinationHealthCheckResult result)
        {
            // Verify the health check exists and is approved
            var healthCheck = await _healthCheckRepository.GetByIdAsync(healthCheckId);
            if (healthCheck == null)
                throw new KeyNotFoundException("Health check not found");
                
            if (healthCheck.Status != "Approved")
                throw new InvalidOperationException("Health check must be approved before performing examination");
            
            result.HealthCheckId = healthCheckId;
            result.MedicalStaffId = medicalStaffId;
            result.CheckDate = DateTime.Now;
            
            // Determine recommendation based on health check results
            result.VaccinationRecommendation = DetermineRecommendation(result);
            result.RecommendationReason = GetRecommendationReason(result);
            
            // Update health check status
            healthCheck.Status = "Completed";
            await _healthCheckRepository.UpdateAsync(healthCheck);
            
            return await AddAsync(result);
        }

        public async Task<IEnumerable<VaccinationHealthCheckResult>> GetAbnormalResultsAsync(string planId)
        {
            return await _repository.GetAbnormalResultsByPlanIdAsync(planId);
        }

        public async Task<bool> RequiresConsultationAsync(string resultId)
        {
            var result = await GetByIdAsync(resultId);
            if (result == null)
                return false;
                
            // Check if consultation is required based on results
            return result.VaccinationRecommendation == "Deferred" || 
                   result.VaccinationRecommendation == "NotRecommended" ||
                   result.HasFever == true ||
                   result.HasOtherSymptoms == true ||
                   result.GeneralCondition == "Poor";
        }

        private string DetermineRecommendation(VaccinationHealthCheckResult result)
        {
            // Logic to determine vaccination recommendation
            if (result.HasFever == true || result.GeneralCondition == "Poor")
                return "Deferred";
                
            if (result.HasOtherSymptoms == true && !string.IsNullOrEmpty(result.OtherSymptomsDetails))
                return "Deferred";
                
            if (result.Temperature > 37.5m)
                return "Deferred";
                
            if (result.BloodPressureSystolic > 140 || result.BloodPressureDiastolic > 90)
                return "Deferred";
                
            return "Approved";
        }

        private string GetRecommendationReason(VaccinationHealthCheckResult result)
        {
            if (result.VaccinationRecommendation == "Deferred")
            {
                if (result.HasFever == true)
                    return "Student has fever";
                if (result.Temperature > 37.5m)
                    return "Elevated temperature";
                if (result.HasOtherSymptoms == true)
                    return "Other symptoms present";
                if (result.GeneralCondition == "Poor")
                    return "Poor general condition";
                return "Health conditions require deferral";
            }
            
            if (result.VaccinationRecommendation == "NotRecommended")
                return "Health conditions contraindicate vaccination";
                
            return "Student is healthy and eligible for vaccination";
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